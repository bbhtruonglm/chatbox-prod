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
          v-if="!isFreePack()"
          class="text-slate-500 text-sm font-medium"
        >
          {{ $t('v1.view.main.dashboard.org.pay.guild_1') }}
        </div>
        <div class="grid grid-cols-2 gap-2.5">
          <Item :title="$t('v1.view.main.dashboard.org.pay.pack_use')">
            {{
              $t(
                `v1.view.main.dashboard.org.pay.${orgStore.selected_org_info?.org_package?.org_package_type?.toLowerCase()}`
              )
            }}
          </Item>
          <Item :title="$t('v1.view.main.dashboard.org.pay.pack_time')">
            <template v-if="isFreePack()">
              {{ $t('v1.view.main.dashboard.org.pay.unlimited') }}
            </template>
            <template v-else-if="isTrialPack() || isProPack()">
              1
              {{ $t('v1.view.main.dashboard.org.pay.month') }}
              <span class="font-medium">
                ({{ $t('v1.view.main.dashboard.org.pay.next_pay') }}
                {{ calcNextPay() }})
              </span>
            </template>
          </Item>
          <Item :title="$t('v1.view.main.dashboard.org.pay.page_amount')">
            <span class="text-green-700">
              {{
                orgStore.selected_org_info?.org_package?.org_current_page || 0
              }}
            </span>
            /
            {{ orgStore.selected_org_info?.org_package?.org_quota_page || 0 }}
          </Item>
          <Item :title="$t('v1.view.main.dashboard.org.pay.staff_amount')">
            <span class="text-green-700">
              {{
                orgStore.selected_org_info?.org_package?.org_current_staff || 0
              }}
            </span>
            /
            {{ orgStore.selected_org_info?.org_package?.org_quota_staff || 0 }}
          </Item>
          <Item :title="$t('v1.view.main.dashboard.org.pay.fau')">
            <span class="text-green-700">
              {{
                currency(
                  orgStore.selected_org_info?.org_package?.org_current_fau
                ) || 0
              }}
            </span>
            /
            {{
              currency(
                orgStore.selected_org_info?.org_package?.org_quota_fau
              ) || 0
            }}
            FAU
          </Item>
          <Item :title="$t('v1.view.main.dashboard.org.pay.ai_text')">
            <span class="text-green-700">
              {{
                currency(
                  orgStore.selected_org_info?.org_package?.org_current_ai_text
                ) || 0
              }}
            </span>
            /
            {{
              currency(
                orgStore.selected_org_info?.org_package?.org_quota_ai_text
              ) || 0
            }}
            {{ $t('v1.view.main.dashboard.org.pay.text') }}
          </Item>
          <Item :title="$t('v1.view.main.dashboard.org.pay.ai_image')">
            <span class="text-green-700">
              {{
                currency(
                  orgStore.selected_org_info?.org_package?.org_current_ai_image
                ) || 0
              }}
            </span>
            /
            {{
              currency(
                orgStore.selected_org_info?.org_package?.org_quota_ai_image
              ) || 0
            }}
            {{ $t('v1.view.main.dashboard.org.pay.image') }}
          </Item>
          <Item :title="$t('v1.view.main.dashboard.org.pay.ai_sound')">
            <span class="text-green-700">
              {{
                currency(
                  orgStore.selected_org_info?.org_package?.org_current_ai_sound
                ) || 0
              }}
            </span>
            /
            {{
              currency(
                orgStore.selected_org_info?.org_package?.org_quota_ai_sound
              ) || 0
            }}
            {{ $t('v1.view.main.dashboard.org.pay.minute') }}
          </Item>
          <Item :title="$t('v1.view.main.dashboard.org.pay.ai_video')">
            <span class="text-green-700">
              {{
                currency(
                  orgStore.selected_org_info?.org_package?.org_current_ai_video
                ) || 0
              }}
            </span>
            /
            {{
              currency(
                orgStore.selected_org_info?.org_package?.org_quota_ai_video
              ) || 0
            }}
            {{ $t('v1.view.main.dashboard.org.pay.second') }}
          </Item>
        </div>
        <div
          v-if="!isFreePack()"
          class="text-slate-500 text-sm font-medium rounded-xl border p-3 flex flex-col gap-2.5"
        >
          <Toggle
            v-model="org_is_auto_charge"
            class_toggle="peer-checked:bg-black"
          >
            <span class="text-green-600">
              {{ $t('v1.view.main.dashboard.org.pay.auto_pay') }}
            </span>
          </Toggle>
          <div class="text-slate-500 text-sm font-medium">
            {{ $t('v1.view.main.dashboard.org.pay.guild_2') }}
          </div>
        </div>
        <button
          v-if="isFreePack()"
          @click="upgrade_modal_ref?.toggleModal()"
          class="custom-btn"
        >
          {{ $t('v1.view.main.dashboard.org.pay.upgrade_pack') }}
        </button>
        <div
          v-else
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
import { computed, ref } from 'vue'
import { useOrgStore } from '@/stores'
import { set } from 'lodash'
import { useI18n } from 'vue-i18n'
import { initRequireData } from '@/views/Dashboard/Org/composable'

import Toggle from '@/components/Toggle.vue'
import CardItem from '@/components/Main/Dashboard/CardItem.vue'
import Item from '@/views/Dashboard/Org/Pay/PackInfo/Item.vue'
import UpgradeModal from '@/views/Dashboard/Org/Pay/PackInfo/UpgradeModal.vue'

import QueueIcon from '@/components/Icons/Queue.vue'

const orgStore = useOrgStore()
const { t: $t } = useI18n()

const { updateOrg } = initRequireData()

/**ref của modal mua gói mới */
const upgrade_modal_ref = ref<InstanceType<typeof UpgradeModal>>()

/**có kích hoạt tự động thanh toán không */
const org_is_auto_charge = computed({
  get() {
    return orgStore.selected_org_info?.org_config?.org_is_auto_charge
  },
  set(val) {
    // set giá trị mới
    set(orgStore, 'selected_org_info.org_config.org_is_auto_charge', val)

    // gọi hàm update thông tin org
    updateOrg()
  },
})

/**có phải là gói miễn phí không */
function isFreePack() {
  return orgStore.selected_org_info?.org_package?.org_package_type === 'FREE'
}
/**có phải là gói dùng thử không */
function isTrialPack() {
  return orgStore.selected_org_info?.org_package?.org_package_type === 'TRIAL'
}
/**có phải là gói pro không */
function isProPack() {
  return orgStore.selected_org_info?.org_package?.org_package_type === 'PRO'
}
/**có phải là gói doanh nghiệp không */
function isBusinessPack() {
  return (
    orgStore.selected_org_info?.org_package?.org_package_type === 'BUSINESS'
  )
}
/**tính thời gian thanh toán tiếp theo */
function calcNextPay() {
  /**thời gian hết hạn */
  const END_DATE = orgStore.selected_org_info?.org_package?.org_end_date

  // nếu không có thời gian hết hạn thì trả về rỗng
  if (!END_DATE) return ''

  // trả về thời gian thanh toán tiếp theo
  return date_format(new Date(END_DATE), 'dd/MM/yyyy')
}
</script>
<style scoped lang="scss">
.custom-btn {
  @apply py-2 px-4 rounded-md bg-blue-600 text-white hover:brightness-90 w-48;
}
</style>
