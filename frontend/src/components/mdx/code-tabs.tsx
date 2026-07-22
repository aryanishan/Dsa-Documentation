"use client";

import React, { ReactElement } from "react";
import * as Tabs from "@radix-ui/react-tabs";
import { cn } from "@/lib/utils";

export function CodeTabs({ children, className }: { children: React.ReactNode; className?: string }) {
  const tabs = React.Children.toArray(children).filter(React.isValidElement) as ReactElement<{ language?: string; title?: string }>[];

  if (!tabs.length) return <div className={className}>{children}</div>;

  return (
    <Tabs.Root defaultValue={tabs[0].props.language || "tab-0"} className={cn("my-6", className)}>
      <Tabs.List className="flex overflow-x-auto border-b border-slate-200 dark:border-slate-800 scrollbar-hide">
        {tabs.map((tab, i) => (
          <Tabs.Trigger
            key={tab.props.language || `tab-${i}`}
            value={tab.props.language || `tab-${i}`}
            className="whitespace-nowrap border-b-2 border-transparent px-4 py-2 text-sm font-medium text-slate-500 transition-colors data-[state=active]:border-sky-500 data-[state=active]:text-sky-600 hover:text-slate-700 dark:text-slate-400 dark:data-[state=active]:text-sky-400 dark:hover:text-slate-200"
          >
            {tab.props.title || tab.props.language}
          </Tabs.Trigger>
        ))}
      </Tabs.List>
      {tabs.map((tab, i) => (
        <Tabs.Content
          key={tab.props.language || `tab-${i}`}
          value={tab.props.language || `tab-${i}`}
          className="[&>div]:!mt-3"
        >
          {tab}
        </Tabs.Content>
      ))}
    </Tabs.Root>
  );
}

export function CodeTab({ children }: { language: string; title?: string; children: React.ReactNode }) {
  return <>{children}</>;
}
