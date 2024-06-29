<template>
  <Teleport
    to="body"
    v-if="is_open"
  >
    <Transition
      enter-active-class="transition ease-in-out duration-500"
      leave-active-class="transition ease-in-out duration-500"
      enter-from-class="opacity-0"
      leave-to-class="opacity-0"
    >
      <div
        @click="toggleModal"
        class="absolute top-0 left-0 w-screen h-screen bg-black/10 z-20 shadow-lg"
      >
        <div
          @click.stop
          class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white max-w-[95%] h-[550px] flex flex-col shadow-lg p-3 gap-4"
        >
          <div class="px-3 text-lg font-semibold flex-shrink-0 text-center">
            {{ $t('v1.view.main.dashboard.org.pay.upgrade.title') }}
          </div>
          <div class="flex gap-3 px-10 h-48">
            <div class="w-64 item">
              <div>
                <div class="tex-xl font-bold">
                  {{ $t('v1.view.main.dashboard.org.pay.free') }}
                </div>
                <ul class="text-sm font-medium list-disc list-inside">
                  <li class="pl-2">
                    {{ $t('v1.view.main.dashboard.org.pay.upgrade.price') }}
                    <span class="font-bold">
                      {{ $t('v1.view.main.dashboard.org.pay.free') }}
                    </span>
                  </li>
                  <li class="pl-2">
                    {{ $t('v1.view.main.dashboard.org.pay.upgrade.page') }}
                    <span class="font-bold"> 2 </span>
                  </li>
                  <li class="pl-2">
                    {{ $t('v1.view.main.dashboard.org.pay.upgrade.member') }}
                    <span class="font-bold"> 5 </span>
                  </li>
                  <li class="pl-2">
                    ... ({{
                      $t('v1.view.main.dashboard.org.pay.upgrade.more')
                    }})
                  </li>
                </ul>
              </div>
              <button class="btn bg-green-500 cursor-not-allowed">
                {{ $t('v1.view.main.dashboard.org.pay.upgrade.current') }}
              </button>
            </div>
            <div class="w-96 item">
              <div>
                <div class="flex items-center justify-between">
                  <div class="tex-xl font-bold">
                    {{ $t('v1.view.main.dashboard.org.pay.pro') }}
                  </div>
                  <Toggle class_toggle="peer-checked:bg-black">
                    <span class="text-green-600">
                      {{
                        $t('v1.view.main.dashboard.org.pay.upgrade.discount')
                      }}
                    </span>
                  </Toggle>
                </div>
                <ul class="text-sm font-medium list-disc list-inside">
                  <li class="pl-2">
                    {{ $t('v1.view.main.dashboard.org.pay.upgrade.price') }}
                    <span class="font-bold">
                      {{ currency(480000) }}đ / {{ $t('v1.common.month') }}
                    </span>
                  </li>
                  <li class="pl-2">
                    {{ $t('v1.view.main.dashboard.org.pay.upgrade.page') }}
                    <span class="font-bold"> 5 </span>
                  </li>
                  <li class="pl-2">
                    {{ $t('v1.view.main.dashboard.org.pay.upgrade.member') }}
                    <span class="font-bold"> 20 </span>
                  </li>
                  <li class="pl-2">
                    ... ({{
                      $t('v1.view.main.dashboard.org.pay.upgrade.more')
                    }})
                  </li>
                </ul>
              </div>
              <button class="btn bg-blue-600">
                {{ $t('v1.view.main.dashboard.org.pay.upgrade.trial_day_7') }}
              </button>
            </div>
            <div class="w-64 item">
              <div>
                <div class="tex-xl font-bold">
                  {{ $t('v1.view.main.dashboard.org.pay.upgrade.company') }}
                </div>
                <ul class="text-sm font-medium list-disc list-inside">
                  <li class="pl-2">
                    {{ $t('v1.view.main.dashboard.org.pay.upgrade.price') }}
                    {{ $t('v1.view.main.dashboard.org.pay.upgrade.contact') }}
                  </li>
                  <li class="pl-2">
                    {{ $t('v1.view.main.dashboard.org.pay.upgrade.page') }}
                    <span class="font-bold"> 5 </span>
                  </li>
                  <li class="pl-2">
                    {{ $t('v1.view.main.dashboard.org.pay.upgrade.staff') }}
                    <span class="font-bold"> 20 </span>
                  </li>
                  <li class="pl-2">
                    ... ({{
                      $t('v1.view.main.dashboard.org.pay.upgrade.more')
                    }})
                  </li>
                </ul>
              </div>
              <button class="btn bg-slate-500">
                {{ $t('v1.view.main.dashboard.org.pay.upgrade.contact_us') }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
<script setup lang="ts">
import { currency } from '@/service/helper/format'
import { ref } from 'vue'

import Toggle from '@/components/Toggle.vue'

/**ẩn hiện modal */
const is_open = ref(false)

/**ẩn hiện modal */
function toggleModal() {
  is_open.value = !is_open.value
}

defineExpose({ toggleModal })
</script>
<style scoped lang="scss">
.item {
  @apply bg-slate-100 p-2 rounded-lg flex flex-col justify-between;
}
.btn {
  @apply py-2 px-4 rounded-md text-white hover:brightness-90;
}
</style>
