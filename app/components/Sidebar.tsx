// components/Sidebar.tsx
import { FaTwitter, FaYoutube, FaTag } from "react-icons/fa";
import { Link } from "@remix-run/react";
interface SidebarProps {
  tagList?: { name: string; count: number }[];
}

export default function Sidebar({ tagList }: SidebarProps) {
  return (
    <aside className="md:w-64 space-y-4">
      {/* 自己紹介セクション */}
      <section>
        <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
          {/* 背景画像 */}
          <div
            className="relative h-24 bg-cover bg-center"
            style={{ backgroundImage: "url('/images/bg-avatar.jpg')" }}
          >
            {/* アバター画像 */}
            <img
              src="/icons/avatar.png"
              alt="プロフィール画像"
              className="absolute left-1/2 transform -translate-x-1/2 translate-y-1/2 w-20 h-20 rounded-full object-cover"
            />
          </div>
          <div className="text-center mt-8">
            {/* 名前と自己紹介 */}

            <h2 className="text-lg font-semibold text-gray-800 mb-2">名前</h2>
            <p className="text-sm text-gray-600">
              Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque
              faucibus ex sapien vitae pellentesque sem placerat. In id cursus
              mi pretium tellus duis convallis. Tempus leo eu aenean sed diam
              urna tempor. Pulvinar vivamus fringilla lacus nec metus bibendum
              egestas. Iaculis massa nisl malesuada lacinia integer nunc
              posuere. Ut hendrerit semper vel class aptent taciti sociosqu. Ad
              litora torquent per conubia nostra inceptos himenaeos.
            </p>
            {/* SNS アイコンセクション */}
            <div className="flex justify-center gap-6 mt-4 mb-4">
              {/* Twitter */}
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="relative group"
              >
                <FaTwitter className="w-6 h-6 transition-transform duration-300 group-hover:scale-110" />
                <span className="absolute bottom-[-1.5rem] left-1/2 transform -translate-x-1/2 text-xs text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                  Twitterを開く
                </span>
              </a>

              {/* YouTube */}
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="relative group"
              >
                <FaYoutube className="w-6 h-6 transition-transform duration-300 group-hover:scale-110" />
                <span className="absolute bottom-[-1.5rem] left-1/2 transform -translate-x-1/2 text-xs text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                  YouTubeを開く
                </span>
              </a>
            </div>
          </div>
        </div>
      </section>
      {/* 記事タグセクション */}
      <section>
        <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800 mb-2">タグ一覧</h2>
          {/* タグリスト */}
          {tagList && tagList.length > 0 ? (
            <div className="flex flex-wrap gap-1 mt-1">
              {tagList.map((tag) => (
                <div
                  key={tag.name}
                  className="inline-flex items-center gap-1 text-[10px] sm:text-xs bg-gray-100 text-gray-800 font-medium px-2 py-0.5 rounded hover:bg-gray-300 hover:shadow-lg transition-shadow duration-500"
                >
                  <Link
                    key={tag.name}
                    to={`/?tag=${encodeURIComponent(tag.name)}`}
                    className="flex items-center gap-1"
                  >
                    <FaTag className="w-3 h-3 text-gray-500" />
                    {tag.name}
                    <div className="ml-1">({tag.count})</div>
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">タグはありません</p>
          )}
        </div>
      </section>
    </aside>
  );
}
