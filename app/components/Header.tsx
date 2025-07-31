// app/components/Header.tsx
import { useState, useRef, useEffect } from "react";
import { Link, useLocation, useNavigate } from "@remix-run/react";
import {
  HiMiniBolt,
  HiWrenchScrewdriver,
  HiLightBulb,
  HiDocumentText,
  HiEnvelope,
} from "react-icons/hi2";

export default function Header() {
  const tabs = [
    {
      name: "つかえる無料ツール集",
      category: "つかえる無料ツール集",
      disabled: false,
      logo: (isActive: boolean) => (
        <HiMiniBolt
          className={`inline-block mr-2 ${
            isActive ? "text-blue-500" : "text-gray-500"
          }`}
        />
      ),
    },
    {
      name: "つくってみたログ",
      category: "つくってみたログ",
      disabled: false,
      logo: (isActive: boolean) => (
        <HiDocumentText
          className={`inline-block mr-2 ${
            isActive ? "text-blue-500" : "text-gray-500"
          }`}
        />
      ),
    },
    {
      name: "つまずきと発見の記録",
      category: "つまずきと発見の記録",
      disabled: false,
      logo: (isActive: boolean) => (
        <HiLightBulb
          className={`inline-block mr-2 ${
            isActive ? "text-blue-500" : "text-gray-500"
          }`}
        />
      ),
    },
    {
      name: "社内SEの現場メモ",
      category: "社内SEの現場メモ",
      disabled: false,
      logo: (isActive: boolean) => (
        <HiWrenchScrewdriver
          className={`inline-block mr-2 ${
            isActive ? "text-blue-500" : "text-gray-500"
          }`}
        />
      ),
    },
    {
      name: "お問い合わせ",
      path: "/contact",
      disabled: false,
      logo: (isActive: boolean) => (
        <HiEnvelope
          className={`inline-block mr-2 ${
            isActive ? "text-blue-500" : "text-gray-500"
          }`}
        />
      ),
    },
  ];

  const location = useLocation();
  const url = new URL(location.pathname + location.search, "https://dummy.com");
  const categoryParam = url.searchParams.get("category");
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [showHeader, setShowHeader] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const navigate = useNavigate();

  // ウィンドウサイズの変更を監視してモバイル判定
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // スクロールイベントでヘッダーの表示/非表示を制御
  useEffect(() => {
    if (!isMobile) {
      setShowHeader(true);
      return;
    }
    const handleScroll = () => {
      const currentY = window.scrollY;
      if (currentY > lastScrollY && currentY > 50) {
        setShowHeader(false);
      } else {
        setShowHeader(true);
      }
      setLastScrollY(currentY);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isMobile, lastScrollY]);

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
    <header
      className={`
        ${
          isMobile
            ? "fixed top-0 left-0 z-50 transition-transform duration-300 w-full"
            : ""
        }
        ${isMobile ? (showHeader ? "translate-y-0" : "-translate-y-full") : ""}
        bg-brand-primary
      `}
    >
      {/*モバイル表示とPC表示でヘッダーの表示を切り替え*/}
      <nav className="max-w-[85rem] mx-auto flex justify-between items-center px-4 py-2 sm:px-6 lg:px-8 relative">
        {/* ロゴ */}
        <div className="flex items-center">
          <Link
            to={"/"}
            className=" opacity-100 hover:opacity-80 transition-opacity duration-300"
          >
            <img
              src="/icons/zeroesu_logo.png"
              alt="ヘッダーロゴ画像"
              className="w-20 h-14"
            />
          </Link>
          <div className="text-lg font-title font-bold text-white">てすと</div>
        </div>

        {/* ハンバーガー（モバイル表示） */}
        <div className="md:hidden relative" ref={dropdownRef}>
          <button
            className="p-2 border bg-white rounded-lg"
            onClick={() => setIsOpen(!isOpen)}
          >
            <svg
              className="w-5 h-5 text-gray-800"
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
            <div className="absolute top-full right-0 mt-2 w-80 h-auto bg-white border border-gray-200 rounded-lg shadow-lg z-50">
              {tabs.map((tab) => {
                const to =
                  tab.path ?? `/?category=${encodeURIComponent(tab.category!)}`;
                const isActive = categoryParam === tab.category;

                return (
                  <Link
                    key={tab.name}
                    to={to}
                    onClick={(e) => {
                      e.preventDefault(); // <Link> のデフォルト動作を無効にする
                      setIsOpen(false); // メニュー閉じる
                      navigate(to); // 明示的にルーティング遷移
                    }}
                    className={`flex items-center w-full px-4 py-4 text-lg rounded ${
                      isActive
                        ? "bg-gray-300 text-gray-800 pointer-events-none"
                        : "text-gray-800 hover:bg-gray-100"
                    }`}
                    aria-current={isActive ? "page" : undefined}
                  >
                    {tab.logo(isActive)}
                    {tab.name}
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}
