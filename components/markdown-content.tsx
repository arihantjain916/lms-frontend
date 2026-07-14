"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { cn } from "@/lib/utils";

export default function MarkdownContent({
  source,
  className,
}: {
  source: string;
  className?: string;
}) {
  return (
    <article className={cn("markdown-content text-slate-700", className)}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => <h1 className="mb-5 mt-10 text-4xl font-bold tracking-tight text-slate-950 first:mt-0">{children}</h1>,
          h2: ({ children }) => <h2 className="mb-4 mt-9 text-3xl font-bold tracking-tight text-slate-950">{children}</h2>,
          h3: ({ children }) => <h3 className="mb-3 mt-7 text-2xl font-semibold text-slate-950">{children}</h3>,
          p: ({ children }) => <p className="my-5 leading-8">{children}</p>,
          a: ({ href, children }) => <a href={href} className="font-medium text-blue-700 underline underline-offset-4 hover:text-blue-900" target={href?.startsWith("http") ? "_blank" : undefined} rel={href?.startsWith("http") ? "noreferrer" : undefined}>{children}</a>,
          ul: ({ children }) => <ul className="my-5 list-disc space-y-2 pl-7">{children}</ul>,
          ol: ({ children }) => <ol className="my-5 list-decimal space-y-2 pl-7">{children}</ol>,
          blockquote: ({ children }) => <blockquote className="my-7 border-l-4 border-blue-500 bg-blue-50 px-5 py-2 italic text-slate-700">{children}</blockquote>,
          hr: () => <hr className="my-10 border-slate-200" />,
          code: ({ className: codeClassName, children, ...props }) => <code className={cn("rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[.9em] text-slate-900", codeClassName)} {...props}>{children}</code>,
          pre: ({ children }) => <pre className="my-6 overflow-x-auto rounded-xl bg-slate-950 p-5 text-sm leading-6 text-slate-100 [&_code]:bg-transparent [&_code]:p-0 [&_code]:text-inherit">{children}</pre>,
          table: ({ children }) => <div className="my-7 overflow-x-auto"><table className="w-full border-collapse text-left text-sm">{children}</table></div>,
          th: ({ children }) => <th className="border bg-slate-50 px-4 py-3 font-semibold text-slate-950">{children}</th>,
          td: ({ children }) => <td className="border px-4 py-3">{children}</td>,
          img: ({ src, alt }) => <img src={src || ""} alt={alt || ""} className="my-8 max-h-[560px] w-full rounded-xl object-cover" loading="lazy" />,
        }}
      >
        {source}
      </ReactMarkdown>
    </article>
  );
}
