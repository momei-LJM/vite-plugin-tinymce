/* eslint-disable */
import "tinymce/themes/silver";
import "tinymce/icons/default/icons";
import "tinymce/models/dom";
import "tinymce/plugins/advlist";
import "tinymce/plugins/anchor";
import "tinymce/plugins/autolink";
import "tinymce/plugins/autosave";
import "tinymce/plugins/code";
import "tinymce/plugins/codesample";
import "tinymce/plugins/directionality";
import "tinymce/plugins/fullscreen";
// import 'tinymce/plugins/hr'
import "tinymce/plugins/insertdatetime";
import "tinymce/plugins/link";
import "tinymce/plugins/lists";
import "tinymce/plugins/media";
import "tinymce/plugins/nonbreaking";
// import 'tinymce/plugins/noneditable'
import "tinymce/plugins/pagebreak";
// import 'tinymce/plugins/paste'
import "tinymce/plugins/preview";
// import 'tinymce/plugins/print'
import "tinymce/plugins/save";

import "tinymce/plugins/searchreplace";
// import 'tinymce/plugins/spellchecker'
// import 'tinymce/plugins/tabfocus'
// import 'tinymce/plugins/table';
// import 'tinymce/plugins/template'
import "tinymce/plugins/visualblocks";
import "tinymce/plugins/visualchars";
// import 'tinymce/plugins/wordcount'
import "tinymce/plugins/image";
import "tinymce/plugins/charmap";
// import 'tinymce/plugins/help'
import "tinymce/plugins/table";
import { Editor } from "tinymce";

import { Ref } from "vue";
import { acceptMap } from "./helper";

enum MediaType {
  video,
  audio,
  image,
}

interface PluginOpt {
  loading: Ref<boolean>;
  [key: string]: unknown;
}
// Render html snippets
const HtmlRenderer = (type: MediaType, url: string) => {
  if (type === MediaType.video) {
    return `<video controls="controls" src="${url}">
      <source src="${url}" type="video/mp4" />
      <source src="${url}" type="video/webm" />
      <a href="${url}">link to the video</a>
    </video>`;
  }
  if (type === MediaType.audio) {
    return `<audio controls="controls" src="${url}">
            <a href="${url}"> Download audio </a>
            </audio>`;
  }
  if (type === MediaType.image) {
    return `<img  src="${url}" />`;
  }
  return "";
};
const useFileInput = (type: string): HTMLInputElement => {
  const input = document.createElement("input");
  input.setAttribute("type", "file");
  input.setAttribute("accept", type);
  input.click();
  return input;
};
/**
 * Custom video upload plug-in (simplified operation, multi-step pop-up)
 * @param editor
 * @param options
 */
export const usePluginVideo = (editor: Editor, options: PluginOpt) => {
  editor.ui.registry.addButton("jc-video", {
    icon: "embed",
    tooltip: "upload video",
    enabled: true,
    onAction: (api) => {
      const input = useFileInput(acceptMap.media);
      input.onchange = async function () {
        try {
          const file = input.files![0];
          options.loading.value = true;
          // const res = await upload(...)
          const res = { url: "url" };
          editor.insertContent(HtmlRenderer(MediaType.video, res.url));
        } catch (error) {
          console.error("usePluginVideo:jcUploadFile", error);
        } finally {
          options.loading.value = false;
        }
      };
    },
  });
};
/**
 * Custom image upload plug-in (simplified operation, with multi-step pop-up window)
 * @param editor
 * @param options
 */
export const usePluginImage = (editor: Editor, options: PluginOpt) => {
  editor.ui.registry.addButton("jc-image", {
    icon: "image",
    tooltip: "upload image",
    enabled: true,
    onAction: (api) => {
      const input = useFileInput(acceptMap.image);
      input.onchange = async function () {
        try {
          const file = input.files![0];
          options.loading.value = true;
          // const res = await upload(...)
          const res = { url: "url" };
          editor.insertContent(HtmlRenderer(MediaType.image, res.url));
        } catch (error) {
          console.error("usePluginImage:jcUploadFile", error);
        } finally {
          options.loading.value = false;
        }
      };
    },
  });
};
