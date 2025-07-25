// app/routes/page/$page.tsx

import type { LoaderFunction, MetaFunction } from "@remix-run/cloudflare";
import { useLoaderData } from "@remix-run/react";
import { getBlogs } from "~/libs/microcms";
import type { Blog } from "~/types";
import BlogPagination from "~/components/BlogPagination";
import Sidebar from "~/components/Sidebar";
type tagList = {
  name: string;
  count: number;
};

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

  // タグ件数カウント
  const tagCountMap: Record<string, number> = {};
  res.contents.forEach((blog) => {
    blog.tags?.forEach((tag) => {
      if (tag.name in tagCountMap) {
        tagCountMap[tag.name]++;
      } else {
        tagCountMap[tag.name] = 1;
      }
    });
  });

  // タグ名:件数のリストを定義
  const tagList = Object.entries(tagCountMap).map(([name, count]) => ({
    name,
    count,
  }));

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
    tagList: tagList,
  };
};

export default function PageRoute() {
  const { contents, totalCount, currentPage, perPage, tagList } =
    useLoaderData<{
      contents: Blog[];
      totalCount: number;
      currentPage: number;
      perPage: number;
      tagList: tagList[];
    }>();

  return (
    <div className="w-full max-w-screen-lg mx-auto flex flex-row gap-6 px-4 py-6 overflow-y-auto font-body">
      {/* ページごとのコンテンツ */}
      <div className="flex-1 font-body">
        <BlogPagination
          contents={contents}
          totalCount={totalCount}
          currentPage={currentPage}
          perPage={perPage}
          tagList={tagList}
        />
      </div>
      {/* サイドバー（モバイルでは非表示） */}
      <aside className="hidden md:block font-body">
        <Sidebar tagList={tagList} />
      </aside>
    </div>
  );
}
