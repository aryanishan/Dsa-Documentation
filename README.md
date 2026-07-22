# AlgoNotes — DSA Documentation Platform

A fast, responsive, MDX-powered documentation platform for learning and revising data structures and algorithms. It is built with Next.js 15 App Router, TypeScript, Tailwind CSS, and Shadcn-compatible UI primitives.

## Highlights

- 20 complete DSA lessons, each with definition, intuition, analogy, visual, complexity tables, C++/Java/Python implementations, dry run, mistakes, interview questions, practice prompts, and advanced notes.
- Filesystem-based MDX content collection with automatically generated sidebar, table of contents, reading time, related lessons, and previous/next navigation.
- Fast client-side full-text search across titles, tags, prose, complexity discussions, and fenced code snippets. Open it with `Ctrl/Cmd + K`.
- Responsive documentation shell: mobile navigation, desktop sidebar, contextual table of contents, breadcrumb navigation, and scroll progress indicator.
- Accessible dark/light/system theming, keyboard-focus states, skip link, semantic landmarks, and dialog labels.
- SEO-first metadata, canonical URLs, Open Graph and Twitter metadata, per-lesson JSON-LD, `sitemap.xml`, `robots.txt`, and a web manifest.
- Vercel-ready static generation for every lesson.

## Stack

- Next.js 15, React 19, TypeScript
- Tailwind CSS 3 and Shadcn-style UI primitives
- MDX rendered through `next-mdx-remote`, with GFM tables and syntax highlighting through `rehype-highlight`
- `gray-matter` for MDX frontmatter

## Run locally

Requires Node.js 20.9 or newer.

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Useful checks:

```bash
npm run typecheck
npm run lint
npm run build
npm start
```

## Environment variables

Copy the example file if you need canonical production URLs locally:

```bash
cp .env.example .env.local
```

| Variable | Purpose | Example |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Canonical public site URL used by metadata, sitemap, and structured data. | `https://docs.example.com` |

When omitted, the app uses `https://algonotes.vercel.app` as a safe placeholder. Set it in the Vercel project before production deployment.

## Project structure

```text
content/docs/                    MDX lessons and frontmatter
src/app/(site)/                  Marketing, roadmap, and documentation routes
src/app/(site)/docs/[slug]/      Static documentation route
src/app/sitemap.ts               Dynamic sitemap generated from MDX content
src/app/robots.ts                Search-engine rules
src/components/docs/             Docs layout, navigation, TOC, and progress UI
src/components/mdx/              MDX renderers, highlighted code blocks, copy button
src/components/ui/               Shadcn-compatible reusable UI primitives
src/lib/docs.ts                  Content loading, navigation, TOC, reading-time, search index
src/lib/site.ts                  Site metadata and roadmap sequence
```

## Add or edit a lesson

Create a new `content/docs/<slug>.mdx` file. Navigation is derived automatically from frontmatter; no sidebar configuration is needed.

```mdx
---
title: Example Topic
description: A concise search-friendly summary.
category: Foundations
order: 21
tags: [example, pattern]
related: [arrays, recursion]
prerequisites: [time-complexity]
featured: false
level: Beginner
---

## Definition

Your content here.
```

Use `##` and `###` headings for the automatic right-side table of contents. Fenced code blocks receive language labels, syntax highlighting, and a copy button automatically. The existing lessons establish the standard heading contract.

## Search design

At render time, the server builds a small serializable index from all MDX files and passes it to the client search dialog. The index includes title, description, tags, prose, and code-fence text. The client scores title/tag/exact-content matches locally, so searches need no external service or round trip.

For a much larger corpus, replace `getSearchIndex()` with a generated FlexSearch/Algolia index while preserving the `SearchDocument` contract in `src/types/docs.ts`.

## Deploy to Vercel

1. Push this directory to a Git repository.
2. Import the repository in [Vercel](https://vercel.com/new).
3. Select the default Next.js framework preset; no custom build command is necessary.
4. Set `NEXT_PUBLIC_SITE_URL` to the final deployment URL or custom domain.
5. Deploy. Vercel runs `npm run build`, statically pre-renders the lesson pages, and serves sitemap/robots metadata automatically.

The app uses only repository content at build time, so it is compatible with Vercel's default serverless/static deployment behavior.

## Content coverage

- Foundations: Time Complexity, Space Complexity, Recursion, Bit Manipulation
- Linear structures: Arrays, Strings, Linked Lists, Stack, Queue
- Trees and lookup: Trees, Binary Search Trees, Heap, Hashing, Tries
- Algorithms: Graphs, Greedy Algorithms, Dynamic Programming, Backtracking
- Advanced structures: Segment Trees, Disjoint Set Union

## License

MIT — customize this section for your organization before publishing.
