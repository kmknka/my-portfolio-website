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
  };
};

export default function Index() {
  const { contents, totalCount, currentPage } = useLoaderData<{
    contents: Blog[];
    totalCount: number;
    currentPage: number;
  }>();
  return (
    <BlogPagination
      contents={contents}
      totalCount={totalCount}
      currentPage={currentPage}
    />
  );
}
