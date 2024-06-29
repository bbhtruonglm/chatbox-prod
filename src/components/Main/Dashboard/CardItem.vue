<template>
  <div class="rounded-lg py-3 px-4 bg-white flex gap-3">
    <div class="flex-shrink-0">
      <slot name="icon" />
    </div>
    <div class="flex flex-col gap-3 w-full min-w-0">
      <div class="flex justify-between">
        <div class="text-sm font-medium">
          <slot name="title" />
        </div>
        <slot name="action" />
      </div>
      <slot name="item" />
    </div>
  </div>
</template>
