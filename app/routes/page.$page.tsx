// app/routes/page/$page.tsx

import type { LoaderFunction, MetaFunction } from "@remix-run/cloudflare";
import { useLoaderData } from "@remix-run/react";
import { getBlogs } from "~/libs/microcms";
import type { Blog } from "~/types";
import BlogPagination from "~/components/BlogPagination";

export const meta: MetaFunction = ({ params }) => {
  return [
    { title: `ページ ${params.page} | Blog` },
    { name: "description", content: `ページ ${params.page} の記事一覧` },
  ];
};

export const loader: LoaderFunction = async ({ params, request }) => {
  const currentPage = parseInt(params.page || "1", 10);
  const perPage = 10;
  const offset = (currentPage - 1) * perPage;
  const url = new URL(request.url);
  const categoryParam = url.searchParams.get("category");
  const subcategoryParam = url.searchParams.get("subcategory");
  const tagParam = url.searchParams.get("tag");

  // ブログデータ取得
  const res = await getBlogs({
    fields: [
      "id",
      "title",
      "publishedAt",
      "revisedAt",
      "eyecatch",
      "category",
      "subcategories",
      "tags",
      "summary",
    ],
    orders: "-publishedAt",
    offset: 0,
    limit: 100,
  });

  if (!res) {
    throw new Response("Not Found", { status: 404 });
  }

  let filtered = res.contents;

  if (categoryParam) {
    filtered = filtered.filter((blog) => blog.category?.name === categoryParam);
  }

  if (subcategoryParam) {
    filtered = filtered.filter(
      (blog) => blog.subcategories?.name === subcategoryParam
    );
  }

  if (tagParam) {
    filtered = filtered.filter((blog) =>
      blog.tags?.some((tag) => tag.name === tagParam)
    );
  }

  // ページネーション用にslice
  const paged = filtered.slice(offset, offset + perPage);

  return {
    contents: paged,
    totalCount: filtered.length,
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
