import { defineConfig } from "rolldown";

import pkg from "./package.json" assert { type: "json" };

export default defineConfig({
  input: "src/index.ts",
  output: [
    {
      dir: "dist",
      format: "esm",
      entryFileNames: "[name].mjs",
      sourcemap: true,
    },
    {
      dir: "dist",
      format: "cjs",
      entryFileNames: "[name].cjs",
      sourcemap: true,
    },
  ],
  external: [
    ...Object.keys(pkg.dependencies || {}),
    ...Object.keys(pkg.peerDependencies || {}),
  ],
});
