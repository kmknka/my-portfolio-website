// app/components/FilterLinks.tsx
import { Link, useLocation } from "@remix-run/react";
import type { Blog } from "~/types";

type Props = {
  contents: Blog[];
};

export default function FilterLinks({ contents }: Props) {
  const location = useLocation();
  const url = new URL(location.pathname + location.search, "https://dummy.com"); // Base 必須

  const categoryParam = url.searchParams.get("category");

  // パスが "/" である、または category がない場合は非表示
  if (location.pathname == "/" && !categoryParam) {
    return null;
  }

  // subcategory name のリスト
  const subcategoriesSet = new Set(
    contents
      .map((blog) => blog.subcategories?.name)
      .filter((name): name is string => typeof name === "string")
  );

  // 配列に変換
  const subcategories = Array.from(subcategoriesSet);

  return (
    <div className="mb-4">
      {subcategories.length > 0 && (
        <div className="flex gap-2 flex-wrap">
          {subcategories.map((sub) => (
            <Link
              key={sub}
              to={`/?category=${encodeURIComponent(
                categoryParam || ""
              )}&subcategory=${encodeURIComponent(sub)}`}
              className="px-2 py-1 border rounded text-sm hover:bg-gray-100"
            >
              {sub}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
