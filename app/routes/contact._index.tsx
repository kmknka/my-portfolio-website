//app/routes/contact._index.tsx
import {
  useLoaderData,
  useActionData,
  useLocation,
  Form,
} from "@remix-run/react";
import { getTagList } from "~/libs/microcms";
import Sidebar from "~/components/Sidebar";
import {
  MetaFunction,
  LoaderFunction,
  ActionFunction,
  redirect,
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

export const action: ActionFunction = async ({ request, context }) => {
  const formData = await request.formData();

  const name = formData.get("name");
  const email = formData.get("email");
  const title = formData.get("title");
  const message = formData.get("message");

  if (typeof name !== "string" || name.length === 0) {
    return Response.json(
      { error: "お名前を入力してください" },
      { status: 400 }
    );
  }

  if (typeof email !== "string" || email.length === 0) {
    return Response.json(
      { error: "メールアドレスを入力してください" },
      { status: 400 }
    );
  }

  if (typeof title !== "string" || title.length === 0) {
    return Response.json({ error: "題名を入力してください" }, { status: 400 });
  }

  if (typeof message !== "string" || message.length === 0) {
    return Response.json(
      { error: "お問い合わせ内容を入力してください" },
      { status: 400 }
    );
  }

  const data = {
    name,
    email,
    title,
    message,
    createdAt: new Date().toISOString(),
  };

  const id = crypto.randomUUID(); // 一意のIDを生成

  // KV に保存（context.env.CONTACTS は wrangler.toml で設定した binding）
  await context.env.CONTACTS.put(id, JSON.stringify(data));

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
