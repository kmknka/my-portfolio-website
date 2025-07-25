import { useLoaderData, Form } from "@remix-run/react";
import { getTagList } from "~/libs/microcms";
import Sidebar from "~/components/Sidebar";
import { MetaFunction, LoaderFunction } from "@remix-run/cloudflare";
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

export function ContactForm() {
  return (
    <div className="max-w-lg mx-auto px-4 py-8">
      <h1 className="text-xl font-bold mb-4">お問い合わせ</h1>
      <Form className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium">
            お名前
          </label>
          <input
            type="text"
            name="name"
            required
            className="w-full border px-2 py-1 rounded"
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium">
            メールアドレス
          </label>
          <input
            type="email"
            name="email"
            required
            className="w-full border px-2 py-1 rounded"
          />
        </div>
        <div>
          <label htmlFor="title" className="block text-sm font-medium">
            題名
          </label>
          <input
            type="text"
            name="title"
            required
            className="w-full border px-2 py-1 rounded"
          />
        </div>
        <div>
          <label htmlFor="message" className="block text-sm font-medium">
            お問い合わせ内容
          </label>
          <textarea
            name="message"
            rows={7}
            required
            className="w-full border px-2 py-1 rounded"
          />
        </div>
        <button
          type="submit"
          className="bg-brand-secondary text-gray-800 font-semibold px-4 py-2 rounded hover:bg-yellow-200 duration-300"
        >
          送信
        </button>
      </Form>
    </div>
  );
}

export default function Conrtact() {
  const { tagList } = useLoaderData<{ tagList: tagList[] }>();

  return (
    <div className="w-full max-w-screen-lg mx-auto flex flex-row gap-6 px-4 py-6 overflow-y-auto font-body">
      {/* ページごとのコンテンツ */}
      <div className="flex-1 font-body">
        <div className="w-full max-w-screen-lg mx-auto py-2">
          {/* カテゴリーブレッドクラム（PC表示用 フィルターリンク下部に表示） */}
          <CategoryBreadcrumb />
        </div>
        <ContactForm />
      </div>
      {/* サイドバー（モバイルでは非表示） */}
      <aside className="hidden md:block font-body">
        <Sidebar tagList={tagList} />
      </aside>
    </div>
  );
}
