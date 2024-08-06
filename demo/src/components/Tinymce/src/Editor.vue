<template>
  <div class="jc-tinymce-container" :style="{ width: calcContentW }">
    <textarea :id="tinymceId" ref="elRef" v-if="!isInlineMode"></textarea>
    <div :id="tinymceId" ref="elRef" class="jc-edite-inline" v-else></div>
  </div>
</template>

<script lang="ts">
import tinymce from "tinymce";
import "./pluginLoader";
import { defineComponent } from "vue";
import { useHelp } from "./helper";
import { tinymceProps } from "./props";
export default defineComponent({
  name: "JcEditor",
  inheritAttrs: false,
  props: tinymceProps,
  emits: ["change", "update:modelValue", "inited", "init-error"],
  setup() {
    const useHelpHook = useHelp(tinymce);
    return {
      ...useHelpHook,
    };
  },
});
</script>

<style lang="css">
.jc-tinymce-container {
  position: relative;
  width: 100% !important;
  line-height: normal;
}
textarea {
  visibility: hidden;
  z-index: -1;
}

.tox-editor-header {
  .tox-toolbar__group {
    padding: 0 5px;
  }
}

.tox-tinymce-aux {
  z-index: 9999 !important;
}
</style>
