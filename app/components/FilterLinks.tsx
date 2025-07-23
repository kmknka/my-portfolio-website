// app/components/FilterLinks.tsx
import { Link, useLocation } from "@remix-run/react";
import { useEffect, useState } from "react";
import type { Blog } from "~/types";
import { FaFilter } from "react-icons/fa";

type Props = {
  contents: Blog[];
};

export default function FilterLinks({ contents }: Props) {
  const location = useLocation();
  const url = new URL(location.pathname + location.search, "https://dummy.com");
  const categoryParam = url.searchParams.get("category");
  const subcategoryParam = url.searchParams.get("subcategory");

  // subcategoriesの状態（初期値は空）
  const [subcategories, setSubcategories] = useState<string[]>([]);
  const [prevCategory, setPrevCategory] = useState<string | null>(null);

  // categoryが変更されたときにsubcategoriesを更新
  useEffect(() => {
    if (!categoryParam) return;

    if (categoryParam !== prevCategory) {
      const set = new Set(
        contents
          .map((blog) => blog.subcategories?.name)
          .filter((name): name is string => typeof name === "string")
      );
      setSubcategories(Array.from(set));
      setPrevCategory(categoryParam);
    }
  }, [categoryParam, prevCategory, contents]);

  // パスが "/" かつ category が無い場合は非表示
  if (location.pathname === "/" && !categoryParam) {
    return null;
  }

  return (
    <div className="mb-4">
      {subcategories.length > 0 && (
        <div className="w-full">
          {/* フィルターラベル + アイコン */}
          <div className="flex items-center gap-2 mb-2 text-sm font-medium text-gray-600">
            <FaFilter className="w-4 h-4" />
            <span>以下の項目で記事を絞る</span>
          </div>

          <div className="flex gap-2 flex-wrap">
            {subcategories.map((sub) => {
              const isActive = sub === subcategoryParam;

              return (
                <Link
                  key={sub}
                  to={`/?category=${encodeURIComponent(
                    categoryParam || ""
                  )}&subcategory=${encodeURIComponent(sub)}`}
                  className={`px-4 py-1 rounded-full border text-sm font-semibold shadow-sm transition-all duration-200 break-words max-w-full
                  ${
                    isActive
                      ? "bg-brand-secondary border-none text-gray-800 pointer-events-none"
                      : subcategoryParam
                      ? "opacity-50 pointer-events-none cursor-not-allowed"
                      : "bg-white text-gray-700 hover:bg-yellow-100"
                  }`}
                >
                  {sub}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
