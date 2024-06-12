<template>
  <div
    :class="isChat() ? 'w-[60px]' : 'w-[220px]'"
    class="h-full flex-shrink-0"
  >
    <div
      class="w-full h-full relative py-14 px-4 md:py-8 md:px-2 xl:py-1 border-r"
    >
      <div class="flex justify-center">
        <div class="block md:hidden">
          <img src="@/assets/icons/bbh-large.svg" />
        </div>
        <div class="hidden md:block">
          <img
            v-if="!isChat()"
            src="@/assets/icons/bbh-large.svg"
            class="h-[37px]"
          />
          <img
            v-else
            src="@/assets/icons/bbh-mini.svg"
            class="h-[37px]"
          />
        </div>
      </div>
      <hr class="mt-2" />
      <div
        class="pt-2 md:h-[calc(100%_-_85px)] xl:h-[calc(100%_-_110px)] overflow-hidden scrollbar-vertical overflow-y-auto"
      >
        <MenuBar v-if="!$route.path?.includes('/chat')" />
        <FilterBar v-else />
      </div>
      <div
        class="absolute bottom-[40px] md:bottom-[17px] w-[calc(100%_-_32px)] md:w-[calc(100%_-_16px)]"
      >
        <NavItem
          v-if="isChat()"
          class="hidden md:flex"
          :icon="settingSvg"
          :is_only_show_icon="true"
          @click="selectNav($router, '/dashboard/user')"
          :title="$t('v1.view.main.dashboard.nav.setting_user')"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { isChat } from '@/service/function'
import { selectNav } from '@/service/function'

import FilterBar from '@/views/Dashboard/Menu/FilterBar.vue'
import MenuBar from '@/views/Dashboard/Menu/MenuBar.vue'
import settingSvg from '@/assets/icons/setting.svg'
import NavItem from '@/components/Main/Dashboard/NavItem.vue'
</script>
