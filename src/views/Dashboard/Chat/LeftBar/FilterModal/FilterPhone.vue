<template>
    <Popover ref="filter_popover_ref" position="RIGHT" :is_fit="false" width="300px" height="auto">
        <div class="text-sm">
            <button v-tooltip="$t('v1.view.main.dashboard.chat.filter.un_filter')"
                v-if="!!conversationStore.option_filter_page_data.have_phone" @click="clearThisFilter"
                class="absolute top-[8px] right-[14px]">
                <img src="@/assets/icons/close-red.svg">
            </button>
            <div class="border-b font-semibold pb-1">
                {{ $t('v1.view.main.dashboard.chat.filter.phone.title') }}
            </div>
            <FilterRadio value="YES" v-model="conversationStore.option_filter_page_data.have_phone" :icon="includePhoneSvg"
                :title="$t('v1.view.main.dashboard.chat.filter.phone.include_phone')" />
            <FilterRadio value="NO" v-model="conversationStore.option_filter_page_data.have_phone" :icon="excludePhoneSvg"
                :title="$t('v1.view.main.dashboard.chat.filter.phone.exclude_phone')" />
        </div>
    </Popover>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import { useConversationStore } from '@/stores'

import Popover from '@/components/Popover.vue'
import FilterRadio from '@/views/Dashboard/Chat/LeftBar/FilterModal/FilterRadio.vue'

import includePhoneSvg from '@/assets/icons/include_phone.svg'
import excludePhoneSvg from '@/assets/icons/exclude_phone.svg'

import type { ComponentRef } from '@/service/interface/vue'

const conversationStore = useConversationStore()

/**ref của popover */
const filter_popover_ref = ref<ComponentRef>()

/**xoá lọc này */
function clearThisFilter() {
    delete conversationStore.option_filter_page_data.have_phone
}

defineExpose({ filter_popover_ref, clearThisFilter })
</script>