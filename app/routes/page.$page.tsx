// app/routes/page/$page.tsx

import type { LoaderFunction, MetaFunction } from "@remix-run/cloudflare";
import { useLoaderData } from "@remix-run/react";
import { getBlogs, getTagList } from "~/libs/microcms";
import type { Blog } from "~/types";
import BlogPagination from "~/components/BlogPagination";
import Sidebar from "~/components/Sidebar";
type tagList = {
  name: string;
  count: number;
};
type LoaderData = {
  contents: Blog[];
  totalCount: number;
  currentPage: number;
  tagList: tagList[];
  categoryParam: string | null;
  subcategoryParam: string | null;
  tagParam: string | null;
};

export const meta: MetaFunction = ({ data }) => {
  const loaderData = data as LoaderData | undefined;

  if (!loaderData) {
    return [
      { title: "ゼロから社内SE | 未経験から始める業務効率化とツール活用ログ" },
      {
        name: "description",
        content:
          "未経験から社内SEになった経験の実務の記録、業務効率化に使える無料ITツールや自作プログラムの紹介など為になるIT知識をお届けしようと奮闘する社内SEのブログです。",
      },
    ];
  }

  const { categoryParam, subcategoryParam, tagParam, currentPage } = loaderData;

  if (categoryParam && !subcategoryParam) {
    return [
      { title: `ページ ${currentPage} | ${categoryParam} の記事一覧` },
      {
        name: "description",
        content: `ページ ${currentPage} | ${categoryParam} に関する記事一覧です。`,
      },
    ];
  }

  if (categoryParam && subcategoryParam) {
    return [
      {
        title: `ページ ${currentPage} | ${categoryParam} - ${subcategoryParam} の記事一覧`,
      },
      {
        name: "description",
        content: `ページ ${currentPage} | ${categoryParam} > ${subcategoryParam} に関連する記事一覧です。`,
      },
    ];
  }

  if (tagParam) {
    return [
      { title: `ページ ${currentPage} | ${tagParam} タグの記事一覧` },
      {
        name: "description",
        content: `ページ ${currentPage} |「${tagParam}」タグが付いた記事一覧です。`,
      },
    ];
  }

  return [
    {
      title: `ページ ${currentPage} |ゼロから社内SE | 未経験から始める業務効率化とツール活用ログ`,
    },
    {
      name: "description",
      content: `ページ ${currentPage} | 未経験から社内SEになった経験の実務の記録、業務効率化に使える無料ITツールや自作プログラムの紹介など為になるIT知識をお届けしようと奮闘する社内SEのブログです。`,
    },
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

  const tagList = await getTagList();

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
    categoryParam: categoryParam,
    subcategoryParam: subcategoryParam,
    tagParam: tagParam,
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
