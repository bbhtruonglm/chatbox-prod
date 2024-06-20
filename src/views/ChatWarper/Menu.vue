<template>
  <div class="h-full flex-shrink-0 flex flex-col justify-between">
    <div class="flex flex-col gap-1 overflow-y-auto">
      <div class="flex justify-center">
        <button @click="$router.push('/dashboard/select-page')">
          <img
            src="@/assets/icons/bbh-mini.svg"
            class="w-9"
          />
        </button>
      </div>
      <FilterBar />
    </div>
    <NavItem
      :icon="settingSvg"
      :is_only_show_icon="true"
      @click="selectNav($router, '/dashboard/user')"
      :title="$t('v1.view.main.dashboard.nav.setting_user')"
    />
  </div>
</template>

<script setup lang="ts">
import { selectNav } from '@/service/function'

import FilterBar from '@/views/Dashboard/Menu/FilterBar.vue'
import settingSvg from '@/assets/icons/setting.svg'
import NavItem from '@/components/Main/Dashboard/NavItem.vue'
</script>
