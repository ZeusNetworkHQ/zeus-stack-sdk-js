import { defineConfig } from "rolldown";

import pkg from "./package.json" assert { type: "json" };

export default defineConfig({
  input: {
    index: "src/index.ts",
    "bitcoin/index": "src/bitcoin/index.ts",
    "zpl/two-way-peg/types": "src/zpl/two-way-peg/types.ts",
    "zpl/liquidity-management/types": "src/zpl/liquidity-management/types.ts",
  },
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
    // Include some dependencies in the bundle to prevent 'require' errors in browser environments.
    // This ensures the library works properly in both Node.js and browser without requiring polyfills.
    ...Object.keys(pkg.dependencies || {}).filter(
      (dep) => !["bs58"].includes(dep)
    ),
    ...Object.keys(pkg.peerDependencies || {}),
  ],
});
