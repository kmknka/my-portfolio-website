//app/routes/contact._index.tsx
import {
  useLoaderData,
  useActionData,
  useLocation,
  Form,
  redirect,
} from "@remix-run/react";
import { getTagList } from "~/libs/microcms";
import Sidebar from "~/components/Sidebar";
import {
  MetaFunction,
  LoaderFunction,
  ActionFunction,
} from "@remix-run/cloudflare";
import CategoryBreadcrumb from "~/components/CategoryBreadcrumb";
type tagList = {
  name: string;
  count: number;
};
type ActionErrorData = {
  error?: string;
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

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();

  const name = formData.get("name");
  const email = formData.get("email");
  const title = formData.get("title");
  const message = formData.get("message");

  if (
    typeof name !== "string" ||
    name.trim() === "" ||
    typeof email !== "string" ||
    email.trim() === "" ||
    typeof title !== "string" ||
    title.trim() === "" ||
    typeof message !== "string" ||
    message.trim() === ""
  ) {
    return new Response(JSON.stringify({ error: "全項目を入力してください" }), {
      status: 400,
    });
  }

  // KV 書き込み用 API を呼び出し
  const res = await fetch(new URL("/api/contact", request.url), {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    return new Response(JSON.stringify({ error: "送信に失敗しました" }), {
      status: 500,
    });
  }

  return redirect("/contact?submitted=true");
};

export function ContactForm() {
  const location = useLocation();
  const submitted = new URLSearchParams(location.search).get("submitted");
  const actionData = useActionData<ActionErrorData>();
  return (
    <div className="max-w-lg mx-auto px-4 py-8">
      <h1 className="text-xl font-bold mb-4">お問い合わせ</h1>
      <Form method="post" className="space-y-4">
        {actionData?.error && (
          <p className="text-red-600 text-sm">{actionData.error}</p>
        )}
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
        {submitted && (
          <div className="bg-green-100 text-green-800 px-4 py-2 rounded mb-4">
            送信が完了しました。お問い合わせありがとうございます。
          </div>
        )}
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
