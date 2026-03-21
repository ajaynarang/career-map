import { MDXRemote } from "next-mdx-remote/rsc";

export function MDXContent({ source }: { source: string }) {
  return (
    <div className="prose prose-zinc dark:prose-invert prose-sm max-w-none">
      <MDXRemote source={source} />
    </div>
  );
}
