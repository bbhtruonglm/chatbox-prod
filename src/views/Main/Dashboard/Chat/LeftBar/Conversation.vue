<template>
    <div v-if="is_loading" class="relative">
        <div class="absolute left-[50%] translate-x-[-50%]">
            <Loading class="mx-auto" />
        </div>
    </div>
    <RecycleScroller @scroll="loadMoreConversation" v-if="size(conversationStore.conversation_list)"
        class="scrollbar-vertical h-[calc(100vh_-_142px)] md:h-[calc(100vh_-_109px)] xl:h-[calc(100vh_-_93px)] overflow-hidden overflow-y-auto pb-[40px]"
        :items="map(conversationStore.conversation_list)" :item-size="80" key-field="data_key" v-slot="{ item }">
        <ConversationItem :source="item" />
    </RecycleScroller>
    <div v-else>
        <img src="@/assets/icons/empty-page.svg" width="250" class="mx-auto mt-5">
        <div class="text-center text-slate-400">
            {{ $t('v1.view.main.dashboard.chat.empty_conversation') }}
        </div>
    </div>
</template>
<script setup lang="ts">
import { RecycleScroller } from 'vue-virtual-scroller'
import 'vue-virtual-scroller/dist/vue-virtual-scroller.css'
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
onUnmounted(() => {
    // khi thoát khỏi component này thì xoá dữ liệu hội thoại hiện tại
    conversationStore.conversation_list = {}

    window.removeEventListener(
        'chatbox_socket_conversation',
        onRealtimeUpdateConversation
    )
})

/**xử lý socket conversation */
function onRealtimeUpdateConversation({ detail }: CustomEvent) {
    if (!detail) return

    let { conversation, event } = detail

    if (!conversation) return

    // bỏ qua record của page chat cho page
    if (conversation.fb_page_id === conversation.fb_client_id) return


    // tạo ra key cho vitual scroll
    conversation.data_key = `${conversation?.fb_page_id}_${conversation?.fb_client_id}`

    /**
     * nếu dữ liệu được socket chính là hội thoại đang chọn, thì làm mới dữ liệu 
     * được chọn
     * map từng field để hàm watch store ở những chỗ khác không nhận
     */
    if (
        conversationStore.select_conversation?.data_key === conversation.data_key
    ) {
        conversationStore.select_conversation.client_name = conversation.client_name
        conversationStore.select_conversation.client_bio = conversation.client_bio
        conversationStore.select_conversation.client_phone = conversation.client_phone
        conversationStore.select_conversation.fb_staff_id = conversation.fb_staff_id
        conversationStore.select_conversation.label_id = conversation.label_id
        conversationStore.select_conversation.last_read_message = conversation.last_read_message
        conversationStore.select_conversation.staff_read = conversation.staff_read
    }

    // nếu chỉ đồng bộ dữ liệu thì không đẩy hội thoại lên đầu
    if (event === 'SYNC_DATA') {
        conversationStore.conversation_list[conversation.data_key] = conversation
    }
    // nạp dữ liệu vào danh sách hội thoại lên đầu
    else {
        /**gói dữ liệu */
        const PAYLOAD: ConversationList = {}

        // nạp dữ liệu vào gói
        PAYLOAD[conversation.data_key] = conversation

        // xoá dữ liệu cũ
        delete conversationStore.conversation_list[conversation.data_key]

        // thêm dữ liệu mới lên đầu của obj
        conversationStore.conversation_list = {
            ...PAYLOAD,
            ...conversationStore.conversation_list
        }
    }
}
/**đọc danh sách hội thoại lần đầu tiên */
function loadConversationFirstTime() {
    // reset data
    conversationStore.conversation_list = {}

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
            conversationStore.conversation_list = {
                ...conversationStore.conversation_list,
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
    if (!size(conversationStore.conversation_list)) return

    // lấy id hội thoại trên param
    let { page_id, user_id } = $route.query

    // tìm kiếm hội thoại thoả mãn param
    let target_conversation = find(conversationStore.conversation_list, (conversation, key) => {
        return `${page_id}_${user_id}` === key
    })

    // nếu không tìm thấy thì lấy hội thoại đầu tiên
    if (!target_conversation) {
        target_conversation = map(conversationStore.conversation_list)?.[0]

        // đẩy id lên param
        $router.replace({
            query: {
                page_id: target_conversation?.fb_page_id,
                user_id: target_conversation?.fb_client_id,
            }
        })
    }

    selectConversation(target_conversation)

    // tự động focus vào input chat
    // đơi nửa giây cho div được render
    setTimeout(() => {
        document.getElementById('chat-text-input-message')?.focus()
    }, 500)
}
/**load thêm hội thoại khi lăn chuột xuống cuối */
function loadMoreConversation($event: UIEvent) {
    /**sẽ scroll khi đã đi được số phần trăm trên độ dài  */
    const PERCENT_SCROLL = 90

    /**div đang scroll */
    const TARGET: HTMLDivElement = $event.target as HTMLDivElement

    /**khoảng cách scroll với bottom */
    let padBehind = TARGET?.scrollHeight - TARGET?.scrollTop - TARGET?.clientHeight

    if (
        !padBehind ||
        padBehind > TARGET?.scrollHeight * (1 - PERCENT_SCROLL / 100) || // khi đạt mốc 70% scroll thì load thêm dữ liệu
        is_loading.value || // chỉ load thêm khi không có tiến trình khác đang load
        is_done.value // nếu đã hết dữ liệu thì không load nữa
    ) return

    getConversation()
}
</script>