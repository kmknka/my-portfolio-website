import { createClient, MicroCMSQueries } from "microcms-js-sdk";
import type { Blog } from "~/types";
import { JSDOM } from "jsdom";

export const client = createClient({
  serviceDomain: process.env.MICROCMS_SERVICE_DOMAIN || "", // service-domain は https://XXXX.microcms.io の XXXX 部分
  apiKey: process.env.MICROCMS_API_KEY || "",
});

export const getBlogs = async (queries: MicroCMSQueries) => {
  return await client.getList<Blog>({ endpoint: "blogs", queries });
};

export const getBlogDetail = async (
  blogId: string,
  queries?: MicroCMSQueries
) => {
  return await client.getListDetail({
    endpoint: "blogs",
    contentId: blogId,
    queries,
  });
};

/*content内のhtmlとricheditor配列を結合 */
export function mergeBlogContent(blog: Blog): string {
  const parts: string[] = [];

  if (Array.isArray(blog.content)) {
    blog.content.forEach((item) => {
      if (item.fieldId === "html" && typeof item.html === "string") {
        parts.push(item.html);
      }
      if (
        item.fieldId === "richEditor" &&
        typeof item.richEditor === "string"
      ) {
        parts.push(item.richEditor);
      }
    });
  }

  return parts.join("\n");
}
/*HTML各要素にTailwindクラスを付与する関数 */
export function styleHtmlContent(html: string): string {
  const dom = new JSDOM(html);
  const doc = dom.window.document;

  /*最初にhtml要素でIDベースで記述した箇所を装飾（親と子を含む) */
  const idScopedStyleMap: Record<
    string,
    { selector: string; classes: string[] }[]
  > = {
    highlight: [
      { selector: "p", classes: ["text-yellow-800", "font-semibold"] },
      { selector: "h2", classes: ["text-yellow-900", "underline"] },
    ],
    note: [{ selector: "p", classes: ["text-blue-800", "italic"] }],
    warning: [{ selector: "p", classes: ["text-red-800", "font-bold"] }],
  };

  for (const [id, rules] of Object.entries(idScopedStyleMap)) {
    const parent = doc.getElementById(id);
    if (parent) {
      rules.forEach(({ selector, classes }) => {
        parent.querySelectorAll(selector).forEach((child) => {
          child.classList.add(...classes);
        });
      });
    }
  }

  /*リッチエディタで記載した箇所の装飾処理(クラス要素が指定されていない場合に実行する) */
  // h2にクラス追加
  doc.querySelectorAll("h2").forEach((el) => {
    if (!el.classList.length) {
      el.classList.add(
        "bg-indigo-600",
        "text-white",
        "rounded-none",
        "px-2",
        "py-1"
      );
    }
  });

  // pタグ
  doc.querySelectorAll("p").forEach((el) => {
    if (!el.classList.length) {
      el.classList.add("text-gray-800", "leading-relaxed", "mb-4");
    }
  });

  // aタグ
  doc.querySelectorAll("a").forEach((el) => {
    if (!el.classList.length) {
      el.classList.add("text-blue-600", "hover:underline");
    }
  });

  // ul/li
  doc.querySelectorAll("ul").forEach((el) => {
    if (!el.classList.length) {
      el.classList.add("list-disc", "pl-5", "mb-4");
    }
  });
  doc.querySelectorAll("li").forEach((el) => {
    if (!el.classList.length) {
      el.classList.add("mb-1");
    }
  });

  // img
  doc.querySelectorAll("img").forEach((el) => {
    if (!el.classList.length) {
      el.classList.add("my-4", "rounded-md", "shadow-md", "max-w-full");
    }
  });

  // pre/code
  doc.querySelectorAll("pre").forEach((el) => {
    if (!el.classList.length) {
      el.classList.add(
        "bg-gray-900",
        "text-white",
        "p-4",
        "rounded-md",
        "overflow-x-auto",
        "mb-4"
      );
    }
  });
  doc.querySelectorAll("code").forEach((el) => {
    if (!el.classList.length) {
      el.classList.add("bg-gray-200", "text-sm", "px-1", "rounded");
    }
  });

  // hr
  doc.querySelectorAll("hr").forEach((el) => {
    el.classList.add(
      "border-t",
      "border-blue-950",
      "mx-auto",
      "my-6",
      "opacity-60"
    );
  });

  return doc.body.innerHTML;
}
