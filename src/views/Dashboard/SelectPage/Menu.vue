<template>
  <MenuItem
    @click="dashboardStore.selectMenu(key)"
    v-for="{ key, title, icon } of list_platform"
    :icon="icon ?? SquareIcon"
    :title="title"
    :is_selected="isSelectedMenu(key)"
  />
</template>
<script setup lang="ts">
import MenuItem from '@/components/Main/Dashboard/MenuItem.vue'
import { useI18n } from 'vue-i18n'
import { ref, markRaw } from 'vue'
import { useSelectPageStore } from '@/stores'

import SquareIcon from '@/components/Icons/Square.vue'
import ClockIcon from '@/components/Icons/Clock.vue'
import FacebookIcon from '@/components/Icons/Facebook.vue'
import ZaloIcon from '@/components/Icons/Zalo.vue'
import WebIcon from '@/components/Icons/Web.vue'

import type { Component } from 'vue'

const { t: $t } = useI18n()
const dashboardStore = useSelectPageStore()

/** một phần tử của nền tảng */
interface PlatformItem {
  /** Khóa */
  key: string
  /** Tiêu đề */
  title: string
  /** Icon vue */
  icon?: Component
}

/** Danh sách các nền tảng */
const list_platform = ref<PlatformItem[]>(getPlatform())

/** Kiểm tra xem menu có được chọn không */
function isSelectedMenu(key: string) {
  return key === dashboardStore.current_menu
}
/**khởi tạo danh sách menu */
function getPlatform(): PlatformItem[] {
  /** Icon mặc định */
  const ICON_MAP: Record<string, Component> = {
    FB_MESS: markRaw(FacebookIcon),
    ZALO_OA: markRaw(ZaloIcon),
    WEBSITE: markRaw(WebIcon),
  }

  /** Menu mặc định */
  const DEFAULT_MENU: PlatformItem[] = [
    {
      key: 'ALL_PLATFORM',
      title: $t('v1.common.all'),
      icon: markRaw(SquareIcon),
    },
    {
      key: 'RECENT',
      title: $t('v1.common.recent'),
      icon: markRaw(ClockIcon),
    },
  ]

  /** Danh sách nền tảng */
  const LIST_PLATFORM_MENU: PlatformItem[] = $env.platform?.map(
    platform_key => ({
      key: platform_key,
      title: $t(`v1.common.${platform_key.toLowerCase()}`),
      icon: ICON_MAP[platform_key],
    })
  )

  // Trả về danh sách menu
  return [...DEFAULT_MENU, ...LIST_PLATFORM_MENU]
}
</script>
