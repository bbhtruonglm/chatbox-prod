<template>
    <div v-if="is_loading" class="relative">
        <div class="absolute left-[50%] translate-x-[-50%]">
            <Loading class="mx-auto" />
        </div>
    </div>
    <VirtualList v-if="size(conversation_list)"
        class="h-[calc(100vh_-_142px)] md:h-[calc(100vh_-_109px)]  xl:h-[calc(100vh_-_93px)]  overflow-hidden overflow-y-auto  pb-[40px]"
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
import { onMounted, onUnmounted, ref, watch } from 'vue'
import { find, keys, map, mapValues, size } from 'lodash'
import { usePageStore } from '@/stores'
import { read_conversation } from '@/service/api/chatbox/n4-service'
import { flow } from '@/service/helper/async'
import { useConversationStore } from '@/stores'
import { toastError } from '@/service/helper/alert'
import { useRoute, useRouter } from 'vue-router'
import { selectConversation } from '@/service/function'

import Loading from '@/components/Loading.vue'
import ConversationItem from '@/views/Main/Dashboard/Chat/LeftBar/Conversation/ConversationItem.vue'

import type { CbError } from '@/service/interface/function'
import type {
    ConversationList, ConversationInfo
} from '@/service/interface/app/conversation'
import type { SocketEvent } from '@/service/interface/app/common'

/**dữ liệu từ socket */
interface CustomEvent extends Event {
    detail?: {
        /**dữ liệu của 1 hội thoại */
        conversation?: ConversationInfo
        /**tên sự kiện socket */
        event?: SocketEvent
    }
}

const $route = useRoute()
const $router = useRouter()
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

onMounted(() => window.addEventListener(
    'chatbox_socket_conversation',
    onRealtimeUpdateConversation
))
onUnmounted(() => window.removeEventListener(
    'chatbox_socket_conversation',
    onRealtimeUpdateConversation
))

/**xử lý socket conversation */
function onRealtimeUpdateConversation({ detail }: CustomEvent) {
    if (!detail) return

    let { conversation, event } = detail

    if (!conversation) return

    // bỏ qua record của page chat cho page
    if (conversation.fb_page_id === conversation.fb_client_id) return


    // tạo ra key cho vitual scroll
    conversation.data_key = `${conversation?.fb_page_id}_${conversation?.fb_client_id}`

    // nếu dữ liệu được socket chính là hội thoại đang chọn, thì làm mới dữ liệu được chọn
    if (
        conversationStore.select_conversation?.data_key === conversation.data_key
    ) conversationStore.select_conversation = conversation

    // nếu chỉ đồng bộ dữ liệu thì không đẩy hội thoại lên đầu
    if (event === 'SYNC_DATA') {
        conversation_list.value[conversation.data_key] = conversation
    }
    // nạp dữ liệu vào danh sách hội thoại lên đầu
    else {
        /**gói dữ liệu */
        const PAYLOAD: ConversationList = {}

        // nạp dữ liệu vào gói
        PAYLOAD[conversation.data_key] = conversation

        // xoá dữ liệu cũ
        delete conversation_list.value[conversation.data_key]

        // thêm dữ liệu mới lên đầu của obj
        conversation_list.value = {
            ...PAYLOAD,
            ...conversation_list.value
        }
    }
}
/**đọc danh sách hội thoại lần đầu tiên */
function loadConversationFirstTime() {
    // reset data
    conversation_list.value = {}

    // reset phân trang
    after.value = undefined

    getConversation(true)
}
/**đọc danh sách hội thoại */
function getConversation(is_first_time?: boolean) {
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
                    page_id: keys(pageStore.selected_page_id_list),
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
                // tạo ra key cho vitual scroll
                conversation.data_key = key

                // bỏ qua record của page chat cho page
                if (conversation.fb_page_id === conversation.fb_client_id)
                    delete DATA.current_conversation_list?.[key]
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

        // tự động chọn khách hàng cho lần đầu tiên
        if (is_first_time) selectDefaultConversation()

        if (e) return toastError(e)
    })
}
/**tự động chọn một khách hàng để hiển thị danh sách tin nhắn */
function selectDefaultConversation() {
    // nếu không có dữ liệu hội thoại thì bỏ qua
    if (!size(conversation_list.value)) return

    // lấy id hội thoại trên param
    let { page_id, client_id } = $route.query

    // tìm kiếm hội thoại thoả mãn param
    let target_conversation = find(conversation_list.value, (conversation, key) => {
        return `${page_id}_${client_id}` === key
    })

    // nếu không tìm thấy thì lấy hội thoại đầu tiên
    if (!target_conversation) {
        target_conversation = map(conversation_list.value)?.[0]

        // đẩy id lên param
        $router.replace({
            query: {
                page_id: target_conversation?.fb_page_id,
                client_id: target_conversation?.fb_client_id,
            }
        })
    }

    selectConversation(target_conversation)
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