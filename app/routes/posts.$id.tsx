//app/routes/posts.$id.tsx
import { LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { getBlogDetail, mergeBlogContent } from "~/libs/microcms";
import type { Blog } from "~/types";

export const loader: LoaderFunction = async ({ params }) => {
  const { id } = params;
  const blog = await getBlogDetail(id as string);
  const fullHtml = mergeBlogContent(blog);
  blog.content = fullHtml;

  return { blog };
};

export default function Post() {
  const { blog } = useLoaderData<{ blog: Blog }>();

  return (
    <div id="blogdetail" className="flex flex-col justify-center items-center">
      <h1 className="font-bold text-3xl mt-4 mb-4">{blog.title}</h1>
      <p className="text-2xl ">
        公開日時:{new Date(blog.publishedAt).toLocaleDateString()}
      </p>
      <div
        className="w-full max-w-prose px-4 text-left"
        dangerouslySetInnerHTML={{ __html: blog.content }}
      />
    </div>
  );
}
