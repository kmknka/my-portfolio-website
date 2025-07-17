// app/components/BlogPagination.tsx

import { Link } from "@remix-run/react";
import type { Blog } from "~/types";
import PaginationButtons from "./PaginationButtons";
import { FaClock } from "react-icons/fa";
import FilterLinks from "./FilterLinks";

interface Props {
  contents: Blog[];
  totalCount: number;
  currentPage: number;
  perPage?: number;
}

const BlogPagination = ({
  contents,
  totalCount,
  currentPage,
  perPage = 10,
}: Props) => {
  return (
    <>
      <div className="w-full max-w-screen-lg mx-auto px-4 py-6">
        {/* フィルターリンク */}
        <FilterLinks contents={contents} />
      </div>
      <div className="space-y-4">
        {/* 記事一覧箇所 */}
        <div className="flex flex-col space-y-4">
          {contents.map((blog) => (
            <Link
              to={`/blogs/${blog.id}`}
              key={blog.id}
              className="bg-white rounded-lg shadow p-4 flex gap-4 items-start hover:shadow-lg transition-shadow duration-200"
            >
              {/* 左: アイキャッチ画像＋カテゴリ */}
              <div className="relative w-32 h-24 md:w-48 md:h-36">
                <img
                  src={blog.eyecatch.url}
                  alt={blog.title}
                  className="w-full h-full object-contain rounded"
                />
                {blog.category?.name && (
                  <span className="absolute top-2 left-2 bg-blue-500 text-white text-xs font-semibold px-2 py-1 rounded">
                    {blog.category.name}
                  </span>
                )}
              </div>
              {/* 右: テキスト情報 */}
              <div className="flex-1 flex flex-col justify-between">
                {/* タイトル */}
                <h2 className="text-sm md:text-lg font-semibold text-gray-800 mb-1 break-words">
                  {blog.title}
                </h2>
                <p className="text-sm text-gray-600 line-clamp-3 mb-2 px-2 min-h-[6em]">
                  {blog.summary || "\u00A0"}
                </p>
                {/* 公開日＋時計アイコン */}
                <div className="text-right text-sm text-gray-500 flex items-center justify-end gap-1">
                  <FaClock className="w-4 h-4" />
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
