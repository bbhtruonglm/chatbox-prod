<template>
  <input
    v-model="model"
    type="checkbox"
    class="custom-checkbox"
  />
</template>
<script setup lang="ts">
/** Khai báo v-model */
const model = defineModel<boolean>()
</script>
<style scoped lang="scss">
.custom-checkbox {
  @apply appearance-none w-4 h-4 shadow-sm bg-white border-[1.5px] border-black rounded relative cursor-pointer;

  &:checked {
    @apply bg-black;

    &::after {
      content: '';
      @apply absolute border-white top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rotate-45 border-r-2 border-b-2 w-1 h-2;
    }
  }

  &:disabled {
    @apply cursor-not-allowed border-gray-200 bg-gray-100;

    &::after {
      @apply border-gray-200;
    }
  }
}
.btn-custom {
  @apply justify-between text-sm font-medium py-2 px-4 rounded-md hover:brightness-90;
}
</style>
