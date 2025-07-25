// app/routes/_index.tsx
import { MetaFunction, LoaderFunction } from "@remix-run/cloudflare";
import { useLoaderData } from "@remix-run/react";
import { getBlogs, getTagList } from "~/libs/microcms";
import { Blog } from "~/types";
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

const PER_PAGE = 10;

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

  const { categoryParam, subcategoryParam, tagParam } = loaderData;

  if (categoryParam && !subcategoryParam) {
    return [
      { title: `${categoryParam} の記事一覧` },
      {
        name: "description",
        content: `${categoryParam} に関する記事一覧です。`,
      },
    ];
  }

  if (categoryParam && subcategoryParam) {
    return [
      { title: `${categoryParam} - ${subcategoryParam} の記事一覧` },
      {
        name: "description",
        content: `${categoryParam} > ${subcategoryParam} に関連する記事一覧です。`,
      },
    ];
  }

  if (tagParam) {
    return [
      { title: `${tagParam} タグの記事一覧` },
      {
        name: "description",
        content: `「${tagParam}」タグが付いた記事一覧です。`,
      },
    ];
  }

  return [
    { title: "ゼロから社内SE | 未経験から始める業務効率化とツール活用ログ" },
    {
      name: "description",
      content:
        "未経験から社内SEになった経験の実務の記録、業務効率化に使える無料ITツールや自作プログラムの紹介など為になるIT知識をお届けしようと奮闘する社内SEのブログです。",
    },
  ];
};

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);

  const categoryParam = url.searchParams.get("category"); // 大分類
  const subcategoryParam = url.searchParams.get("subcategory"); // 中分類
  const tagParam = url.searchParams.get("tag"); // タグ

  const res = await getBlogs({
    offset: 0,
    limit: 100,
    orders: "-publishedAt",
    fields: [
      "id",
      "title",
      "publishedAt",
      "eyecatch",
      "category",
      "subcategories",
      "tags",
      "summary",
    ],
  });

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

  // ページネーション処理
  const totalCount = filtered.length;
  const currentPage = 1;
  const paginated = filtered.slice(0, PER_PAGE);

  return {
    contents: paginated,
    totalCount: totalCount,
    currentPage: currentPage,
    tagList: tagList,
    categoryParam: categoryParam,
    subcategoryParam: subcategoryParam,
    tagParam: tagParam,
  };
};

export default function Index() {
  const { contents, totalCount, currentPage, tagList } =
    useLoaderData<LoaderData>();

  return (
    <div className="w-full max-w-screen-lg mx-auto flex flex-row gap-6 px-4 py-6 overflow-y-auto font-body">
      {/* ページごとのコンテンツ */}
      <div className="flex-1 font-body">
        <BlogPagination
          contents={contents}
          totalCount={totalCount}
          currentPage={currentPage}
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
