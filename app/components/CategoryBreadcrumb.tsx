// app/components/CategoryBreadcrumb.tsx
import { Link, useLocation } from "@remix-run/react";
import { FaHome, FaFolder } from "react-icons/fa";
interface CategoryBreadcrumbProps {
  categoryList?: { category: string; subcategories: string };
}

export default function CategoryBreadcrumb({
  categoryList,
}: CategoryBreadcrumbProps) {
  const location = useLocation();
  const url = new URLSearchParams(location.search);

  const category = url.get("category");
  const subcategory = url.get("subcategory");

  const pathname = location.pathname;

  console.log("categoryList:", categoryList);

  // パスが /contact のとき
  if (pathname === "/contact") {
    return (
      <nav className="text-sm text-gray-600 mb-4 px-4">
        <ol className="list-reset flex flex-wrap items-center space-x-2">
          <li>
            <Link to="/" className="hover:text-gray-400 duration-200">
              <FaHome className="inline-block mr-1" />
              Home
            </Link>
          </li>
          <li>&gt;</li>
          <li>お問い合わせ</li>
        </ol>
      </nav>
    );
  }
  // パスが /posts のとき
  if (pathname.includes("/posts") && categoryList) {
    const categoryLink = `/?category=${encodeURIComponent(
      categoryList.category ?? ""
    )}`;
    const subcategoryLink = `/?category=${encodeURIComponent(
      categoryList.category ?? ""
    )}&subcategory=${encodeURIComponent(categoryList.subcategories ?? "")}`;

    return (
      <nav className="text-sm text-gray-600 mb-4 px-4">
        <ol className="list-reset flex flex-wrap items-center space-x-2">
          <li>
            <Link to="/" className="hover:text-gray-400 duration-200">
              <FaHome className="inline-block mr-1" />
              Home
            </Link>
          </li>
          {categoryList.category && (
            <>
              <li>&gt;</li>
              <li>
                <Link
                  to={categoryLink}
                  className="hover:text-gray-400 duration-200"
                >
                  <FaFolder className="inline-block mr-1" />
                  {categoryList.category}
                </Link>
              </li>
            </>
          )}
          {categoryList.subcategories && (
            <>
              <li>&gt;</li>
              <li>
                <Link
                  to={subcategoryLink}
                  className="hover:text-gray-400 duration-200"
                >
                  <FaFolder className="inline-block mr-1" />
                  {categoryList.subcategories}
                </Link>
              </li>
            </>
          )}
        </ol>
      </nav>
    );
  }

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
