<template>
  <div class="flex">
    <div class="w-28 flex-shrink-0">
      {{ title }}
    </div>
    <div class="truncate min-w-0 flex-grow">
      <input
        v-if="is_edit"
        v-model="model"
        type="text"
        class="focus:outline-none w-full border-b"
        :placeholder="title"
      />
      <span v-else-if="model">
        {{ model }}
      </span>
      <span
        v-else
        class="text-slate-500"
      >
        {{ $t('v1.view.main.dashboard.org.setting.customer_info.empty') }}
      </span>
    </div>
    <slot />
  </div>
</template>
<script setup lang="ts">
const $props = withDefaults(
  defineProps<{
    /**tiêu đề */
    title: string
    /**có cho phép chỉnh sửa không */
    is_edit: boolean
  }>(),
  {}
)

/** Khai báo v-model */
const model = defineModel()
</script>
