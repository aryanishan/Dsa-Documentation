import type { ComponentPropsWithoutRef, ReactNode } from "react";

import { CodeBlock } from "@/components/mdx/code-block";
import { cn, flattenText, slugify } from "@/lib/utils";

function Heading({ as: Tag, children, className, ...props }: ComponentPropsWithoutRef<"h2"> & { as: "h2" | "h3" }) {
  const id = slugify(flattenText(children));
  return <Tag id={id} className={className} {...props}>{children}</Tag>;
}

export function Callout({ children, type = "tip" }: { children: ReactNode; type?: "tip" | "note" | "warning" }) {
  const styles = {
    tip: "border-sky-200 bg-sky-50/70 text-sky-950 dark:border-sky-900/70 dark:bg-sky-950/30 dark:text-sky-100",
    note: "border-violet-200 bg-violet-50/70 text-violet-950 dark:border-violet-900/70 dark:bg-violet-950/30 dark:text-violet-100",
    warning: "border-amber-200 bg-amber-50/70 text-amber-950 dark:border-amber-900/70 dark:bg-amber-950/30 dark:text-amber-100",
  };
  return <aside className={cn("my-6 rounded-xl border px-4 py-3 text-sm leading-6", styles[type])}>{children}</aside>;
}

export function Diagram({ title, children }: { title?: string; children: ReactNode }) {
  return (
    <figure className="my-6 overflow-hidden rounded-xl border border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900/50">
      {title ? <figcaption className="border-b border-slate-200 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:border-slate-800">{title}</figcaption> : null}
      <div className="overflow-x-auto p-4 font-mono text-sm leading-6 text-slate-700 dark:text-slate-300">{children}</div>
    </figure>
  );
}

export const mdxComponents = {
  h2: ({ children, ...props }: ComponentPropsWithoutRef<"h2">) => <Heading as="h2" className="scroll-mt-24 mt-12 border-b border-slate-200 pb-3 text-2xl font-bold tracking-tight text-slate-950 first:mt-0 dark:border-slate-800 dark:text-slate-50" {...props}>{children}</Heading>,
  h3: ({ children, ...props }: ComponentPropsWithoutRef<"h3">) => <Heading as="h3" className="scroll-mt-24 mt-8 text-xl font-semibold tracking-tight text-slate-900 dark:text-slate-100" {...props}>{children}</Heading>,
  p: ({ className, ...props }: ComponentPropsWithoutRef<"p">) => <p className={cn("my-4 leading-7 text-slate-700 dark:text-slate-300", className)} {...props} />,
  a: ({ className, ...props }: ComponentPropsWithoutRef<"a">) => <a className={cn("font-medium text-sky-700 underline decoration-sky-300 underline-offset-4 hover:text-sky-900 dark:text-sky-400 dark:decoration-sky-800 dark:hover:text-sky-300", className)} {...props} />,
  ul: ({ className, ...props }: ComponentPropsWithoutRef<"ul">) => <ul className={cn("my-4 list-disc space-y-2 pl-6 text-slate-700 marker:text-sky-500 dark:text-slate-300", className)} {...props} />,
  ol: ({ className, ...props }: ComponentPropsWithoutRef<"ol">) => <ol className={cn("my-4 list-decimal space-y-2 pl-6 text-slate-700 marker:font-semibold marker:text-sky-600 dark:text-slate-300", className)} {...props} />,
  li: ({ className, ...props }: ComponentPropsWithoutRef<"li">) => <li className={cn("pl-1 leading-7", className)} {...props} />,
  blockquote: ({ className, ...props }: ComponentPropsWithoutRef<"blockquote">) => <blockquote className={cn("my-5 border-l-4 border-sky-500 bg-sky-50/50 px-4 py-2 italic text-slate-700 dark:bg-sky-950/20 dark:text-slate-300", className)} {...props} />,
  hr: () => <hr className="my-10 border-slate-200 dark:border-slate-800" />,
  table: ({ className, ...props }: ComponentPropsWithoutRef<"table">) => <div className="my-5 overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800"><table className={cn("w-full text-left text-sm", className)} {...props} /></div>,
  th: ({ className, ...props }: ComponentPropsWithoutRef<"th">) => <th className={cn("border-b border-slate-200 bg-slate-50 px-3 py-2.5 font-semibold text-slate-900 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100", className)} {...props} />,
  td: ({ className, ...props }: ComponentPropsWithoutRef<"td">) => <td className={cn("border-b border-slate-100 px-3 py-2.5 align-top leading-6 text-slate-700 last:border-0 dark:border-slate-800/70 dark:text-slate-300", className)} {...props} />,
  pre: CodeBlock,
  code: ({ className, ...props }: ComponentPropsWithoutRef<"code">) => className ? <code className={className} {...props} /> : <code className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[0.85em] text-sky-800 dark:bg-slate-800 dark:text-sky-300" {...props} />,
  Callout,
  Diagram,
};
