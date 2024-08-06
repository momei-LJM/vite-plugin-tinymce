import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["./src/index.ts"],
  dts: {
    resolve: true,
    entry: "./src/index.ts",
  },
  outDir: "dist",
  format: ["esm"],
  noExternal: ["serve-static"],
  splitting: false,
  sourcemap: true,
  clean: true,
  platform: "node",
});
