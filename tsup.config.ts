import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["./src/index.ts"],
  dts: {
    resolve: true,
    entry: "./src/index.ts",
  },
  outDir: "dist",
  format: "esm",
  splitting: true,
  sourcemap: true,
  clean: true,
});
