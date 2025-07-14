// components/Sidebar.tsx
import { FaTwitter, FaYoutube } from "react-icons/fa";

export default function Sidebar() {
  return (
    <aside className="w-64 space-y-4">
      {/* 広告スペース */}
      <section>
        <div className="bg-white dark:bg-neutral-800 p-4 rounded-lg shadow border border-gray-200 dark:border-neutral-700">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
            スポンサー
          </h2>
          <div className="bg-gray-100 dark:bg-neutral-700 h-32 flex items-center justify-center text-sm text-gray-500 dark:text-gray-300 rounded">
            広告スペース
          </div>
        </div>
      </section>
      {/* 自己紹介セクション */}
      <section>
        <div className="bg-white dark:bg-neutral-800 p-4 rounded-lg shadow border border-gray-200 dark:border-neutral-700">
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

            <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
              名前
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-300">
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
                <span className="absolute bottom-[-1.5rem] left-1/2 transform -translate-x-1/2 text-xs text-gray-500 dark:text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
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
                <span className="absolute bottom-[-1.5rem] left-1/2 transform -translate-x-1/2 text-xs text-gray-500 dark:text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                  YouTubeを開く
                </span>
              </a>
            </div>
          </div>
        </div>
      </section>
      {/* 記事タグセクション */}
      <section>
        <div className="bg-white dark:bg-neutral-800 p-4 rounded-lg shadow border border-gray-200 dark:border-neutral-700">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
            記事タグ
          </h2>
          <ul className="space-y-2">
            <li>
              <a
                href="/tags/web-development"
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                Web開発
              </a>
            </li>
            <li>
              <a
                href="/tags/design"
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                デザイン
              </a>
            </li>
            <li>
              <a
                href="/tags/ux-ui"
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                UX/UI
              </a>
            </li>
          </ul>
        </div>
      </section>
    </aside>
  );
}
