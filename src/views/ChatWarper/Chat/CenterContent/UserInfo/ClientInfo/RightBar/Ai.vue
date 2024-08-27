<template>
  <div class="flex gap-2.5 flex-grow min-h-0">
    <div
      class="w-[119px] flex-shrink-0 bg-gray-100 rounded-md p-1 gap-1 flex flex-col overflow-y-auto"
    >
      <button
        class="text-left py-1 px-3 rounded bg-white text-sm font-medium shadow-sm hover:brightness-90"
      >
        {{ $t('v1.view.main.dashboard.chat.client.ai_menu.all') }}
      </button>
      <button
        class="text-gray-500 text-left py-1 px-3 rounded text-sm font-medium"
      >
        {{ $t('v1.view.main.dashboard.chat.client.ai_menu.emotion') }}
      </button>
      <button
        class="text-gray-500 text-left py-1 px-3 rounded text-sm font-medium"
      >
        {{ $t('v1.view.main.dashboard.chat.client.ai_menu.slow_response') }}
      </button>
      <button
        class="text-gray-500 text-left py-1 px-3 rounded text-sm font-medium"
      >
        {{ $t('v1.view.main.dashboard.chat.client.ai_menu.order') }}
      </button>
      <button
        class="text-gray-500 text-left py-1 px-3 rounded text-sm font-medium"
      >
        {{ $t('v1.view.main.dashboard.chat.client.ai_menu.schedule') }}
      </button>
      <button
        class="text-gray-500 text-left py-1 px-3 rounded text-sm font-medium"
      >
        {{ $t('v1.view.main.dashboard.chat.client.ai_menu.call') }}
      </button>
      <button
        class="text-gray-500 text-left py-1 px-3 rounded text-sm font-medium"
      >
        {{ $t('v1.view.main.dashboard.chat.client.ai_menu.address') }}
      </button>
      <button
        class="text-gray-500 text-left py-1 px-3 rounded text-sm font-medium"
      >
        {{ $t('v1.view.main.dashboard.chat.client.ai_menu.acronym') }}
      </button>
    </div>
    <div class="flex-grow min-w-0 flex flex-col gap-1 border rounded">
      <div class="flex-grow min-h-0 overflow-x-auto relative">
        <table class="w-full table-fixed border-collapse text-xs">
          <thead>
            <tr class="sticky left-0 top-0 border-b bg-white font-semibold">
              <th class="item">
                {{ $t('v1.view.main.dashboard.chat.client.time') }}
              </th>
              <th class="item">
                {{ $t('v1.view.main.dashboard.chat.client.type') }}
              </th>
              <th class="item w-28">
                {{ $t('v1.view.main.dashboard.chat.client.value') }}
              </th>
              <th class="item w-64">
                {{ $t('v1.view.main.dashboard.chat.client.message') }}
              </th>
              <th class="item">
                {{ $t('v1.view.main.dashboard.chat.client.convert') }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="i of 100"
              class="border-b"
            >
              <td class="item">
                {{ dateFormat('2024/08/24', 'hh:mm - dd/MM') }}
              </td>
              <td class="item">Cảm xúc</td>
              <td class="item truncate">Vui vẻ</td>
              <td class="item truncate">
                Lorem ipsum dolor sit amet consectetur, adipisicing elit. Aut
                dolore beatae dolor aperiam porro! Ipsa eaque aliquid sit eos
                aspernatur, consequuntur minima et explicabo quisquam maxime hic
                nulla accusamus impedit!
              </td>
              <td class="item">Click CTA</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="flex-shrink-0 flex items-center gap-5 justify-end p-1">
        <div class="flex items-center gap-2">
          <LeftSquareIcon class="text-slate-500 w-7 h-7 cursor-pointer" />
          <div
            class="py-0.5 px-2 rounded-md bg-blue-700 text-white text-sm font-medium"
          >
            1
          </div>
          <LeftSquareIcon
            class="text-slate-500 w-7 h-7 rotate-180 cursor-pointer"
          />
        </div>
        <select class="py-2 px-3 rounded-md border text-sm focus:outline-none">
          <option value="1">
            20 / {{ $t('v1.view.main.dashboard.chat.client.page') }}
          </option>
          <option value="1">
            30 / {{ $t('v1.view.main.dashboard.chat.client.page') }}
          </option>
          <option value="1">
            50 / {{ $t('v1.view.main.dashboard.chat.client.page') }}
          </option>
        </select>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import LeftSquareIcon from '@/components/Icons/LeftSquare.vue'
import { dateFormat } from '@/service/helper/format'
</script>
<style scoped lang="scss">
.item {
  @apply py-1 px-2 text-left whitespace-nowrap;
}
</style>
