// app/components/Header.tsx
import { useState, useEffect } from "react";
import { Link } from "@remix-run/react";
import { useOverlay } from "~/context/OverlayContext";

export default function Header() {
  const [showHeader, setShowHeader] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const { open } = useOverlay();

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
        <div className="md:hidden relative">
          <button onClick={open} className="p-2 border bg-white rounded-lg">
            <svg
              className="w-5 h-5 text-gray-800"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
      </nav>
    </header>
  );
}
