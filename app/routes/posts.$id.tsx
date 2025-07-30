//app/routes/posts.$id.tsx
import { LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import CategoryBreadcrumb from "~/components/CategoryBreadcrumb";
import {
  getBlogDetail,
  mergeBlogContent,
  getCategoryList,
  styleHtmlContent,
} from "~/libs/microcms";
import type { Blog } from "~/types";
type CategoryList = {
  category: string;
  subcategories: string;
};
type LoaderData = {
  blog: Blog;
  categoryList: CategoryList;
};
export const loader: LoaderFunction = async ({ params }) => {
  const { id } = params;
  const blog = await getBlogDetail(id as string);
  const categoryList = await getCategoryList(id as string);
  const rawHtml = mergeBlogContent(blog);
  const styledHtml = styleHtmlContent(rawHtml);
  blog.content = styledHtml;

  return { blog, categoryList };
};

export default function Post() {
  const { blog, categoryList } = useLoaderData<LoaderData>();

  return (
    <>
      <div className="hidden md:block w-full max-w-screen-lg mx-auto py-2">
        {/* カテゴリーブレッドクラム（PC表示用 ページ上部に表示） */}
        <CategoryBreadcrumb categoryList={categoryList} />
      </div>
      <div
        id="blogdetail"
        className="flex flex-col justify-center items-center"
      >
        <h1 className="font-bold text-3xl mt-4 mb-4">{blog.title}</h1>
        <p className="text-2xl ">
          公開日時:{new Date(blog.publishedAt).toLocaleDateString()}
        </p>
        <div
          className="w-full max-w-prose px-4 text-left"
          dangerouslySetInnerHTML={{ __html: blog.content }}
        />
      </div>
      <div className="md:hidden w-full max-w-screen-lg mx-auto py-2">
        {/* カテゴリーブレッドクラム（モバイル表示の時は、記事情報下部に表示） */}
        <CategoryBreadcrumb categoryList={categoryList} />
      </div>
    </>
  );
}
