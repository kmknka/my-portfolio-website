// app/routes/_index.tsx
import { MetaFunction, LoaderFunction } from "@remix-run/cloudflare";
import { useLoaderData } from "@remix-run/react";
import { getBlogs } from "~/libs/microcms";
import { Blog } from "~/types";
import BlogPagination from "~/components/BlogPagination";

const PER_PAGE = 10;

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export const loader: LoaderFunction = async () => {
  const res = await getBlogs({
    offset: 0,
    limit: PER_PAGE,
    orders: "-publishedAt",
    fields: ["id", "title", "publishedAt", "eyecatch", "category", "summary"],
  });

  return {
    contents: res.contents,
    totalCount: res.totalCount,
    currentPage: 1,
  };
};

export default function Index() {
  const { contents, totalCount, currentPage } = useLoaderData<{
    contents: Blog[];
    totalCount: number;
    currentPage: number;
  }>();
  console.log("Index contents:", contents);
  return (
    <BlogPagination
      contents={contents}
      totalCount={totalCount}
      currentPage={currentPage}
    />
  );
}
