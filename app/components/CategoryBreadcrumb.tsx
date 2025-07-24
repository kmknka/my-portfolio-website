// app/components/CategoryBreadcrumb.tsx
import { Link, useLocation } from "@remix-run/react";
import { FaHome, FaFolder } from "react-icons/fa";

export default function CategoryBreadcrumb() {
  const location = useLocation();
  const url = new URLSearchParams(location.search);

  const category = url.get("category");
  const subcategory = url.get("subcategory");

  // ルートパスかつクエリなしなら非表示
  const isHome = location.pathname === "/" && !category && !subcategory;
  if (isHome) return null;

  const categoryLink = `/?category=${encodeURIComponent(category ?? "")}`;

  return (
    <nav className="text-sm text-gray-600 mb-4 px-4">
      <ol className="list-reset flex flex-wrap items-center space-x-2">
        <li>
          <Link to="/" className="hover:text-gray-400 duration-200">
            <FaHome className="inline-block mr-1" />
            Home
          </Link>
        </li>
        {category && (
          <>
            <li>&gt;</li>
            <li>
              <Link
                to={categoryLink}
                className="hover:text-gray-400 duration-200"
              >
                <FaFolder className="inline-block mr-1" />
                {category}
              </Link>
            </li>
          </>
        )}
        {subcategory && (
          <>
            <li>&gt;</li>
            <li>{subcategory}</li>
          </>
        )}
      </ol>
    </nav>
  );
}
