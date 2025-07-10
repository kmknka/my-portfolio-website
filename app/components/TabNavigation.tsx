import { Link, useLocation } from "@remix-run/react";

const tabs = [
  { name: "Profile", path: "/profile" },
  { name: "Dashboard", path: "/dashboard" },
  { name: "Settings", path: "/settings" },
  { name: "Contacts", path: "/contacts" },
  // { name: "Disabled", path: "#", disabled: true },
];

export default function TabNavigation() {
  const location = useLocation();

  return (
    <div className="font-body text-sm font-medium text-center text-gray-500 border-b border-gray-200 dark:text-gray-400 dark:border-gray-700">
      <ul className="flex flex-wrap justify-center -mb-px space-x-2 md:space-x-4">
        {tabs.map((tab) => {
          const isActive = location.pathname === tab.path;

          return (
            <li className="me-2" key={tab.name}>
              {tab.disabled ? (
                <span className="inline-block p-4 text-gray-400 rounded-t-lg cursor-not-allowed dark:text-gray-500">
                  {tab.name}
                </span>
              ) : (
                <Link
                  to={tab.path}
                  className={`inline-block p-4 border-b-2 rounded-t-lg ${
                    isActive
                      ? "text-blue-600 border-blue-600 dark:text-blue-500 dark:border-blue-500"
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
