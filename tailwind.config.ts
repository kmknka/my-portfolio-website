import type { Config } from "tailwindcss";

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
      typography: {
        DEFAULT: {
          css: {
            h1: {
              fontFamily: "theme('fontFamily.body')",
              backgroundColor: "#316C82",
              color: "#ffffff",
              fontSize: "0.875rem", // text-base
              padding: "0.5rem 0.75rem",
              borderRadius: "0.125rem",
              "@screen md": {
                fontSize: "1.25rem", // md:text-xl
              },
            },
            h2: {
              fontFamily: "theme('fontFamily.body')",
              borderLeftWidth: "4px",
              borderTopWidth: "1px",
              borderRightWidth: "1px",
              borderBottomWidth: "1px",
              borderColor: "#9ca3af", // gray-400
              paddingLeft: "1rem",
              fontSize: "0.875rem",
              color: "#1f2937", // gray-800
              padding: "0.25rem 0.5rem",
              borderRadius: "0.125rem",
              "@screen md": {
                fontSize: "1.25rem",
              },
            },
            p: {
              fontFamily: "theme('fontFamily.body')",
              color: "#1f2937",
              fontSize: "0.875rem",
              lineHeight: "1.75",
              marginBottom: "1rem",
              "@screen md": {
                fontSize: "1rem",
              },
            },
            a: {
              fontFamily: "theme('fontFamily.body')",
              fontSize: "0.875rem",
              color: "#2563eb", // blue-600
              textDecoration: "underline",
              transitionProperty: "color",
              transitionDuration: "500ms",
              "&:hover": {
                color: "#60a5fa", // blue-400
              },
              "@screen md": {
                fontSize: "1rem",
              },
            },
            ul: {
              fontFamily: "theme('fontFamily.body')",
              fontSize: "0.875rem",
              paddingLeft: "1.25rem",
              marginBottom: "1rem",
              listStyleType: "disc",
              "@screen md": {
                fontSize: "1rem",
              },
            },
            li: {
              fontFamily: "theme('fontFamily.body')",
              fontSize: "0.875rem",
              marginBottom: "0.25rem",
              "@screen md": {
                fontSize: "1rem",
              },
            },
            img: {
              marginTop: "1rem",
              marginBottom: "1rem",
              borderRadius: "0.375rem",
              boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
              maxWidth: "100%",
              height: "auto",
            },
            pre: {
              backgroundColor: "#111827", // gray-900
              color: "#d1d5db", // gray-300
              padding: "1rem",
              borderRadius: "0.375rem",
              overflowX: "auto",
              marginBottom: "0.5rem",
            },
            code: {
              backgroundColor: "transparent",
              color: "#ffffff",
              fontSize: "0.875rem",
              paddingLeft: "0.25rem",
              paddingRight: "0.25rem",
            },
            hr: {
              borderTopWidth: "1px",
              borderColor: "#9ca3af", // blue-950
              marginTop: "1.5rem",
              marginBottom: "1.5rem",
              opacity: "0.6",
            },
          },
        },
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
} satisfies Config;
