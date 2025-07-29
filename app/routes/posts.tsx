//app/routes/posts._index.tsx
import { useLoaderData, Outlet } from "@remix-run/react";
import { MetaFunction, LoaderFunction } from "@remix-run/cloudflare";
import { getTagList } from "~/libs/microcms";
import Sidebar from "~/components/Sidebar";
import CategoryBreadcrumb from "~/components/CategoryBreadcrumb";
type tagList = {
  name: string;
  count: number;
};

export const meta: MetaFunction = () => {
  return [
    { title: "お問い合わせ" },
    { name: "description", content: "お問い合わせを行うページです" },
  ];
};

export const loader: LoaderFunction = async () => {
  const tagList = await getTagList();
  return { tagList };
};

export default function PostsIndex() {
  const { tagList } = useLoaderData<{ tagList: tagList[] }>();

  return (
    <div className="w-full max-w-screen-lg mx-auto flex flex-row gap-6 px-4 py-6 overflow-y-auto font-body">
      {/* ページごとのコンテンツ */}
      <div className="flex-1 font-body">
        <div className="hidden md:block w-full max-w-screen-lg mx-auto py-2">
          {/* カテゴリーブレッドクラム（PC表示用 ページ上部に表示） */}
          <CategoryBreadcrumb />
        </div>
        <Outlet />
        {/* サイドバー表示(モバイル表示の時は、記事情報下部に表示) */}
        <div className="md:hidden w-full max-w-screen-lg mx-auto py-2">
          <Sidebar tagList={tagList} />
        </div>
        <div className="md:hidden w-full max-w-screen-lg mx-auto py-2">
          {/* カテゴリーブレッドクラム（モバイル表示の時は、記事情報下部に表示） */}
          <CategoryBreadcrumb />
        </div>
      </div>
      {/* サイドバー（モバイルでは非表示） */}
      <aside className="hidden md:block font-body">
        <Sidebar tagList={tagList} />
      </aside>
    </div>
  );
}
