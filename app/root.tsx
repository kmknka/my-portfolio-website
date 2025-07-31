// app/root.tsx
import Header from "~/components/Header";
import TabNavigation from "~/components/TabNavigation";

import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";

import "./tailwind.css";

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="min-h-screen bg-white">
        {/* ヘッダー */}
        <Header />
        {/* モバイル表示時のみ余白を追加 */}
        <div className="mt-14 md:mt-0" />
        {/* タブナビゲーション（モバイルでは非表示） */}
        <div className="hidden md:block bg-white font-body">
          <TabNavigation />
        </div>
        {/* メインコンテンツ (記事情報及びサイドバー)*/}
        <main>{children}</main>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}
