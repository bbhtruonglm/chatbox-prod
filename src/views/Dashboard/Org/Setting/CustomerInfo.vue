<template>
  <CardItem>
    <template #icon>
      <BriefCaseIcon class="w-5 h-5" />
    </template>
    <template #title>
      {{ $t('v1.view.main.dashboard.org.setting.customer_info.title') }}
    </template>
    <template #action>
      <button
        v-if="!is_edit"
        @click="activeEdit"
        class="bg-blue-600 text-white py-1 px-4 rounded-md text-sm font-medium"
      >
        {{ $t('v1.common.change') }}
      </button>
      <div
        v-else
        class="flex gap-2"
      >
        <button
          @click="save"
          class="bg-green-600 text-white py-1 px-4 rounded-md text-sm font-medium"
        >
          {{ $t('v1.common.ok') }}
        </button>
        <button
          @click="cancelEdit"
          class="bg-gray-600 text-white py-1 px-4 rounded-md text-sm font-medium"
        >
          {{ $t('v1.common.cancel') }}
        </button>
      </div>
    </template>
    <template #item>
      <div class="grid grid-cols-2 text-sm font-medium gap-2 pr-5">
        <Item
          :title="
            $t('v1.view.main.dashboard.org.setting.customer_info.org_name')
          "
          v-model="org_info.org_name"
          :is_edit
        />
        <Item
          :title="
            $t('v1.view.main.dashboard.org.setting.customer_info.org_avatar')
          "
          v-model="org_info.org_avatar"
          :is_edit
        >
          <img
            v-if="org_info.org_avatar"
            :src="org_info.org_avatar"
            class="w-5 h-5"
          />
        </Item>
        <Item
          :title="
            $t('v1.view.main.dashboard.org.setting.customer_info.customer_code')
          "
          v-model="org_info.org_customer_code"
          :is_edit="false"
        />
        <Item
          :title="
            $t('v1.view.main.dashboard.org.setting.customer_info.contract_code')
          "
          v-model="org_info.org_contract_code"
          :is_edit="false"
        />
        <Item
          :title="
            $t('v1.view.main.dashboard.org.setting.customer_info.company_name')
          "
          v-model="org_info.org_company_name"
          :is_edit
        />
        <Item
          :title="
            $t('v1.view.main.dashboard.org.setting.customer_info.tax_code')
          "
          v-model="org_info.org_tax_code"
          :is_edit
        />
        <Item
          :title="
            $t(
              'v1.view.main.dashboard.org.setting.customer_info.representative'
            )
          "
          v-model="org_info.org_representative"
          :is_edit
        />
        <Item
          :title="
            $t('v1.view.main.dashboard.org.setting.customer_info.address')
          "
          v-model="org_info.org_address"
          :is_edit
        />
        <Item
          :title="$t('v1.view.main.dashboard.org.setting.customer_info.phone')"
          v-model="org_info.org_phone"
          :is_edit
        />
        <Item
          :title="$t('v1.view.main.dashboard.org.setting.customer_info.email')"
          v-model="org_info.org_email"
          :is_edit
        />
      </div>
      <ul class="list-disc list-inside text-xs text-slate-500 pl-2.5">
        <li class="pl-4 -indent-4">
          {{ $t('v1.view.main.dashboard.org.setting.customer_info.guild_1') }}
        </li>
        <li class="pl-4 -indent-4">
          {{ $t('v1.view.main.dashboard.org.setting.customer_info.guild_2') }}
          hotro@botbanhang.vn
        </li>
      </ul>
    </template>
  </CardItem>
</template>
<script setup lang="ts">
import { useOrgStore } from '@/stores'
import { computed, ref } from 'vue'
import { set } from 'lodash'
import { copy } from '@/service/helper/format'
import { toast, toastError } from '@/service/helper/alert'
import { update_org } from '@/service/api/chatbox/billing'
import { useI18n } from 'vue-i18n'

import Item from '@/views/Dashboard/Org/Setting/CustomerInfo/Item.vue'

import CardItem from '@/components/Main/Dashboard/CardItem.vue'
import BriefCaseIcon from '@/components/Icons/BriefCase.vue'

import type { OrgInfo } from '@/service/interface/app/billing'

const orgStore = useOrgStore()
const { t: $t } = useI18n()

/**có kích hoat chế độ sửa không */
const is_edit = ref(false)
/**dữ liệu trước khi sửa */
const old_info = ref<OrgInfo['org_info']>({})

/** Lấy thông tin khách hàng */
const org_info = computed({
  get() {
    return orgStore.selected_org_info?.org_info || {}
  },
  set(val) {
    set(orgStore, 'selected_org_info.org_info', val)
  },
})

/**bắt đầu chỉnh sửa nội dung */
function activeEdit() {
  // lưu lại thông tin cũ
  old_info.value = copy(org_info.value)

  // kích hoạt chế độ sửa
  is_edit.value = true
}
/**hủy bỏ chỉnh sửa */
function cancelEdit() {
  // nếu đang xử lý thì không cho huỷ
  if (orgStore.is_loading) return

  // khôi phục lại thông tin cũ
  org_info.value = copy(old_info.value || {})

  // tắt chế độ sửa
  is_edit.value = false
}
/**lưu lại thông tin mới */
async function save() {
  // nếu chưa chọn org thì không làm gì
  if (!orgStore.selected_org_id || orgStore.is_loading) return

  // bật chế độ loading
  orgStore.is_loading = true

  try {
    // gửi request lên server
    await update_org(orgStore.selected_org_id, {
      org_info: org_info.value,
    })

    // tắt chế độ sửa
    is_edit.value = false

    toast('success', $t('v1.common.update_success'))
  } catch (e) {
    // nếu có lỗi thì thông báo lỗi
    toastError(e)
  }

  // tắt chế độ loading
  orgStore.is_loading = false
}
</script>
