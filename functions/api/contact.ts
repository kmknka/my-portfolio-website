//functions/api/contact.ts
interface Env {
  CONTACTS: KVNamespace;
  TURNSTILE_SECRET_KEY: string;
}
interface TurnstileResponse {
  success: boolean;
  "error-codes"?: string[];
  challenge_ts?: string;
  hostname?: string;
}

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  const formData = await request.formData();
  console.log("formdata:", formData);
  const name = formData.get("name");
  const email = formData.get("email");
  const title = formData.get("title");
  const message = formData.get("message");
  const token = formData.get("cf-turnstile-response");
  const remoteip = request.headers.get("CF-Connecting-IP");

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

  // Turnstile トークン検証
  const verifyRes = await fetch(
    "https://challenges.cloudflare.com/turnstile/v0/siteverify",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        secret: import.meta.env.VITE_TURNSTILE_SECRET_KEY,
        response: typeof token === "string" ? token : "",
        ...(remoteip ? { remoteip } : {}),
      }),
    }
  );

  const verifyData = (await verifyRes.json()) as TurnstileResponse;

  if (!verifyData.success) {
    console.error("Turnstile failed:", verifyData["error-codes"]);
    return new Response("Bot 検証失敗", { status: 403 });
  }

  const id = crypto.randomUUID();
  const payload = JSON.stringify({
    name,
    email,
    title,
    message,
    createdAt: new Date().toISOString(),
  });

  await env.CONTACTS.put(id, payload);

  // ページにリダイレクト（/contact?submitted=true）
  return new Response(null, {
    status: 303,
    headers: { Location: "/contact?submitted=true" },
  });
};
