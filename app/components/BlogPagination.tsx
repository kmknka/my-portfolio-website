// app/components/BlogPagination.tsx

import { Link } from "@remix-run/react";
import type { Blog } from "~/types";
import PaginationButtons from "./PaginationButtons";
import { FaClock, FaTag } from "react-icons/fa";
import FilterLinks from "./FilterLinks";
import CategoryBreadcrumb from "./CategoryBreadcrumb";
import Sidebar from "./Sidebar";

interface Props {
  contents: Blog[];
  totalCount: number;
  currentPage: number;
  perPage?: number;
  tagList?: { name: string; count: number }[];
}

const BlogPagination = ({
  contents,
  totalCount,
  currentPage,
  perPage = 10,
  tagList,
}: Props) => {
  const categoryList = {
    category: "",
    subcategories: "",
  };
  return (
    <>
      <div className="w-full max-w-screen-lg mx-auto py-2">
        {/* フィルターリンク */}
        <FilterLinks contents={contents} />
      </div>
      <div className="hidden md:block w-full max-w-screen-lg mx-auto py-2">
        {/* カテゴリーブレッドクラム（PC表示用 フィルターリンク下部に表示） */}
        <CategoryBreadcrumb categoryList={categoryList} />
      </div>
      <div className="space-y-4">
        {/* 記事一覧箇所 */}
        <div className="flex flex-col space-y-4">
          {contents.map((blog) => (
            <Link
              key={blog.id}
              to={`/posts/${blog.id}`}
              className="bg-white border rounded-lg shadow p-4 flex gap-4 items-start"
            >
              {/* 左: アイキャッチ画像＋カテゴリ */}
              <div className="relative w-32 h-24 md:w-48 md:h-36 flex flex-col items-start">
                <img
                  src={blog.eyecatch.url}
                  alt={blog.title}
                  className="w-full h-full object-contain rounded"
                />
                {/* カテゴリ名表示 */}
                {blog.category?.name && (
                  // カテゴリを画像の下に表示
                  <span className="text-[10px] sm:text-xs bg-brand-primary text-white font-semibold my-1 px-2 py-1 rounded w-fit">
                    {blog.category.name}
                  </span>
                )}
                {/* サブカテゴリ名表示 */}
                {blog.subcategories?.name && (
                  // 画像の下に表示
                  <span className="text-[10px] sm:text-xs bg-gray-400 text-white font-semibold mb-1 px-2 py-1 rounded w-fit">
                    {blog.subcategories.name}
                  </span>
                )}
              </div>
              {/* 右: テキスト情報 */}
              <div className="flex-1 flex flex-col justify-between">
                {/* タイトル */}
                <p className="text-sm md:text-lg font-semibold text-gray-800 mb-1 break-words hover:text-gray-400 duration-300 ">
                  {blog.title}
                </p>
                <p className="text-sm text-gray-600 line-clamp-3 mb-2 px-2 min-h-[6em]">
                  {blog.summary || "\u00A0"}
                </p>
                {/* タグ一覧表示 */}
                {blog.tags && blog.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-1">
                    {blog.tags.map((tag) => (
                      <span
                        key={tag.id}
                        className="inline-flex items-center gap-1 text-[10px] sm:text-xs bg-gray-100 text-gray-800 font-medium px-2 py-0.5 rounded"
                      >
                        <FaTag className="w-3 h-3 text-gray-500" />
                        {tag.name}
                      </span>
                    ))}
                  </div>
                )}
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
              </div>
            </Link>
          ))}
        </div>

        {/* サイドバー表示(モバイル表示の時は、記事情報下部に表示) */}
        <div className="md:hidden w-full max-w-screen-lg mx-auto py-2">
          <Sidebar tagList={tagList} />
        </div>

        <div className="md:hidden w-full max-w-screen-lg mx-auto py-2">
          {/* カテゴリーブレッドクラム（モバイル表示用 ページ下部表示） */}
          <CategoryBreadcrumb categoryList={categoryList} />
        </div>

        {/* ページネーションボタン */}
        <div className="flex justify-center space-x-2 mt-6">
          <PaginationButtons
            totalCount={totalCount}
            currentPage={currentPage}
            perPage={perPage}
          />
        </div>
      </div>
    </>
  );
};

export default BlogPagination;
