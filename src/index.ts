import path from "path";
import { normalizePath } from "vite";
import type { Plugin } from "vite";
import serveStatic from "serve-static";
import { copyDir } from "./utils/index";

interface TOptionConfig {
  buildPath: string;
}

export default function tinymcePlugin(
  options: TOptionConfig = {
    buildPath: "node_modules/tinymce",
  }
): Plugin {
  const { buildPath } = options;
  let resolveUrl = "tinymce/";
  let outDir = "dist";
  let base: string = "/";
  let isBuild: boolean = false;
  return {
    name: "vite-plugin-tinymce",
    config(c, { command }) {
      isBuild = command === "build";
      if (c.base !== undefined) {
        base = c.base;
        if (base === "") {
          base = "./";
        }
      }
      if (c.build?.outDir) {
        if (c.root !== undefined) {
          outDir = path.join(c.root, c.build.outDir);
        } else {
          outDir = c.build.outDir;
        }
      }
      resolveUrl = normalizePath(path.join(base, resolveUrl));
    },
    configureServer({ middlewares }) {
      middlewares.use(
        normalizePath(path.join("/", resolveUrl)),
        serveStatic(buildPath, {
          setHeaders: (res: any) => {
            res.setHeader("Access-Control-Allow-Origin", "*");
          },
        })
      );
    },
    closeBundle() {
      if (isBuild) {
        try {
          copyDir(
            path.join(buildPath, "skins"),
            path.join(outDir, "tinymce/skins")
          );
          copyDir(
            path.join(buildPath, "icons"),
            path.join(outDir, "tinymce/icons")
          );
        } catch (err) {
          console.error("copy failed", err);
        }
      }
    },
  };
}
