import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Download } from "lucide-react";
import Button from "@/components/shared/Button";

export default function MarkdownContentRenderer({
  markdown,
  title = "lesson",
}: {
  markdown: string;
  title?: string;
}) {
  const download = () => {
    const blob = new Blob([markdown], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${title.replace(/[^a-z0-9]+/gi, "-")}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white dark:bg-deep-surface rounded-3xl ss-edge overflow-hidden">
      <div className="flex items-center justify-between gap-2 px-5 py-3 border-b-2 border-ss-ink-900 dark:border-white/50 bg-soft-cream dark:bg-deep-cream/40">
        <span className="eyebrow">Document</span>
        <Button variant="pill" size="sm" icon={<Download className="w-3.5 h-3.5" />} onClick={download}>
          Download .md
        </Button>
      </div>
      <article className="p-6 md:p-10 prose prose-lg max-w-none ss-prose">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{markdown}</ReactMarkdown>
      </article>
    </div>
  );
}
