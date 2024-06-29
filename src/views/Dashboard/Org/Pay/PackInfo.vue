<template>
  <CardItem>
    <template #icon>
      <QueueIcon class="w-5 h-5" />
    </template>
    <template #title>
      {{ $t('v1.view.main.dashboard.org.pay.pack_info') }}
    </template>
    <template #item>
      <div class="flex flex-col gap-2.5">
        <div
          v-if="type === 'MONTH'"
          class="text-slate-500 text-sm font-medium"
        >
          {{ $t('v1.view.main.dashboard.org.pay.guild_1') }}
        </div>
        <div class="grid grid-cols-2 gap-2.5">
          <Item :title="$t('v1.view.main.dashboard.org.pay.pack_use')">
            <template v-if="type === 'FREE'">
              {{ $t('v1.view.main.dashboard.org.pay.free') }}
            </template>
            <template v-if="type === 'MONTH'">
              {{ $t('v1.view.main.dashboard.org.pay.pro') }}
            </template>
          </Item>
          <Item :title="$t('v1.view.main.dashboard.org.pay.pack_time')">
            <template v-if="type === 'FREE'">
              {{ $t('v1.view.main.dashboard.org.pay.unlimited') }}
            </template>
            <template v-if="type === 'MONTH'">
              1
              {{ $t('v1.view.main.dashboard.org.pay.month') }}
              <span class="font-medium">
                ({{ $t('v1.view.main.dashboard.org.pay.next_pay') }}
                {{ date_format(new Date(), 'dd/MM/yyyy') }})
              </span>
            </template>
          </Item>
          <Item :title="$t('v1.view.main.dashboard.org.pay.page_amount')">
            <template v-if="type === 'FREE'"> 2 </template>
            <template v-if="type === 'MONTH'">
              <span class="text-green-700">2</span> / 5
            </template>
          </Item>
          <Item :title="$t('v1.view.main.dashboard.org.pay.staff_amount')">
            <template v-if="type === 'FREE'"> 5 </template>
            <template v-if="type === 'MONTH'">
              <span class="text-green-700">8</span> / 20
            </template>
          </Item>
          <Item :title="$t('v1.view.main.dashboard.org.pay.ai_text')">
            <template v-if="type === 'FREE'">
              {{ currency(10000) }}
              {{ $t('v1.view.main.dashboard.org.pay.text_month') }}
            </template>
            <template v-if="type === 'MONTH'">
              <span class="text-green-700">
                {{ currency(10000) }}
              </span>
              /
              {{ currency(10000) }}
              {{ $t('v1.view.main.dashboard.org.pay.text') }}
            </template>
          </Item>
          <Item :title="$t('v1.view.main.dashboard.org.pay.ai_image')">
            <template v-if="type === 'FREE'">
              {{ currency(10000) }}
              {{ $t('v1.view.main.dashboard.org.pay.image_month') }}
            </template>
            <template v-if="type === 'MONTH'">
              <span class="text-green-700">
                {{ currency(3) }}
              </span>
              /
              {{ currency(30) }}
              {{ $t('v1.view.main.dashboard.org.pay.image') }}
            </template>
          </Item>
          <Item :title="$t('v1.view.main.dashboard.org.pay.ai_sound')">
            <template v-if="type === 'FREE'">
              {{ currency(10000) }}
              {{ $t('v1.view.main.dashboard.org.pay.minute_month') }}
            </template>
            <template v-if="type === 'MONTH'">
              <span class="text-green-700">
                {{ currency(3) }}
              </span>
              /
              {{ currency(30) }}
              {{ $t('v1.view.main.dashboard.org.pay.minute') }}
            </template>
          </Item>
          <Item :title="$t('v1.view.main.dashboard.org.pay.ai_video')">
            <template v-if="type === 'FREE'"> - </template>
            <template v-if="type === 'MONTH'">
              <span class="text-green-700">
                {{ currency(3) }}
              </span>
              /
              {{ currency(30) }}
              {{ $t('v1.view.main.dashboard.org.pay.second') }}
            </template>
          </Item>
        </div>
        <div
          v-if="type === 'MONTH'"
          class="text-slate-500 text-sm font-medium rounded-xl border p-3 flex flex-col gap-2.5"
        >
          <Toggle class_toggle="peer-checked:bg-black">
            <span class="text-green-600">
              {{ $t('v1.view.main.dashboard.org.pay.auto_pay') }}
            </span>
          </Toggle>
          <div class="text-slate-500 text-sm font-medium">
            {{ $t('v1.view.main.dashboard.org.pay.guild_2') }}
          </div>
        </div>
        <button
          v-if="type === 'FREE'"
          @click="upgrade_modal_ref?.toggleModal()"
          class="custom-btn"
        >
          {{ $t('v1.view.main.dashboard.org.pay.upgrade_pack') }}
        </button>
        <div
          v-if="type === 'MONTH'"
          class="flex gap-3"
        >
          <button class="custom-btn">
            {{ $t('v1.view.main.dashboard.org.pay.buy_more_page') }}
          </button>
          <button class="custom-btn">
            {{ $t('v1.view.main.dashboard.org.pay.buy_more_staff') }}
          </button>
        </div>
      </div>
    </template>
  </CardItem>
  <UpgradeModal ref="upgrade_modal_ref" />
</template>
<script setup lang="ts">
import { currency } from '@/service/helper/format'
import { format as date_format } from 'date-fns'

import Toggle from '@/components/Toggle.vue'
import CardItem from '@/components/Main/Dashboard/CardItem.vue'
import Item from '@/views/Dashboard/Org/Pay/PackInfo/Item.vue'
import UpgradeModal from '@/views/Dashboard/Org/Pay/PackInfo/UpgradeModal.vue'

import QueueIcon from '@/components/Icons/Queue.vue'
import { ref } from 'vue'

const $props = withDefaults(
  defineProps<{
    /**loại gói cước */
    type: 'FREE' | 'MONTH'
  }>(),
  {}
)

/**ref của modal mua gói mới */
const upgrade_modal_ref = ref<InstanceType<typeof UpgradeModal>>()
</script>
<style scoped lang="scss">
.custom-btn {
  @apply py-2 px-4 rounded-md bg-blue-600 text-white hover:brightness-90 w-48;
}
</style>
