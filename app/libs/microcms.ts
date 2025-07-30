import { createClient, MicroCMSQueries } from "microcms-js-sdk";
import type { Blog } from "~/types";
import { parseDocument } from "htmlparser2";
import { Element, Document } from "domhandler";
import { selectAll } from "css-select";
import { render } from "dom-serializer";
import { getAttributeValue } from "domutils";

type tagList = {
  name: string;
  count: number;
};
type categoryList = {
  category?: string;
  subcategories?: string;
};
export const client = createClient({
  serviceDomain: import.meta.env.VITE_MICROCMS_SERVICE_DOMAIN || "", // service-domain は https://XXXX.microcms.io の XXXX 部分
  apiKey: import.meta.env.VITE_MICROCMS_API_KEY || "",
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

export const getCategoryList = async (
  blogId: string,
  queries?: MicroCMSQueries
): Promise<categoryList> => {
  const res = await client.getListDetail({
    endpoint: "blogs",
    contentId: blogId,
    queries,
  });

  const categoryListRaw: categoryList[] = [];

  // カテゴリを追加（null チェックあり）
  if (res.category?.name) {
    categoryListRaw.push({ category: res.category.name });
  }
  // サブカテゴリカテゴリを追加（null チェックあり）
  if (res.subcategories?.name) {
    categoryListRaw.push({ subcategories: res.subcategories.name });
  }

  const categoryList = {
    category:
      categoryListRaw.find((item) => "category" in item)?.category ?? "",
    subcategories:
      categoryListRaw.find((item) => "subcategories" in item)?.subcategories ??
      "",
  };

  return categoryList;
};

export const getTagList = async (): Promise<tagList[]> => {
  const res = await getBlogs({
    offset: 0,
    limit: 100,
    fields: ["tags"],
  });

  const tagCountMap: Record<string, number> = {};
  res.contents.forEach((blog) => {
    blog.tags?.forEach((tag) => {
      if (tag.name in tagCountMap) {
        tagCountMap[tag.name]++;
      } else {
        tagCountMap[tag.name] = 1;
      }
    });
  });

  const tagList = Object.entries(tagCountMap).map(([name, count]) => ({
    name,
    count,
  }));

  return tagList;
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

function addClass(el: Element, classes: string[]) {
  const existing = getAttributeValue(el, "class") || "";
  const current = existing.trim().split(/\s+/).filter(Boolean);
  const merged = [...new Set([...current, ...classes])];
  el.attribs.class = merged.join(" ");
}

function isElement(node: unknown): node is Element {
  return (
    typeof node === "object" &&
    node !== null &&
    "type" in node &&
    (node as Element).type === "tag"
  );
}

export async function styleHtmlContent(html: string): Promise<string> {
  const doc: Document = parseDocument(html);

  // IDに基づくスタイル付与
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
    const parentNode = selectAll(`#${id}`, doc)[0];
    if (isElement(parentNode)) {
      rules.forEach(({ selector, classes }) => {
        const targets = selectAll(`${selector}`, parentNode);
        targets.forEach((el) => {
          if (isElement(el)) addClass(el, classes);
        });
      });
    }
  }

  // グローバルスタイル（タグ毎）
  const tagStyles: Record<string, string[]> = {
    h1: [
      "font-body",
      "bg-brand-primary",
      "text-white",
      "text-base",
      "md:text-xl",
      "rounded-sm",
      "px-2",
      "py-1",
    ],
    h2: [
      "font-body",
      "border-l-4",
      "border",
      "border-gray-400",
      "pl-4",
      "text-base",
      "md:text-xl",
      "text-gray-800",
      "rounded-sm",
      "px-2",
      "py-1",
    ],
    p: [
      "font-body",
      "text-gray-800",
      "leading-relaxed",
      "mb-4",
      "text-sm",
      "md:text-base",
    ],
    a: [
      "font-body",
      "text-sm",
      "md:text-base",
      "text-blue-600",
      "hover:text-blue-400 duration-500",
    ],
    ul: ["font-body", "text-sm", "md:text-base", "list-disc", "pl-5", "mb-4"],
    li: ["font-body", "text-sm", "md:text-base", "mb-1"],
    img: ["my-4", "rounded-md", "shadow-md", "max-w-full"],
    pre: [
      "bg-gray-900",
      "text-gray-300",
      "p-4",
      "rounded-md",
      "overflow-x-auto",
      "mb-2",
      "overflow-x-auto",
    ],
    code: ["text-white", "text-sm", "px-1"],
    hr: ["border-t", "border-blue-950", "mx-auto", "my-6", "opacity-60"],
  };

  for (const [tag, classes] of Object.entries(tagStyles)) {
    const elements = selectAll(tag, doc);
    elements.forEach((el) => {
      if (isElement(el)) addClass(el, classes);
    });
  }
  return render(doc);
}
