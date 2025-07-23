// components/PaginationButtons.tsx
import { Link } from "@remix-run/react";

interface Props {
  totalCount: number;
  currentPage: number;
  perPage: number;
}

const PaginationButtons = ({ totalCount, currentPage, perPage }: Props) => {
  const totalPages = Math.ceil(totalCount / perPage);

  const generatePages = () => {
    const pages: (number | string)[] = [];

    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || Math.abs(i - currentPage) <= 1) {
        pages.push(i);
      } else if (pages[pages.length - 1] !== "...") {
        pages.push("...");
      }
    }

    return pages.map((page, idx) => {
      if (page === "...") {
        return (
          <span key={idx} className="mx-1 text-gray-400">
            …
          </span>
        );
      }

      const isActive = page === currentPage;
      const href = page === 1 ? "/" : `/page/${page}`;

      return (
        <Link
          key={idx}
          to={href}
          className={`px-3 py-1 border rounded text-sm ${
            isActive
              ? "bg-brand-secondary text-gray-800 pointer-events-none"
              : "bg-white text-gray-800 hover:bg-yellow-100"
          }`}
        >
          {page}
        </Link>
      );
    });
  };

  return (
    <div className="flex justify-center gap-2 mt-6">{generatePages()}</div>
  );
};

export default PaginationButtons;
