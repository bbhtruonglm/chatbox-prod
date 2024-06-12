<template>
    <Popover ref="filter_popover_ref" position="RIGHT" :is_fit="false" width="300px" height="auto">
        <div class="text-sm">
            <button v-tooltip="$t('v1.view.main.dashboard.chat.filter.un_filter')"
                v-if="isActiveMessageFilter()" @click="clearThisFilter"
                class="absolute top-[8px] right-[14px]">
                <img src="@/assets/icons/close-red.svg">
            </button>
            <div class="border-b font-semibold pb-1">
                {{ $t('v1.view.main.dashboard.chat.filter.message.title') }}
            </div>
            <FilterCheckbox value="true" v-model="conversationStore.option_filter_page_data.unread_message"
                :icon="filterMessageSvg" :title="$t('v1.view.main.dashboard.chat.filter.message.unread')" />
            <FilterCheckbox value="true" v-model="conversationStore.option_filter_page_data.not_response_client"
                :icon="notReplySvg" :title="$t('v1.view.main.dashboard.chat.filter.message.not_reply')" />
            <FilterCheckbox value="true" v-model="conversationStore.option_filter_page_data.not_exist_label" :icon="notTagSvg"
                :title="$t('v1.view.main.dashboard.chat.filter.message.not_tag')" />
            <FilterCheckbox value="YES" v-model="is_spam_fb" :icon="SpamSvg"
                :title="$t('v1.view.main.dashboard.chat.filter.message.spam')" />
        </div>
    </Popover>
</template>
<script setup lang="ts">
import { computed, ref } from 'vue'
import { useConversationStore } from '@/stores'

import Popover from '@/components/Popover.vue'
import FilterCheckbox from '@/views/ChatWarper/Chat/LeftBar/FilterModal/FilterCheckbox.vue'

import filterMessageSvg from '@/assets/icons/filter_message.svg'
import notReplySvg from '@/assets/icons/not_reply.svg'
import notTagSvg from '@/assets/icons/filter_not_tag.svg'
import SpamSvg from '@/assets/icons/spam.svg'

import type { ComponentRef } from '@/service/interface/vue'
import { isActiveMessageFilter } from '@/service/function'

const conversationStore = useConversationStore()

/**ref của popover */
const filter_popover_ref = ref<ComponentRef>()

/**biến tạm của spam */
const is_spam_fb = computed({
    // lấy dữ liệu từ store
    get() {
        return conversationStore.option_filter_page_data.is_spam_fb
    },
    // khi có thay đổi thì set lại data cho store
    set(val) {
        if (!val)
            conversationStore.option_filter_page_data.is_spam_fb = 'NO'
        else
            conversationStore.option_filter_page_data.is_spam_fb = 'YES'
    }
})

/**loại bỏ lọc */
function clearThisFilter() {
    delete conversationStore.option_filter_page_data.unread_message
    delete conversationStore.option_filter_page_data.not_response_client
    delete conversationStore.option_filter_page_data.not_exist_label
    conversationStore.option_filter_page_data.is_spam_fb = 'NO'
}

defineExpose({ filter_popover_ref, clearThisFilter })
</script>