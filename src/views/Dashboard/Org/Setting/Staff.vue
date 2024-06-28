<template>
  <CardItem>
    <template #icon>
      <UsersIcon class="w-5 h-5" />
    </template>
    <template #title>
      {{ $t('v1.view.main.dashboard.org.setting.member') }}
      ({{ size(pageStore.active_page_list) }}/{{
        size(pageStore.active_page_list)
      }})
    </template>
    <template #action>
      <button
        class="bg-blue-600 text-white py-1 px-4 rounded-md text-sm font-medium"
      >
        {{ $t('v1.common.more') }}
      </button>
    </template>
    <template #item>
      <div class="grid gap-6 grid-cols-4">
        <template v-for="page of pageStore.active_page_list">
          <ActorItem class="cursor-pointer">
            <template #avatar>
              <StaffAvatar
                :id="chatbotUserStore.chatbot_user?.fb_staff_id"
                class="w-8 h-8"
              />
            </template>
            <template #name>
              {{ chatbotUserStore.chatbot_user?.full_name }}
            </template>
            <template #after-name>
              <div
                v-tooltip="$t('v1.view.main.dashboard.org.setting.remove_staff')"
                class="group/minus hidden group-hover:flex"
              >
                <MinusOutlineIcon
                  class="w-4 h-4 text-slate-500 group-hover/minus:hidden"
                />
                <MinusIcon
                  class="w-4 h-4 text-slate-900 hidden group-hover/minus:block"
                />
              </div>
            </template>
            <template #description>
              <div class="text-xs text-slate-500 flex-grow truncate min-w-0">
                {{ $t('v1.view.main.dashboard.org.setting.add_history', { count: 3 }) }}
              </div>
            </template>
          </ActorItem>
        </template>
      </div>
    </template>
  </CardItem>
</template>
<script setup lang="ts">
import { usePageStore, useChatbotUserStore } from '@/stores'
import { size } from 'lodash'

import CardItem from '@/components/Main/Dashboard/CardItem.vue'
import StaffAvatar from '@/components/Avatar/StaffAvatar.vue'
import ActorItem from '@/components/Main/Dashboard/ActorItem.vue'

import MinusOutlineIcon from '@/components/Icons/MinusOutline.vue'
import MinusIcon from '@/components/Icons/Minus.vue'
import UsersIcon from '@/components/Icons/Users.vue'

const pageStore = usePageStore()
const chatbotUserStore = useChatbotUserStore()
</script>
