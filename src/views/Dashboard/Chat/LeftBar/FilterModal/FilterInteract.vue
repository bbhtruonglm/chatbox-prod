<template>
    <Popover ref="filter_popover_ref" position="RIGHT" :is_fit="false" width="300px" height="auto" >
        <div class="text-sm">
            <button v-tooltip="$t('v1.view.main.dashboard.chat.filter.un_filter')"
                v-if="!!conversationStore.option_filter_page_data.display_style" @click="clearThisFilter"
                class="absolute top-[8px] right-[14px]">
                <img src="@/assets/icons/close-red.svg">
            </button>
            <div class="border-b font-semibold pb-1">
                {{ $t('v1.view.main.dashboard.chat.filter.interact.title') }}
            </div>
            <FilterRadio v-model="conversationStore.option_filter_page_data.display_style" value="INBOX"
                :icon="filterMessageSvg" :title="$t('v1.view.main.dashboard.chat.filter.interact.message')" />
            <FilterRadio v-model="conversationStore.option_filter_page_data.display_style" value="COMMENT"
                :icon="filterCommentSvg" :title="$t('v1.view.main.dashboard.chat.filter.interact.comment')" />
        </div>
    </Popover>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import { useConversationStore } from '@/stores'

import Popover from '@/components/Popover.vue'
import FilterRadio from '@/views/Dashboard/Chat/LeftBar/FilterModal/FilterRadio.vue'

import filterMessageSvg from '@/assets/icons/filter_message.svg'
import filterCommentSvg from '@/assets/icons/filter_comment.svg'

import type { ComponentRef } from '@/service/interface/vue'

const conversationStore = useConversationStore()

/**ref của popover */
const filter_popover_ref = ref<ComponentRef>()

/**xoá lọc */
function clearThisFilter() {
    delete conversationStore.option_filter_page_data.display_style
}

defineExpose({ filter_popover_ref, clearThisFilter })
</script>