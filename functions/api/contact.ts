//functions/api/contact.ts
import type { ActionFunctionArgs } from "@remix-run/cloudflare";
interface Env {
  CONTACTS: KVNamespace;
}

export const action = async ({ request, context }: ActionFunctionArgs) => {
  const formData = await request.formData();
  console.log("formdata:", formData);
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
    return new Response(JSON.stringify({ error: "全項目必須です" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const id = crypto.randomUUID();
  const payload = JSON.stringify({
    name,
    email,
    title,
    message,
    createdAt: new Date().toISOString(),
  });
  // `context.env` に型をアサートする
  const { CONTACTS } = context.env as Env;
  await CONTACTS.put(id, payload);

  // ページにリダイレクト（/contact?submitted=true）
  return new Response(null, {
    status: 303,
    headers: { Location: "/contact?submitted=true" },
  });
};
