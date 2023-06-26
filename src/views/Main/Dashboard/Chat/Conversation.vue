<template>
    <div v-if="is_loading" class="relative">
        <div class="absolute left-[50%] translate-x-[-50%]">
            <Loading class="mx-auto" />
        </div>
    </div>
    <VirtualList v-if="size(conversation_list)"
        class="conversation h-[calc(100vh_-_142px)] md:h-[calc(100vh_-_109px)]  xl:h-[calc(100vh_-_93px)]  overflow-hidden overflow-y-auto  pb-[40px]"
        item-class="cursor-pointer hover:bg-slate-100 h-[69px]" :data-key="'data_key'"
        :data-sources="map(conversation_list)" :data-component="ConversationItem" v-on:scroll="loadMoreConversation" />
    <div v-else>
        <img src="@/assets/icons/empty-page.svg" width="250" class="mx-auto mt-5">
        <div class="text-center text-slate-400">
            {{ $t('v1.view.main.dashboard.chat.empty_conversation') }}
        </div>
    </div>
</template>
<script setup lang="ts">
import VirtualList from 'vue3-virtual-scroll-list'
import { ref, watch } from 'vue'
import { keys, map, mapValues, size } from 'lodash'
import { usePageStore } from '@/stores'
import { read_conversation } from '@/service/api/chatbox/n4-service'
import { flow } from '@/service/helper/async'
import { useConversationStore } from '@/stores'

import Loading from '@/components/Loading.vue'
import ConversationItem from '@/views/Main/Dashboard/Chat/Conversation/ConversationItem.vue'

import type { CbError } from '@/service/interface/function'
import type { ConversationList } from '@/service/interface/app/conversation'
import { toastError } from '@/service/helper/alert'

const pageStore = usePageStore()
const conversationStore = useConversationStore()

/**danh sách hội thoại */
const conversation_list = ref<ConversationList>({})
/**có đang load hội thoại hay không */
const is_loading = ref(false)
/**toàn bộ hội thoại đã được load hết chưa */
const is_done = ref(false)
/**phân trang kiểu after */
const after = ref<number[]>()

// khi thay đổi giá trị lọc tin nhắn thì load lại dữ liệu
watch(
    () => conversationStore.option_filter_page_data,
    () => loadConversationFirstTime(),
    { deep: true }
)
// khi có data page được chọn thì tính toán danh sách conversation
watch(
    () => pageStore.selected_page_list_info,
    () => loadConversationFirstTime()
)

/**
 * TODO socket conversation
 * - socket khi đang được lọc thì sao?
 */

/**đọc danh sách hội thoại lần đầu tiên */
function loadConversationFirstTime() {
    // reset data
    conversation_list.value = {}

    // reset phân trang
    after.value = undefined

    getConversation()
}
/**đọc danh sách hội thoại */
function getConversation() {
    const DATA: {
        current_conversation_list?: ConversationList
    } = {}
    flow([
        // * bật loading
        (cb: CbError) => {
            is_loading.value = true

            cb()
        },
        // * đọc dữ liệu từ api
        (cb: CbError) => read_conversation(
            {
                ...{
                    page_id: keys(pageStore.selected_page_id_list).join(' '),
                    limit: 40,
                    after: after.value,
                },
                ...conversationStore.option_filter_page_data
            },
            (e, r) => {
                if (e) return cb(e)

                if (!size(r?.conversation) || !r?.after) is_done.value = true

                DATA.current_conversation_list = r?.conversation
                after.value = r?.after

                cb()
            }
        ),
        // * format lại response của api
        (cb: CbError) => {
            mapValues(DATA.current_conversation_list, (conversation, key) => {
                conversation.data_key = key
            })

            cb()
        },
        // * thêm vào danh sách conversation
        (cb: CbError) => {
            conversation_list.value = {
                ...conversation_list.value,
                ...DATA.current_conversation_list
            }

            cb()
        },
    ], e => {
        // tắt loading
        is_loading.value = false

        if (e) return toastError(e)
    })
}
/**load thêm hội thoại khi lăn chuột xuống cuối */
function loadMoreConversation($event: Event, range?: { padBehind?: number }) {
    if (
        !range ||
        range?.padBehind as number > 1000 || // chỉ load thêm khi lăn chuột xuống gần cuối
        is_loading.value || // chỉ load thêm khi không có tiến trình khác đang load
        is_done.value // nếu đã hết dữ liệu thì không load nữa
    ) return

    getConversation()
}
</script>
<style scoped lang="scss">
.conversation {
    &::-webkit-scrollbar {
        width: 0px;
    }
}
</style>