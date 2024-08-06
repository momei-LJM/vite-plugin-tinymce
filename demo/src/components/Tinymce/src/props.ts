import { RawEditorOptions } from 'tinymce'
import { ExtractPropTypes, PropType } from 'vue'
import { plugins, toolbar } from './tinymce'

export const tinymceProps = {
  options: {
    type: Object as PropType<Partial<RawEditorOptions>>,
    default: () => ({})
  },
  value: {
    type: String
  },

  disabled: {
    type: Boolean,
    default: false
  },
  toolbar: {
    type: String,
    default: toolbar
  },
  plugins: {
    type: Array as PropType<string[]>,
    default: plugins
  },
  modelValue: {
    type: String
  },
  height: {
    type: [Number, String] as PropType<string | number>,
    required: false,
    default: 300
  },
  width: {
    type: [Number, String] as PropType<string | number>,
    required: false,
    default: 'auto'
  },
  /**只读模式 用于详情展示 === disabled + inline */
  readonly: {
    type: Boolean,
    required: false,
    default: false
  },
  dark: {
    type: Boolean,
    required: false,
    default: false
  }
}

export type PropsType = ExtractPropTypes<typeof tinymceProps>
