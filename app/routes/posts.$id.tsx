//app/routes/posts.$id.tsx
import { LoaderFunction, MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import CategoryBreadcrumb from "~/components/CategoryBreadcrumb";
import { FaClock } from "react-icons/fa";
import {
  getBlogDetail,
  mergeBlogContent,
  getCategoryList,
} from "~/libs/microcms";
import type { Blog } from "~/types";
type CategoryList = {
  category: string;
  subcategories: string;
};
type LoaderData = {
  blog: Blog;
  categoryList: CategoryList;
};

export const meta: MetaFunction<LoaderData> = ({ data }) => {
  const loaderData = data as LoaderData | undefined;

  if (!loaderData) return [];

  const { blog } = loaderData;
  const siteName =
    "ゼロから社内SE | 未経験から始める業務効率化とツール活用ログ";
  const pageUrl = `https://yourdomain.com/posts/${blog.id}`; // ←実際のURLに合わせて修正

  return [
    { title: `${blog.title} | ${siteName}` },
    {
      name: "description",
      content:
        `${blog.summary || ""} ${
          blog.category?.name ? `|「${blog.category.name}」に関する記事` : ""
        }` || blog.title,
    },
    { property: "og:title", content: blog.title },
    {
      property: "og:description",
      content:
        `${blog.summary || ""} ${
          blog.category?.name ? `|「${blog.category.name}」に関する記事` : ""
        }` || blog.title,
    },
    { property: "og:image", content: blog.eyecatch?.url || "/default-og.png" },
    { property: "og:url", content: pageUrl },
    { property: "og:type", content: "article" },
    { property: "og:site_name", content: siteName },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: blog.title },
    {
      name: "twitter:description",
      content:
        `${blog.summary || ""} ${
          blog.category?.name ? `|「${blog.category.name}」に関する記事` : ""
        }` || blog.title,
    },
    { name: "twitter:image", content: blog.eyecatch?.url || "/default-og.png" },
  ];
};

export const loader: LoaderFunction = async ({ params }) => {
  const { id } = params;
  const blog = await getBlogDetail(id as string);
  const categoryList = await getCategoryList(id as string);
  const rawHtml = mergeBlogContent(blog);
  // const styledHtml = await styleHtmlContent(rawHtml);
  blog.content = rawHtml;

  return { blog, categoryList };
};

export default function Post() {
  const { blog, categoryList } = useLoaderData<LoaderData>();

  return (
    <>
      <div className="hidden md:block w-full max-w-screen-lg mx-auto py-2">
        {/* カテゴリーブレッドクラム（PC表示用 ページ上部に表示） */}
        <CategoryBreadcrumb categoryList={categoryList} />
      </div>
      <div id="blogdetail" className="flex flex-col justify-center">
        {/* アイキャッチ画像＋カテゴリ */}
        <div className="relative max-w-full flex flex-col">
          <img
            src={blog.eyecatch.url}
            alt={blog.title}
            className="w-full h-full object-contain rounded"
          />
          {/* カテゴリ名表示 */}
          {blog.category?.name && (
            // カテゴリを画像の下に表示
            <span className="absolute top-2 left-2 text-[10px] sm:text-xs bg-gray-100 text-gray-800 font-semibold border border-gray-600 px-2 py-1 rounded z-10">
              {blog.category.name}
            </span>
          )}
        </div>
        {/* 記事タイトル */}
        <h1 className="font-bold text-xl mt-10 mb-4">{blog.title}</h1>
        {/* 公開日＋時計アイコン */}
        <div className="text-right text-xs text-gray-500 flex items-center justify-end gap-1">
          <FaClock className="inline-block" />
          <span>
            {new Date(blog.publishedAt)
              .toLocaleDateString("ja-JP", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
              })
              .replace(/\//g, ".")}
          </span>
        </div>
        <div
          className="w-full prose sm:max-w-none px-4 text-left"
          dangerouslySetInnerHTML={{ __html: blog.content }}
        />
      </div>
      <div className="md:hidden w-full max-w-screen-lg mx-auto py-2">
        {/* カテゴリーブレッドクラム（モバイル表示の時は、記事情報下部に表示） */}
        <CategoryBreadcrumb categoryList={categoryList} />
      </div>
    </>
  );
}
