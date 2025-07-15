import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  // kế thừa config Next.js
  ...compat.extends("next/core-web-vitals", "next/typescript"),

  // override rule unused vars thành warning
  {
    rules: {
      // JS/JSX
      "no-unused-vars": "warn",

      // TS/TSX
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          args: "none",            // không báo unused function args
          ignoreRestSiblings: true // bỏ cảnh báo khi dùng rest {...rest}
        }
      ],
    },
  },
];

export default eslintConfig;
