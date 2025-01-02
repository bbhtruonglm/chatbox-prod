<template>
  <CardItem>
    <template #icon>
      <ChatBubbleLeftRightIcon class="w-5 h-5" />
    </template>
    <template #title>
      {{ $t('Hội thoại') }}
      <div class="text-xs text-slate-500">
        {{ $t('Thiết lập hội thoại khi ở chế độ Gộp trang.') }}
      </div>
    </template>
    <template #item>
      <div class="flex gap-3">
        <InboxStackIcon class="text-slate-700 w-4 h-4" />
        <div class="flex flex-row w-full justify-between gap-3">
          <div class="flex-shrink-0">
            <h4 class="text-sm font-medium">
              {{ $t('Chế độ hiển thị hội thoại') }}
            </h4>
            <h4 class="text-sm text-slate-500">
              {{ $t('Thiết lập hiển thị hội thoại') }}
            </h4>
          </div>
          <select
            v-model="org_sort_conversation"
            class="w-fit p-2 px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm"
          >
            <option value="NEWEST">
              {{ $t('Hội thoại mới nhất') }}
            </option>
            <option value="UNREAD">
              {{ $t('Hội thoại chưa đọc') }}
            </option>
          </select>
        </div>
      </div>
      <div class="h-px w-full bg-slate-200" />
      <div class="flex gap-3">
        <UsersIcon class="text-slate-700 w-4 h-4" />
        <div class="flex flex-row w-full justify-between gap-3">
          <div class="flex-shrink-0">
            <h4 class="text-sm font-medium">
              {{ $t('Hiện hội thoại theo nhân viên chỉ định') }}
            </h4>
            <h4 class="text-sm text-slate-500">
              {{
                $t(
                  'Khi bật chế độ này, hệ thống chỉ hiện ra hội thoại cho nhân viên được chỉ định.'
                )
              }}
            </h4>
            <h4 class="text-sm text-slate-500">
              {{ $t('Đối với Quản trị viên vẫn xem được toàn bộ hội thoại.') }}
            </h4>
          </div>
          <div>
            <Toggle
              v-model="org_is_only_visible_client_of_staff"
              class_toggle="peer-checked:bg-black"
            />
          </div>
        </div>
      </div>
    </template>
  </CardItem>
</template>
<script setup lang="ts">
import { computed } from 'vue'
import { useOrgStore } from '@/stores'
import { initRequireData } from '@/views/Dashboard/Org/composable'
import { set } from 'lodash'

import CardItem from '@/components/Main/Dashboard/CardItem.vue'
import Toggle from '@/components/Toggle.vue'

import {
  ChatBubbleLeftRightIcon,
  InboxStackIcon,
  UsersIcon,
} from '@heroicons/vue/24/solid'

const orgStore = useOrgStore()
const { updateOrg } = initRequireData()

/**chỉ hiện hội thoại của nv */
const org_is_only_visible_client_of_staff = computed({
  get() {
    // lấy dữ liệu từ store
    return orgStore.selected_org_info?.org_config
      ?.org_is_only_visible_client_of_staff
  },
  set(val) {
    // set dữ liệu vào store
    set(
      orgStore,
      'selected_org_info.org_config.org_is_only_visible_client_of_staff',
      val
    )

    // gọi api update
    updateOrg()
  },
})
/**chỉ hiện hội thoại của nv */
const org_sort_conversation = computed({
  get() {
    // lấy dữ liệu từ store
    return (
      orgStore.selected_org_info?.org_config?.org_sort_conversation || 'NEWEST'
    )
  },
  set(val) {
    // set dữ liệu vào store
    set(orgStore, 'selected_org_info.org_config.org_sort_conversation', val)

    // gọi api update
    updateOrg()
  },
})
</script>
