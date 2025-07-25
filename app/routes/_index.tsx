// app/routes/_index.tsx
import { MetaFunction, LoaderFunction } from "@remix-run/cloudflare";
import { useLoaderData } from "@remix-run/react";
import { getBlogs } from "~/libs/microcms";
import { Blog } from "~/types";
import BlogPagination from "~/components/BlogPagination";
import Sidebar from "~/components/Sidebar";
type tagList = {
  name: string;
  count: number;
};

const PER_PAGE = 10;

export const meta: MetaFunction = () => {
  return [
    { title: "ゼロから社内SE | 未経験から始める業務効率化とツール活用ログ" },
    { name: "description", content: "Welcome to Remix!" },
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

  // ページネーション処理
  const totalCount = filtered.length;
  const currentPage = 1;
  const paginated = filtered.slice(0, PER_PAGE);

  return {
    contents: paginated,
    totalCount: totalCount,
    currentPage: currentPage,
    tagList: tagList,
  };
};

export default function Index() {
  const { contents, totalCount, currentPage, tagList } = useLoaderData<{
    contents: Blog[];
    totalCount: number;
    currentPage: number;
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
