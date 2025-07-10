import { useState, useRef, useEffect } from "react";
import { Link } from "@remix-run/react";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // メニュー外クリックで閉じる
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <header className="relative z-50 w-full bg-brand-primary border-b border-gray-200 dark:bg-neutral-800 dark:border-neutral-700">
      <nav className="max-w-[85rem] mx-auto flex justify-between items-center px-4 py-2 sm:px-6 lg:px-8 relative">
        {/* ロゴ */}
        <Link
          to={"/"}
          className="text-2xl font-title font-bold text-white dark:text-white opacity-100 hover:opacity-80 transition-opacity duration-300"
        >
          てすと
        </Link>

        {/* ハンバーガー（モバイル表示） */}
        <div className="md:hidden relative" ref={dropdownRef}>
          <button
            className="p-2 border bg-white dark:border-gray-600 rounded-lg"
            onClick={() => setIsOpen(!isOpen)}
          >
            <svg
              className="w-5 h-5 text-gray-800 dark:text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {isOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>

          {/* ドロップダウンメニュー（オーバーレイ） */}
          {isOpen && (
            <div className="absolute top-full right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50 dark:bg-neutral-800 dark:border-neutral-600">
              <a
                href="/"
                className="block px-4 py-2 text-sm text-gray-800 hover:bg-gray-100 dark:text-white dark:hover:bg-neutral-700"
              >
                Home
              </a>
              <a
                href="/downloads"
                className="block px-4 py-2 text-sm text-gray-800 hover:bg-gray-100 dark:text-white dark:hover:bg-neutral-700"
              >
                Downloads
              </a>
              <a
                href="/about"
                className="block px-4 py-2 text-sm text-gray-800 hover:bg-gray-100 dark:text-white dark:hover:bg-neutral-700"
              >
                About
              </a>
            </div>
          )}
        </div>

        {/* PC時のメニュー */}
        <div className="hidden md:flex gap-6">
          <Link
            to={"/"}
            className="text-sm text-white dark:text-white hover:text-gray-200 duration-200"
          >
            Home
          </Link>
          <Link
            to={"/downloads"}
            className="text-sm text-white dark:text-white hover:text-gray-200 duration-200"
          >
            Downloads
          </Link>
          <Link
            to={"/about"}
            className="text-sm text-white dark:text-white hover:text-gray-200 duration-200"
          >
            About
          </Link>
        </div>
      </nav>
    </header>
  );
}
