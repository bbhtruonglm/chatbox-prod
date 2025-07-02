<template>
  <splitpanes
    ref="container_ref"
    @resized="onResized"
    class="!w-full !h-full flex custom default-theme"
  >
    <template v-if="ready">
      <pane
        :min-size="min"
        :max-size="max"
        :size="size"
        class="h-full !text-sm"
      >
        <slot name="left" />
      </pane>
      <pane
        :size="100 - size"
        class="h-full !bg-transparent !text-sm"
      >
        <slot name="right" />
      </pane>
    </template>
  </splitpanes>
</template>

<script setup lang="ts">
import { Pane, Splitpanes } from 'splitpanes';
import 'splitpanes/dist/splitpanes.css';
import { computed, nextTick, onMounted, ref } from 'vue';

/** độ rộng tối thiểu của cột bên trái */
const MIN = 360
/** độ rộng tối đa của cột bên trái */
const MAX = 460

/** ref tới thẻ splitpanes bọc bên ngoài */
const container_ref = ref<InstanceType<typeof Splitpanes>>()
/** cờ check để render các thành phần bên trong tránh bị giật khi chiều rộng đang được tính toán */
const ready = ref(false)
/** chiều rộng của thẻ bọc ngoài cùng */
const width = ref(0)
/** chiều rộng của cột bên trái theo %*/
const size = ref(0)

/** chiều rộng tối thểu cột bên trái theo % */
const min = computed(() => Math.round((MIN / width.value) * 100))
/** chiều rộng tối đa cót bên trái theo % */
const max = computed(() => Math.round((MAX / width.value) * 100))

onMounted(() => {
  nextTick(() => {
    // nếu không có thẻ splitpanes bọc bên ngoài thì bỏ qua
    if (!container_ref.value) return

    // lưu lại chiều rộng của thẻ bọc
    width.value = container_ref.value?.$el?.clientWidth
    // set chiều rộng tối thiểu cột bên trái
    size.value = min.value

    // bật cờ để render ra các thành phần bên trong
    ready.value = true
  })
})

/** cập nhật chiều rộng cột bên trái */
function onResized({ prev_pane }: { prev_pane?: { size: number } }) {
  // nếu không có dữ liệu mới của thẻ được chỉnh sửa
  if (!prev_pane) return
  // lưu lại chiều rộng cột bên trái
  size.value = prev_pane.size
}
</script>

<style>
.custom.default-theme.splitpanes--vertical > .splitpanes__splitter {
  display: block;
  width: 10px;
  height: 100%;
  border-left: none;
  background: transparent;
}
</style>
