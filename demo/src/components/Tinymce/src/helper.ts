/* eslint-disable camelcase */

import { RawEditorOptions, Editor, TinyMCE } from "tinymce";
import {
  Ref,
  computed,
  getCurrentInstance,
  nextTick,
  onActivated,
  onBeforeUnmount,
  onDeactivated,
  onMounted,
  ref,
  unref,
  watch,
} from "vue";
import { buildShortUUID } from "./tinymce";
import { usePluginImage, usePluginVideo } from "./pluginLoader";
import { PropsType } from "./props";

import resetStyle from "./styles/reset.css?inline";
type Nullable<T> = T | null;
interface BlobInfo {
  id: () => string;
  name: () => string;
  filename: () => string;
  blob: () => Blob;
  base64: () => string;
  blobUri: () => string;
  uri: () => string | undefined;
}
type ProgressFn = (percent: number) => void;
const validEvents = [
  "onActivate",
  "onAddUndo",
  "onBeforeAddUndo",
  "onBeforeExecCommand",
  "onBeforeGetContent",
  "onBeforeRenderUI",
  "onBeforeSetContent",
  "onBeforePaste",
  "onBlur",
  "onChange",
  "onClearUndos",
  "onClick",
  "onContextMenu",
  "onCopy",
  "onCut",
  "onDblclick",
  "onDeactivate",
  "onDirty",
  "onDrag",
  "onDragDrop",
  "onDragEnd",
  "onDragGesture",
  "onDragOver",
  "onDrop",
  "onExecCommand",
  "onFocus",
  "onFocusIn",
  "onFocusOut",
  "onGetContent",
  "onHide",
  "onInit",
  "onKeyDown",
  "onKeyPress",
  "onKeyUp",
  "onLoadContent",
  "onMouseDown",
  "onMouseEnter",
  "onMouseLeave",
  "onMouseMove",
  "onMouseOut",
  "onMouseOver",
  "onMouseUp",
  "onNodeChange",
  "onObjectResizeStart",
  "onObjectResized",
  "onObjectSelected",
  "onPaste",
  "onPostProcess",
  "onPostRender",
  "onPreProcess",
  "onProgressState",
  "onRedo",
  "onRemove",
  "onReset",
  "onSaveContent",
  "onSelectionChange",
  "onSetAttrib",
  "onSetContent",
  "onShow",
  "onSubmit",
  "onUndo",
  "onVisualAid",
];
export const isNumber = (v: any): v is number => {
  return typeof v === "number";
};

export const createSkinLink = (url: string) => {
  const link = document.createElement("link");
  link.setAttribute("rel", "stylesheet");
  link.setAttribute("type", "text/css");
  link.setAttribute("href", url);
  document.head.appendChild(link);
};
const srcMap: Record<string, any> = {};
export const createSrc = (url: string, key: string) => {
  if (srcMap[key]) {
    return;
  }
  const script = document.createElement("script");
  srcMap[key] = script;
  script.setAttribute("src", url);
  script.setAttribute("data-manual", key);
  document.head.appendChild(script);
};
/**
 *
 * @param atrEvs
 * @returns
 */
const mergeEvents = (atrEvs: string | string[]) => {
  const modelEvents = atrEvs ? atrEvs : "";
  const normalizedEvents = (
    Array.isArray(modelEvents) ? modelEvents.join(" ") : modelEvents
  ) as string;
  const mergeEvents = new Set([
    ...normalizedEvents.split(" "),
    ...["change", "keyup", "undo", "redo"],
  ]);
  return Array.from(mergeEvents.values()).join(" ");
};
/**
 *
 * @param key
 * @returns
 */
const isValidKey = (key: string) => validEvents.indexOf(key) !== -1;
/**
 *
 * @param initEvent
 * @param listeners
 * @param editor
 */
export const bindHandlers = (
  initEvent: Event,
  listeners: Record<string, unknown>,
  editor: any
): void => {
  Object.keys(listeners)
    .filter(isValidKey)
    .forEach((key: string) => {
      const handler = listeners[key];
      if (typeof handler === "function") {
        if (key === "onInit") {
          handler(initEvent, editor);
        } else {
          editor.on(key.substring(2), (e: any) => handler(e, editor));
        }
      }
    });
};
/**
 *upload image
 * @param info
 * @param progress
 * @returns
 */
export const imageHandle = async (
  info: BlobInfo,
  progress: ProgressFn,
  loading: Ref<boolean>
) => {
  try {
    const rawFile = info.blob() as File;
    loading.value = true;
    // const res = await upload(...);
    const res = { url: "url" };
    return res.url;
  } catch (error) {
    console.error("jcUploadFile", error);
    return "";
  } finally {
    loading.value = false;
  }
};
/**
 * Media = File type mapping
 */
export const acceptMap: Record<string, string> = {
  image: "image/*",
  media: ".mp4, .mp3",
};

/**
 * Custom click upload event (click trigger)
 * @param callback
 * @param value
 * @param meta
 */
export const filePickCb = (
  callback: (value: string, meta?: Record<string, any>) => void,
  value: string,
  meta: Record<string, any>,
  loading: Ref<boolean>
) => {
  const input = document.createElement("input");
  input.setAttribute("type", "file");
  input.setAttribute("accept", acceptMap[meta.filetype]);
  input.click();
  input.onchange = async function () {
    try {
      const file = input.files![0];
      loading.value = true;
      // const res = await upload(...);
      const res = { url: "url" };

      callback(res.url);
    } catch (error) {
      console.error(error, "jcUploadFile");
    } finally {
      loading.value = false;
    }
  };
};

const NS = "jc-tiny-edite";

const { VITE_THEME } = import.meta.env;

export const useHelp = (tinymce: TinyMCE) => {
  //code block
  createSrc("/tinymce/prism/prism.js", "jc-prism");

  const loading = ref(false);

  const { props, attrs, emit } = getCurrentInstance()!;

  const skinName = VITE_THEME === "dark" || props.dark ? "oxide-dark" : "oxide";

  const tinymceId = ref<string>(buildShortUUID(NS));

  const fullscreen = ref(false);

  const tinyInstance = ref<Nullable<Editor>>(null);

  const elRef = ref<Nullable<HTMLElement>>(null);

  const calcContentW = computed<string | number>(() => {
    const width = props.width as number;
    return isNumber(width) ? `${width}px` : width;
  });

  const optSetup = (editor: Editor) => {
    tinyInstance.value = editor;
    usePluginVideo(editor, { loading });
    usePluginImage(editor, { loading });
    editor.on("init", (e: any) => onLoaded(e));
  };

  const initOptions = computed((): RawEditorOptions => {
    const { height, options, toolbar, plugins, readonly, disabled } =
      props as PropsType;

    // if readonly readonly&inline
    const mergeOption = readonly
      ? Object.assign(options, { inline: true })
      : options;
    const mergeReadonly = readonly ? true : disabled ? true : false;
    return {
      license_key: "gpl",
      selector: `#${unref(tinymceId)}`,
      height,
      toolbar,
      inline: false,
      menubar: false,
      plugins,
      promotion: false,
      branding: false,
      convert_urls: false,
      elementpath: false,
      paste_webkit_styles: "all",
      codesample_global_prismjs: true,
      toolbar_mode: "sliding",
      language_url: "/tinymce/editeLang/zh-Hans.js",
      language: "zh-Hans",
      documentBaseUrl: "/",
      skin_url: `/tinymce/skins/ui/${skinName}`,
      skin: skinName,
      content_css: [
        !isInlineMode.value
          ? `/tinymce/skins/content/${
              skinName === "oxide-dark" ? "dark" : "default"
            }/content.css`
          : "",
        !isInlineMode.value ? `/tinymce/jc.init.${skinName}.css` : "",
        "/tinymce/prism/dracula.css",
      ],
      content_style: resetStyle, //重置一些(意外的样式文件冲突)样式
      codesample_languages: [
        { text: "HTML/XML", value: "markup" },
        { text: "JavaScript", value: "javascript" },
        { text: "TypeScript", value: "typescript" },
        { text: "CSS", value: "css" },
        { text: "Java", value: "java" },
      ],
      object_resizing: true,
      icons_url: "/tinymce/icon.js", //扩展icon包
      icons: "jc-icons", //扩展icon包里的包名
      font_size_input_default_unit: "px",
      font_size_formats: "12px 13px 14px 16px 18px 24px 36px 48px",
      images_upload_handler: (info, progress) =>
        imageHandle(info, progress, loading),
      file_picker_callback: (...args) => filePickCb(...args, loading),
      ...mergeOption,
      readonly: mergeReadonly,
      setup: optSetup,
    };
  });

  const isInlineMode = computed(() =>
    (props.options as any).inline ? true : false
  );

  watch(
    () => props.disabled,
    () => {
      const editor = unref(tinyInstance);
      editor?.mode.set(props.disabled ? "readonly" : "design");
    },
    {
      immediate: true,
    }
  );

  onMounted(() => mount());
  onActivated(() => mount());
  onBeforeUnmount(() => destory());
  onDeactivated(() => destory());

  const initEditor = async () => {
    destory();
    try {
      const el = unref(elRef);
      if (el) {
        el.style.visibility = "";
      }
      const opt = unref(initOptions);
      const editor = await tinymce.init(opt);
      emit("inited", editor);
    } catch (error) {
      emit("init-error", error);
    }
  };

  const setValue = (editor: Editor, val: string, prevVal?: string) => {
    if (
      editor &&
      typeof val === "string" &&
      val !== prevVal &&
      val !==
        editor.getContent({ format: attrs.outputFormat as "html" | "text" })
    ) {
      editor.setContent(val);
    }
  };

  const bindModelHandlers = (editor: Editor) => {
    watch(
      () => props.modelValue,
      (val: string, prevVal: string) => {
        setValue(editor, val, prevVal);
      }
    );

    watch(
      () => props.value,
      (val: string, prevVal: string) => {
        setValue(editor, val, prevVal);
      },
      {
        immediate: true,
      }
    );
    //form trigger such as:element-plus
    // const { emitTrigger } = useTrigger();
    //merge events
    const evs = mergeEvents(attrs.modelEvents as string | string[]);

    editor.on(evs, () => {
      const content = editor.getContent({
        format: attrs.outputFormat as "html" | "text",
      });
      emit("update:modelValue", content);
      emit("change", content);
      // emitTrigger();
    });

    editor.on("FullscreenStateChanged", (e: any) => {
      fullscreen.value = e.state;
    });
  };

  const onLoaded = (e: Event) => {
    const editor = unref(tinyInstance) as Editor;
    if (!editor) {
      return;
    }
    const value = (props.modelValue || "") as string;
    editor.setContent(value);
    bindModelHandlers(editor);
    bindHandlers(e, attrs, unref(tinyInstance));
  };

  const destory = () => {
    tinymce?.remove?.(unref(initOptions).selector!);
  };

  const mount = async () => {
    tinymceId.value = buildShortUUID(NS);
    await nextTick();
    initEditor();
  };
  return {
    setValue,
    bindModelHandlers,
    fullscreen,
    onLoaded,
    tinyInstance,
    optSetup,
    destory,
    calcContentW,
    initOptions,
    elRef,
    tinymceId,
    mount,
    loading,
    skinName,
    isInlineMode,
  };
};
