import { MDXRemote } from "next-mdx-remote/rsc";

export function ActionPlanRenderer({ content }: { content: string }) {
  return (
    <div className="prose prose-zinc dark:prose-invert prose-sm max-w-none">
      <MDXRemote source={content} />
    </div>
  );
}
