//app/routes/posts.tsx
import { useLoaderData, Outlet } from "@remix-run/react";
import { LoaderFunction } from "@remix-run/cloudflare";
import { getTagList, getCategoryList } from "~/libs/microcms";
import Sidebar from "~/components/Sidebar";

type tagList = {
  name: string;
  count: number;
};

export const loader: LoaderFunction = async ({ params }) => {
  const { id } = params;
  const categoryList = await getCategoryList(id as string);
  const tagList = await getTagList();
  return { tagList, categoryList };
};

export default function PostsIndex() {
  const { tagList } = useLoaderData<{ tagList: tagList[] }>();

  return (
    <div className="w-full max-w-screen-lg mx-auto flex flex-col md:flex-row gap-6 px-4 py-6 overflow-y-auto font-body">
      {/* ページごとのコンテンツ */}
      <div className="flex-1 font-body">
        <Outlet />
        {/* サイドバー表示(モバイル表示の時は、記事情報下部に表示) */}
        <div className="md:hidden w-full max-w-screen-lg mx-auto py-2">
          <Sidebar tagList={tagList} />
        </div>
      </div>
      {/* サイドバー（モバイルでは非表示） */}
      <aside className="hidden md:block font-body">
        <Sidebar tagList={tagList} />
      </aside>
    </div>
  );
}
