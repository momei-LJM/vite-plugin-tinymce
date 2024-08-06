export const plugins = [
  'advlist',
  'autolink',
  'lists',
  'link',
  'image',
  'charmap',
  'preview',
  'anchor',
  'searchreplace',
  'visualblocks',
  'code',
  'fullscreen',
  'insertdatetime',
  'media',
  'table',
  // 'wordcount',
  'codesample'
]
// 不常见工具
// const rareToolbar = 'subscript superscript code codesample anchor insertdatetime'
// | 分割 编辑器宽度不够时的可以缩略 以 ... 展示(mode:floating)
export const toolbar =
  'fontsize | styles | lineheight | searchreplace | bold | italic | underline | strikethrough | alignleft | aligncenter | alignright |outdent | indent | blockquote | undo | redo | removeformat | hr | bullist | numlist | link preview | pagebreak | forecolor | backcolor | table | jc-video | jc-image | fullscreen | codesample'

let unique = 0
export function buildShortUUID(prefix = ''): string {
  const time = Date.now()
  const random = Math.floor(Math.random() * 1000000000)
  unique++
  return prefix + '_' + random + unique + String(time)
}
