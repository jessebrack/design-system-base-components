import path from "path";
import html from "rollup-plugin-html-entry";
import pkg from "./package.json";

const entry = path.resolve(__dirname, "index.html");

export default [
  {
    input: entry,
    output: {
      name: "main",
      file: pkg.browser,
      format: "umd"
    },
    plugins: [html()],
    watch: {
      include: "src/**"
    }
  }
];
