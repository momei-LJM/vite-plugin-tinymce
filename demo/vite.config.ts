import { defineConfig, Plugin } from "vite";
import vue from "@vitejs/plugin-vue";
import tinymcePlugin from "vite-plugin-tinymce";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), tinymcePlugin()],
});
