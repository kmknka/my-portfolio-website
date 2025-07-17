import type { Config } from "tailwindcss";
import lineClamp from "@tailwindcss/line-clamp";
export default {
  content: ["./app/**/{**,.client,.server}/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "sans-serif",
          "Apple Color Emoji",
          "Segoe UI Emoji",
          "Segoe UI Symbol",
          "Noto Color Emoji",
        ],
        title: ["'M PLUS Rounded 1c'", "sans-serif"],
        body: [
          "Avenir",
          "Helvetica Neue",
          "Helvetica",
          "Arial",
          "Hiragino Sans",
          "ヒラギノ角ゴシック",
          "YuGothic",
          "Yu Gothic",
          "メイリオ",
          "Meiryo",
          "ＭＳ Ｐゴシック",
          "MS PGothic",
          "sans-serif",
        ],
      },
      colors: {
        brand: {
          primary: "#316C82", // あなたのヘッダーカラー
          secondary: "#FFD266", // ボタンなどのアクセントカラー
          background: "#F4F4F4", // 全体背景
          surface: "#FFFFFF", // テキスト背景など
          accent: "#13B2AA", // 見出しや装飾に使う差し色
          primaryHover: "#5D767F", // ホバー時のヘッダーカラー
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
