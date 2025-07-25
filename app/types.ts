// app/types.ts
export type Category = {
  id: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  revisedAt: string;
  name: string;
};

export type Content = {
  fieldId: string;
  html: string;
  richEditor: string;
};

export type Blog = {
  id: string;
  title: string;
  publishedAt: string;
  revisedAt: string;
  content: Array<Content>;
  eyecatch: {
    url: string;
    width: number;
    height: number;
  };
  category: Category;
  subcategories: Category;
  tags: Category[];
  summary: string;
  showSummary: boolean;
};

export type Contacts = {
  id: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  revisedAt: string;
  name: string;
  email: string;
  title: string;
  message: string;
};
