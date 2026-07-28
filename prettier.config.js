/** @type {import('prettier').Config} */
export default {
  plugins: ["prettier-plugin-tailwindcss"],
  tailwindStylesheet: "./src/index.css",
  tailwindFunctions: ["clsx", "cn", "cva"],
  semi: true,
  singleQuote: false,
  trailingComma: "all",
  printWidth: 100,
};
