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
