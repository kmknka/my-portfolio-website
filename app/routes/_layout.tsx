// app/routes/_layout.tsx
import { Outlet } from "@remix-run/react";
import Header from "~/components/Header";
import TabNavigation from "~/components/TabNavigation";
//import Sidebar from "~/components/Sidebar"; // あなたが作成予定のSidebar

export default function Layout() {
  return (
    <div>
      <Header />
      <TabNavigation />
      <div className="flex">
        <main className="flex-1 p-4">
          <Outlet /> {/* ← children がここに差し込まれる */}
        </main>
        <aside className="w-64 p-4 border-l border-gray-300">
          {/* <Sidebar /> */}
        </aside>
      </div>
    </div>
  );
}
