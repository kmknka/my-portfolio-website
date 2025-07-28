import { createClient, MicroCMSQueries } from "microcms-js-sdk";
import type { Blog } from "~/types";
type tagList = {
  name: string;
  count: number;
};

export const client = createClient({
  serviceDomain: import.meta.env.MICROCMS_SERVICE_DOMAIN || "", // service-domain は https://XXXX.microcms.io の XXXX 部分
  apiKey: import.meta.env.MICROCMS_API_KEY || "",
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
