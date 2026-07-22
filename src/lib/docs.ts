import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

import { slugify } from "@/lib/utils";
import type { DocFrontmatter, DocumentationPage, SearchDocument, TableOfContentsItem } from "@/types/docs";

const DOCS_DIRECTORY = path.join(process.cwd(), "content", "docs");

function asStringArray(value: unknown): string[] {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];
}

function getFrontmatter(data: Record<string, unknown>, fileName: string): DocFrontmatter {
  const category = typeof data.category === "string" ? data.category : "Foundations";
  const explicitLevel = data.level;
  const level =
    explicitLevel === "Beginner" ||
    explicitLevel === "Intermediate" ||
    explicitLevel === "Advanced" ||
    explicitLevel === "Foundation"
      ? explicitLevel
      : category === "Beginner"
        ? "Beginner"
        : category === "Intermediate" || category === "Data Structures"
          ? "Intermediate"
          : category === "Algorithms" || category === "Advanced Data Structures"
            ? "Advanced"
            : "Foundation";

  return {
    title: typeof data.title === "string" ? data.title : fileName,
    description: typeof data.description === "string" ? data.description : "DSA documentation page.",
    category,
    order: typeof data.order === "number" ? data.order : 999,
    tags: asStringArray(data.tags),
    related: asStringArray(data.related),
    prerequisites: asStringArray(data.prerequisites),
    featured: data.featured === true,
    level,
  };
}

function stripInlineMarkdown(value: string) {
  return value
    .replace(/\[(.*?)\]\(.*?\)/g, "$1")
    .replace(/[`*_~]/g, "")
    .trim();
}

export function getTableOfContents(source: string): TableOfContentsItem[] {
  const withoutCode = source.replace(/```[\s\S]*?```/g, "");
  const items: TableOfContentsItem[] = [];
  const usedIds = new Map<string, number>();

  for (const line of withoutCode.split("\n")) {
    const match = /^(#{2,3})\s+(.+?)\s*#*\s*$/.exec(line);
    if (!match) continue;
    const text = stripInlineMarkdown(match[2]);
    const baseId = slugify(text);
    const duplicate = usedIds.get(baseId) ?? 0;
    usedIds.set(baseId, duplicate + 1);
    items.push({
      id: duplicate ? `${baseId}-${duplicate + 1}` : baseId,
      text,
      level: match[1].length as 2 | 3,
    });
  }

  return items;
}

function getReadingTime(source: string) {
  const words = source
    .replace(/```[\s\S]*?```/g, "")
    .replace(/<[^>]+>/g, "")
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 210));
}

function sourceToSearchableText(source: string) {
  return source
    .replace(/```[a-zA-Z0-9+#-]*\n?/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/[>#*_[\]()`|]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function getAllDocs(): DocumentationPage[] {
  if (!fs.existsSync(DOCS_DIRECTORY)) return [];

  return fs
    .readdirSync(DOCS_DIRECTORY)
    .filter((file) => file.endsWith(".mdx"))
    .map((file) => {
      const raw = fs.readFileSync(path.join(DOCS_DIRECTORY, file), "utf8");
      const parsed = matter(raw);
      const source = parsed.content.trim();
      const slug = file.replace(/\.mdx$/, "");
      const frontmatter = getFrontmatter(parsed.data, slug);

      return {
        ...frontmatter,
        slug,
        source,
        readingTime: getReadingTime(source),
        toc: getTableOfContents(source),
      };
    })
    .sort((a, b) => a.order - b.order || a.title.localeCompare(b.title));
}

export function getDocBySlug(slug: string) {
  return getAllDocs().find((doc) => doc.slug === slug);
}

export function getDocsByCategory() {
  return getAllDocs().reduce<Record<string, DocumentationPage[]>>((groups, doc) => {
    groups[doc.category] ??= [];
    groups[doc.category].push(doc);
    return groups;
  }, {});
}

export function getSearchIndex(): SearchDocument[] {
  return getAllDocs().map(({ source, ...doc }) => ({
    slug: doc.slug,
    title: doc.title,
    description: doc.description,
    category: doc.category,
    tags: doc.tags,
    content: sourceToSearchableText(source),
  }));
}

export function getAdjacentDocs(slug: string) {
  const docs = getAllDocs();
  const index = docs.findIndex((doc) => doc.slug === slug);
  return {
    previous: index > 0 ? docs[index - 1] : undefined,
    next: index >= 0 && index < docs.length - 1 ? docs[index + 1] : undefined,
  };
}
