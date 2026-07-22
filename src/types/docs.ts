export type DocFrontmatter = {
  title: string;
  description: string;
  category: string;
  order: number;
  tags: string[];
  related?: string[];
  prerequisites?: string[];
  featured?: boolean;
  level?: "Beginner" | "Intermediate" | "Advanced" | "Foundation";
};

export type TableOfContentsItem = {
  id: string;
  text: string;
  level: 2 | 3;
};

export type DocumentationPage = DocFrontmatter & {
  slug: string;
  source: string;
  readingTime: number;
  toc: TableOfContentsItem[];
};

export type SearchDocument = Pick<
  DocumentationPage,
  "slug" | "title" | "description" | "category" | "tags"
> & {
  content: string;
};
