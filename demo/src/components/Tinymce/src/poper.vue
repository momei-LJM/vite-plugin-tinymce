<template>
  <el-popover ref="popoverRef" :virtual-ref="reference" trigger="click" virtual-triggering width="auto">
    <div class="jc-template-container">
      <div v-for="item in list" :key="item"> {{ item }}</div>
      <el-button type="primary">取消</el-button>
      <el-button type="primary">确定</el-button>
    </div>
  </el-popover>
</template>

<script lang="ts">
import { PropType, VNode, defineComponent, ref, shallowRef } from 'vue'
import { ClickOutside as vClickOutside, ElButton, ElCard, ElPopover } from 'element-plus'
export default defineComponent({
  directives: { vClickOutside },
  components: { ElButton, ElCard, ElPopover },
  props: {
    reference: {
      type: Object as PropType<VNode>
    }
  },
  setup() {
    const buttonRef = ref()
    const popoverRef = ref()

    const list = shallowRef(['模版一', '模版二', '模版三'])
    return { popoverRef, buttonRef, list }
  }
})
</script>
<style lang="scss" scoped>
.jc-template-container {
  width: 200px;
  height: 250px;
  padding: $jc-default-dis;
}
</style>
