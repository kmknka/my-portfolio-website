import Header from "~/components/Header";
import TabNavigation from "~/components/TabNavigation";
import Sidebar from "./components/Sidebar";

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
      <body className="min-h-screen bg-brand-background">
        {/* ヘッダー */}
        <Header />
        {/* タブナビゲーション（モバイルでは非表示） */}
        <div className="hidden md:block bg-white font-body">
          <TabNavigation />
        </div>
        <div className="w-full max-w-screen-lg mx-auto flex flex-row gap-6 px-4 py-6 overflow-y-auto font-body">
          {/* ページごとのコンテンツ */}
          <main className="flex-1 font-body">{children}</main>
          {/* サイドバー（モバイルでは非表示） */}
          <aside className="hidden md:block font-body">
            <Sidebar />
          </aside>
        </div>

        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}
