<template>
  <div
    id="download-app"
    class="w-full h-full bg-white p-5 flex flex-col gap-10"
  >
    <img
      :src="commonStore.partner?.logo?.full"
      class="w-40"
    />
    <div class="flex flex-col gap-2">
      <h1 class="text-2xl font-semibold">
        {{
          $t('v1.view.download_app.title', {
            name: commonStore.partner?.name,
          })
        }}
      </h1>
      <div class="text-sm text-slate-700">
        {{ $t('v1.view.download_app.description') }}
      </div>
    </div>

    <div class="grid grid-cols-2 gap-2">
      <a
        href="https://play.google.com/store/apps/details?id=ai.retion.app&pli=1"
        target="_blank"
        rel="noopener noreferrer"
      >
        <img
          src="@/assets/imgs/google-play.png"
          class="mx-auto"
        />
      </a>
      <a
        href="https://apps.apple.com/vn/app/retion/id6624302624"
        target="_blank"
        rel="noopener noreferrer"
      >
        <img
          src="@/assets/imgs/app-store.png"
          class="mx-auto"
        />
      </a>
    </div>
  </div>
</template>
<script setup lang="ts">
import { useCommonStore } from '@/stores'

const commonStore = useCommonStore()
</script>
