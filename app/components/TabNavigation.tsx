//app/components/TabNavigation.tsx
import { Link, useLocation } from "@remix-run/react";

const tabs = [
  {
    name: "つかえる無料ツール集",
    category: "つかえる無料ツール集",
    disabled: false,
  },
  { name: "つくってみたログ", category: "つくってみたログ", disabled: false },
  {
    name: "つまずきと発見の記録",
    category: "つまずきと発見の記録",
    disabled: false,
  },
  { name: "社内SEの現場メモ", category: "社内SEの現場メモ", disabled: false },
  { name: "お問い合わせ", path: "/contact", disabled: false },
];

export default function TabNavigation() {
  const location = useLocation();
  const url = new URL(location.pathname + location.search, "https://dummy.com");
  const categoryParam = url.searchParams.get("category");

  return (
    <div className="font-body text-sm font-medium text-center text-gray-500 border-b border-gray-200 dark:text-gray-400 dark:border-gray-700">
      <ul className="flex flex-wrap justify-center -mb-px space-x-2 md:space-x-4">
        {tabs.map((tab) => {
          const to =
            tab.path ?? `/?category=${encodeURIComponent(tab.category!)}`;
          const isActive = categoryParam === tab.category;

          return (
            <li className="me-2" key={tab.name}>
              {tab.disabled ? (
                <span className="inline-block p-4 text-gray-400 rounded-t-lg cursor-not-allowed dark:text-gray-500">
                  {tab.name}
                </span>
              ) : (
                <Link
                  to={to}
                  className={`inline-block p-4 border-b-2 rounded-t-lg ${
                    isActive
                      ? "text-brand-primary border-brand-primary dark:text-blue-500 dark:border-blue-500"
                      : "border-transparent hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300"
                  }`}
                  aria-current={isActive ? "page" : undefined}
                >
                  {tab.name}
                </Link>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
