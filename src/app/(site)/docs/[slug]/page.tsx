import type { Metadata } from "next";
import { BookOpenCheck, CalendarClock, Clock3, Tag } from "lucide-react";
import { compileMDX } from "next-mdx-remote/rsc";
import { notFound } from "next/navigation";
import rehypeHighlight from "rehype-highlight";
import remarkGfm from "remark-gfm";

import { Breadcrumbs } from "@/components/docs/breadcrumbs";
import { DocNavigation } from "@/components/docs/doc-navigation";
import { DocsSidebar } from "@/components/docs/docs-sidebar";
import { ReadingProgress } from "@/components/docs/reading-progress";
import { RelatedTopics } from "@/components/docs/related-topics";
import { TableOfContents } from "@/components/docs/table-of-contents";
import { mdxComponents } from "@/components/mdx";
import { getAdjacentDocs, getAllDocs, getDocBySlug, getDocsByCategory, getRelatedDocs } from "@/lib/docs";
import { siteConfig } from "@/lib/site";
import { slugify } from "@/lib/utils";

type PageProps = { params: Promise<{ slug: string }> };
type RehypeNode = {
  type?: string;
  tagName?: string;
  value?: string;
  properties?: Record<string, unknown>;
  children?: RehypeNode[];
};

function nodeText(node: RehypeNode): string {
  if (typeof node.value === "string") return node.value;
  return node.children?.map(nodeText).join("") ?? "";
}

function rehypeHeadingIds() {
  return (tree: RehypeNode) => {
    const usedIds = new Map<string, number>();
    const visit = (node: RehypeNode) => {
      if (node.type === "element" && (node.tagName === "h2" || node.tagName === "h3")) {
        const baseId = slugify(nodeText(node));
        const duplicate = usedIds.get(baseId) ?? 0;
        usedIds.set(baseId, duplicate + 1);
        node.properties = { ...node.properties, id: duplicate ? `${baseId}-${duplicate + 1}` : baseId };
      }
      node.children?.forEach(visit);
    };
    visit(tree);
  };
}

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllDocs().map((doc) => ({ slug: doc.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const doc = getDocBySlug(slug);
  if (!doc) return {};
  const url = `/docs/${doc.slug}`;
  return {
    title: doc.title,
    description: doc.description,
    alternates: { canonical: url },
    keywords: [doc.title, ...doc.tags, "data structures", "algorithms"],
    openGraph: { title: `${doc.title} | AlgoNotes`, description: doc.description, url, type: "article", tags: doc.tags },
    twitter: { card: "summary_large_image", title: `${doc.title} | AlgoNotes`, description: doc.description },
  };
}

export default async function DocumentationPage({ params }: PageProps) {
  const { slug } = await params;
  const doc = getDocBySlug(slug);
  if (!doc) notFound();

  const { content } = await compileMDX({
    source: doc.source,
    components: mdxComponents,
    options: { mdxOptions: { remarkPlugins: [remarkGfm], rehypePlugins: [rehypeHighlight, rehypeHeadingIds] } },
  });
  const groups = getDocsByCategory();
  const { previous, next } = getAdjacentDocs(doc.slug);
  const allDocs = getAllDocs();
  const prerequisites = (doc.prerequisites ?? [])
    .map((prerequisiteSlug) => allDocs.find((item) => item.slug === prerequisiteSlug))
    .filter((item): item is NonNullable<typeof item> => Boolean(item));
  const related = getRelatedDocs(doc);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: doc.title,
    description: doc.description,
    url: `${siteConfig.url}/docs/${doc.slug}`,
    keywords: doc.tags.join(", "),
    articleSection: doc.category,
    timeRequired: `PT${doc.readingTime}M`,
    isPartOf: { "@type": "WebSite", name: siteConfig.name, url: siteConfig.url },
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: siteConfig.url },
        { "@type": "ListItem", position: 2, name: "Documentation", item: `${siteConfig.url}/docs` },
        { "@type": "ListItem", position: 3, name: doc.title, item: `${siteConfig.url}/docs/${doc.slug}` },
      ],
    },
  };

  return (
    <>
      <ReadingProgress />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <div className="mx-auto grid max-w-[90rem] gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[15.5rem_minmax(0,1fr)] lg:px-8 xl:grid-cols-[15.5rem_minmax(0,1fr)_14rem] xl:gap-10">
        <DocsSidebar groups={groups} currentSlug={doc.slug} />
        <article className="min-w-0 max-w-3xl">
          <DocsSidebar groups={groups} currentSlug={doc.slug} mobile />
          <Breadcrumbs category={doc.category} title={doc.title} />
          <header className="border-b border-slate-200 pb-8 dark:border-slate-800">
            <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-slate-500"><span className="rounded-full bg-sky-50 px-2.5 py-1 text-sky-700 dark:bg-sky-950/50 dark:text-sky-300">{doc.level}</span><span>{doc.category}</span></div>
            <h1 className="mt-4 text-4xl font-bold tracking-[-0.035em] text-slate-950 sm:text-5xl dark:text-slate-50">{doc.title}</h1>
            <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-600 dark:text-slate-300">{doc.description}</p>
            <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-slate-500"><span className="inline-flex items-center gap-1.5"><Clock3 className="size-4" /> {doc.readingTime} min read</span><span className="inline-flex items-center gap-1.5"><CalendarClock className="size-4" /> Revision-friendly</span><span className="inline-flex items-center gap-1.5"><Tag className="size-4" /> {doc.tags.slice(0, 2).join(" · ")}</span></div>
          </header>
          <div className="docs-content pt-2">{content}</div>
          <RelatedTopics topics={related} />
          <DocNavigation previous={previous} next={next} />
        </article>
        <TableOfContents items={doc.toc} />
      </div>
    </>
  );
}
