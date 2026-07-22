import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

import { slugify } from "@/lib/utils";
import type { DocFrontmatter, DocumentationPage, SearchDocument, TableOfContentsItem } from "@/types/docs";

const DOCS_DIRECTORY = path.join(process.cwd(), "content", "docs");
const CATEGORY_ORDER = [
  "Foundations",
  "Beginner",
  "Intermediate",
  "Data Structures",
  "Algorithms",
  "Advanced Data Structures",
];

function asStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return [...new Set(value.filter((item): item is string => typeof item === "string").map((item) => item.trim()).filter(Boolean))];
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
    order: typeof data.order === "number" && Number.isFinite(data.order) ? data.order : 999,
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

function withoutCodeBlocks(source: string) {
  return source.replace(/(^|\n)(`{3,}|~{3,})[^\n]*\n[\s\S]*?\n\2[^\n]*(?=\n|$)/g, "$1");
}

export function getTableOfContents(source: string): TableOfContentsItem[] {
  const withoutCode = withoutCodeBlocks(source);
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
  const words = withoutCodeBlocks(source)
    .replace(/<[^>]+>/g, "")
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 210));
}

function sourceToSearchableText(source: string) {
  return source
    .replace(/^(?:```|~~~)[^\n]*$/gm, " ")
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
  const groups = getAllDocs().reduce<Record<string, DocumentationPage[]>>((groups, doc) => {
    groups[doc.category] ??= [];
    groups[doc.category].push(doc);
    return groups;
  }, {});

  return Object.fromEntries(
    Object.entries(groups).sort(([firstCategory], [secondCategory]) => {
      const firstIndex = CATEGORY_ORDER.indexOf(firstCategory);
      const secondIndex = CATEGORY_ORDER.indexOf(secondCategory);
      return (firstIndex === -1 ? CATEGORY_ORDER.length : firstIndex) - (secondIndex === -1 ? CATEGORY_ORDER.length : secondIndex) || firstCategory.localeCompare(secondCategory);
    }),
  );
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

export function getRelatedDocs(doc: DocumentationPage, limit = 4): DocumentationPage[] {
  const docs = getAllDocs();
  const explicitlyRelated = (doc.related ?? [])
    .map((relatedSlug) => docs.find((item) => item.slug === relatedSlug))
    .filter((item): item is DocumentationPage => item !== undefined && item.slug !== doc.slug);
  const selectedSlugs = new Set(explicitlyRelated.map((item) => item.slug));
  const inferredRelated = docs
    .filter((item) => item.slug !== doc.slug && !selectedSlugs.has(item.slug))
    .map((item) => ({
      item,
      score:
        (item.category === doc.category ? 12 : 0) +
        item.tags.filter((tag) => doc.tags.includes(tag)).length * 3 +
        (doc.prerequisites?.includes(item.slug) ? 2 : 0),
    }))
    .sort((first, second) => second.score - first.score || first.item.order - second.item.order || first.item.title.localeCompare(second.item.title))
    .map(({ item }) => item);

  return [...explicitlyRelated, ...inferredRelated].slice(0, limit);
}
