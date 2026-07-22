import { isValidElement, type ComponentPropsWithoutRef, type ReactElement, type ReactNode } from "react";

import { CopyButton } from "@/components/mdx/copy-button";
import { flattenText } from "@/lib/utils";

type CodeNodeProps = { className?: string; children?: ReactNode };

function getCodeNode(children: ReactNode) {
  const candidate = Array.isArray(children) ? children.find(isValidElement) : children;
  return isValidElement<CodeNodeProps>(candidate) ? (candidate as ReactElement<CodeNodeProps>) : undefined;
}

export function CodeBlock({ children, ...props }: ComponentPropsWithoutRef<"pre">) {
  const node = getCodeNode(children);
  const className = node?.props.className ?? "";
  const language = className.match(/language-([^\s]+)/)?.[1] ?? "code";
  const code = flattenText(node?.props.children ?? children).replace(/\n$/, "");

  return (
    <div className="not-prose group my-5 overflow-hidden rounded-xl border border-slate-800 bg-[#0b1220] shadow-sm">
      <div className="flex h-9 items-center justify-between border-b border-white/10 bg-white/[0.035] px-3">
        <span className="font-mono text-[11px] font-medium uppercase tracking-wider text-slate-400">{language}</span>
        <CopyButton code={code} />
      </div>
      <pre {...props} className="overflow-x-auto p-4 text-[13px] leading-6 text-slate-100 sm:p-5">
        {node ? <code className={className}>{node.props.children}</code> : children}
      </pre>
    </div>
  );
}
