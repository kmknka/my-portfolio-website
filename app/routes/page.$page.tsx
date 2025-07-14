// app/routes/page/$page.tsx

import type { LoaderFunction, MetaFunction } from "@remix-run/cloudflare";
import { redirect, useLoaderData } from "@remix-run/react";
import { getBlogs } from "~/libs/microcms";
import type { Blog } from "~/types";
import BlogPagination from "~/components/BlogPagination";

export const meta: MetaFunction = ({ params }) => {
  return [
    { title: `ページ ${params.page} | Blog` },
    { name: "description", content: `ページ ${params.page} の記事一覧` },
  ];
};

export const loader: LoaderFunction = async ({ params }) => {
  const currentPage = parseInt(params.page || "1", 10);
  const perPage = 10;
  const offset = (currentPage - 1) * perPage;

  const allblogdata = await getBlogs({
    fields: ["id", "title", "publishedAt", "revisedAt", "eyecatch", "category"],
    orders: "-publishedAt",
    offset,
    limit: perPage,
  });

  if (!allblogdata) {
    throw new Response("Not Found", { status: 404 });
  }

  return {
    contents: allblogdata.contents,
    totalCount: allblogdata.totalCount,
    currentPage: currentPage,
    perPage,
  };
};

export default function PageRoute() {
  const { contents, totalCount, currentPage, perPage } = useLoaderData<{
    contents: Blog[];
    totalCount: number;
    currentPage: number;
    perPage: number;
  }>();

  return (
    <div>
      <BlogPagination
        contents={contents}
        totalCount={totalCount}
        currentPage={currentPage}
        perPage={perPage}
      />
    </div>
  );
}
