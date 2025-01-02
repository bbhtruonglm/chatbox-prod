<template>
  <div
    v-if="is_loading"
    class="relative"
  >
    <div class="absolute left-1/2 -translate-x-1/2">
      <Loading class="mx-auto" />
    </div>
  </div>
  <RecycleScroller
    @scroll="($event: UIEvent) => $main.loadMoreConversation($event)"
    v-if="size(conversationStore.conversation_list)"
    class="overflow-y-auto"
    :items="map(conversationStore.conversation_list)"
    :item-size="78"
    key-field="data_key"
    v-slot="{ item }"
  >
    <ConversationItem :source="item" />
  </RecycleScroller>
  <div v-else>
    <img
      src="@/assets/icons/empty-page.svg"
      width="250"
      class="mx-auto mt-5"
    />
    <div class="text-center text-slate-400">
      {{ $t('v1.view.main.dashboard.chat.empty_conversation') }}
    </div>
  </div>
</template>
<script setup lang="ts">
import { RecycleScroller } from 'vue-virtual-scroller'
import 'vue-virtual-scroller/dist/vue-virtual-scroller.css'
import { onMounted, onUnmounted, ref, watch } from 'vue'
import { find, keys, map, mapValues, pick, set, size } from 'lodash'
import {
  read_conversation,
  reset_read_conversation,
} from '@/service/api/chatbox/n4-service'
import { flow } from '@/service/helper/async'
import {
  useConversationStore,
  useCommonStore,
  usePageStore,
  useChatbotUserStore,
} from '@/stores'
import { toastError } from '@/service/helper/alert'
import { useRoute, useRouter } from 'vue-router'
import { selectConversation, setParamChat } from '@/service/function'
import { waterfall } from 'async'

import Loading from '@/components/Loading.vue'
import ConversationItem from '@/views/ChatWarper/Chat/LeftBar/Conversation/ConversationItem.vue'

import type { CbError } from '@/service/interface/function'
import type {
  ConversationList,
  ConversationInfo,
  FilterConversation,
} from '@/service/interface/app/conversation'
import type { SocketEvent } from '@/service/interface/app/common'
import { differenceInHours } from 'date-fns'
import { loadingV2 } from '@/utils/decorator/Loading'
import { container } from 'tsyringe'
import { N4SerivceAppConversation } from '@/utils/api/N4Service/Conversation'
import { error } from '@/utils/decorator/Error'
import {
  CalcSpecialPageConfigs,
  type ICalcSpecialPageConfigs,
} from '@/utils/helper/Conversation/CalcSpecialPageConfigs'

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
const commonStore = useCommonStore()
const chatbotUserStore = useChatbotUserStore()

/**có đang load hội thoại hay không */
const is_loading = ref(false)
/**toàn bộ hội thoại đã được load hết chưa */
const is_done = ref(false)
/**phân trang kiểu after */
const after = ref<number[]>()
/**thời gian component được render */
const mounted_time = ref<Date>(new Date())

class Main {
  /**
   * @param API_CONVERSATION API của hội thoại
   * @param SERVICE_CALC_SPECIAL_PAGE_CONFIGS tính toán cấu hình trang đặc biệt
   */
  constructor(
    private readonly API_CONVERSATION = container.resolve(
      N4SerivceAppConversation
    ),
    private readonly SERVICE_CALC_SPECIAL_PAGE_CONFIGS: ICalcSpecialPageConfigs = container.resolve(
      CalcSpecialPageConfigs
    )
  ) {}

  /**
   * làm mới dữ liệu được chọn
   * - map từng field để hàm watch store ở những chỗ khác không nhận
   */
  private refreshConversation(conversation: ConversationInfo) {
    // nếu không có hội thoại nào được chọn thì thôi
    if (!conversationStore.select_conversation) return

    /*các giá trị cần update */
    const UPDATED_VALUE = pick(conversation, [
      'client_name',
      'client_bio',
      'client_phone',
      'user_id',
      'fb_staff_id',
      'label_id',
      'last_read_message',
      'staff_read',
    ])

    // thay đổi obj nhưng không cho trigger watch
    Object.assign(conversationStore.select_conversation, UPDATED_VALUE)
  }

  /**đọc danh sách hội thoại */
  @loadingV2(is_loading, 'value')
  @error()
  async getConversation(is_first_time?: boolean) {
    // nếu đang mất mạng thì không cho gọi api
    if (!commonStore.is_connected_internet) return

    /**danh sách id page */
    const PAGE_IDS = keys(pageStore.selected_page_id_list)
    /**cấu hình trang đặc biệt */
    const SPECIAL_PAGE_CONFIG = this.SERVICE_CALC_SPECIAL_PAGE_CONFIGS.exec()

    /**sort hội thoại */
    const SORT =
      SPECIAL_PAGE_CONFIG?.sort_conversation === 'UNREAD'
        ? 'unread_message_amount:desc,last_message_time:desc'
        : undefined

    /**ghi đè 1 số lọc tin nhắn */
    const OVERWRITE_FILTER: FilterConversation = {}

    // chỉ cho hiện hội thoại của nhân viên
    if (SPECIAL_PAGE_CONFIG.is_only_visible_client_of_staff) {
      // tạo ra filter nhân viên
      OVERWRITE_FILTER.staff_id = []

      // thêm id mới
      if (chatbotUserStore.chatbot_user?.user_id)
        OVERWRITE_FILTER.staff_id?.push(chatbotUserStore.chatbot_user?.user_id)

      // thêm id cũ, tránh lỗi
      if (chatbotUserStore.chatbot_user?.fb_staff_id)
        OVERWRITE_FILTER.staff_id?.push(
          chatbotUserStore.chatbot_user?.fb_staff_id
        )
    }

    /**lấy dữ liệu hội thoại */
    const RES = await this.API_CONVERSATION.readConversations(
      PAGE_IDS,
      {
        ...conversationStore.option_filter_page_data,
        ...OVERWRITE_FILTER,
      },
      40,
      SORT,
      after.value
    )

    /**dữ liệu hội thoại */
    const CONVERSATIONS = RES.conversation

    // gắn cờ nếu đã hết dữ liệu
    if (!size(CONVERSATIONS) || !RES.after) is_done.value = true

    // lưu lại after mới
    after.value = RES.after

    // format dữ liệu trả về
    mapValues(CONVERSATIONS, (conversation, key) => {
      // tạo ra key cho vitual scroll
      conversation.data_key = key

      // bỏ qua record của page chat cho page
      if (conversation.fb_page_id === conversation.fb_client_id)
        delete CONVERSATIONS?.[key]
    })

    // thêm vào danh sách conversation
    conversationStore.conversation_list = {
      ...conversationStore.conversation_list,
      ...CONVERSATIONS,
    }

    // tự động chọn khách hàng cho lần đầu tiên
    if (is_first_time) $main.selectDefaultConversation()
  }
  /**xử lý socket conversation */
  onRealtimeUpdateConversation({ detail }: CustomEvent) {
    // nếu không có dữ liệu thì thôi
    if (!detail) return

    /**cấu hình trang đặc biệt */
    const SPECIAL_PAGE_CONFIG = this.SERVICE_CALC_SPECIAL_PAGE_CONFIGS.exec()
    // nạp dữ liệu
    let { conversation, event } = detail
    /**danh sách hội thoại */
    let conversation_list = conversationStore.conversation_list

    // nếu không có dữ liệu hội thoại thì thôi
    if (!conversation) return
    // lọc các hội thoại không phải của nv này nếu cần
    if (
      SPECIAL_PAGE_CONFIG?.is_only_visible_client_of_staff &&
      !(
        conversation?.user_id === chatbotUserStore.chatbot_user?.user_id ||
        conversation?.fb_staff_id === chatbotUserStore.chatbot_user?.fb_staff_id
      )
    )
      return
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
      // làm mới dữ liệu được chọn
      this.refreshConversation(conversation)

      // làm mới thời gian nhân viên hiện tại đọc tin nhắn
      this.hardRenewCurrentStaffRead()
    }

    // không đẩy hội thoại lên đầu nếu
    if (
      // nếu thời gian giống nhau, thì cũng không thay đổi vị trí
      conversation?.last_message_time ===
        conversation_list[conversation.data_key]?.last_message_time ||
      // nếu chỉ đồng bộ dữ liệu thì không đẩy hội thoại lên đầu
      event === 'SYNC_DATA' ||
      // nếu sort chưa đọc lên đầu và là tin của page
      (SPECIAL_PAGE_CONFIG?.sort_conversation === 'UNREAD' &&
        conversation?.last_message_type === 'page')
    )
      conversation_list[conversation.data_key] = conversation
    // nạp dữ liệu vào danh sách hội thoại lên đầu
    else {
      // xoá dữ liệu cũ
      delete conversation_list[conversation.data_key]

      // thêm dữ liệu mới lên đầu của obj
      conversation_list = {
        [conversation.data_key]: conversation,
        ...conversation_list,
      }

      // nạp lại store
      conversationStore.conversation_list = conversation_list
    }
  }
  /**
   * - hàm này dùng để ghi đè thời gian nhân viên hiện tại đọc tin nhắn mới này
   * thành hiện tại
   * - để tránh lỗi user hiện tại nhắn thêm tin, nhưng avatar user đọc tin nhắn
   * vẫn ở các tin trước đó (do giá trị read chỉ được update khi click vào hội
   * thoại, nó chưa được làm mới, socket vẫn trả về giá trị cũ) -> cần set lại
   * thủ công
   * => muốn chuẩn hơn, cần fix ở backend, khi user gửi tin nhắn thành công, thì
   * update staff_read của user đó, trước khi socket
   */
  hardRenewCurrentStaffRead() {
    // nếu chưa chọn hội thoại nào thì thôi
    if (!conversationStore.select_conversation) return

    // nếu không có id nhân viên hiện tại thì thôi
    if (!chatbotUserStore.chatbot_user?.fb_staff_id) return

    // nạp thời gian đọc tin nhắn mới
    set(
      conversationStore.select_conversation,
      ['staff_read', chatbotUserStore.chatbot_user?.fb_staff_id],
      new Date().getTime()
    )
  }
  /**đọc danh sách hội thoại lần đầu tiên */
  loadConversationFirstTime(is_first_time?: boolean) {
    // reset data
    conversationStore.conversation_list = {}

    // reset phân trang
    after.value = undefined

    // reset trạng thái load
    is_done.value = false

    this.getConversation(is_first_time)
  }
  /**tự động chọn một khách hàng để hiển thị danh sách tin nhắn */
  selectDefaultConversation() {
    // nếu ở chế độ lọc chưa đọc thì thôi
    if (conversationStore.option_filter_page_data?.unread_message) return

    // tự động focus vào input chat
    // đơi nửa giây cho div được render
    setTimeout(() => {
      document.getElementById('chat-text-input-message')?.focus()
    }, 500)

    // lấy id hội thoại trên param
    let page_id = ($route.query?.p || $route.query?.page_id) as string
    let user_id = $route.query?.u || $route.query?.user_id

    // nếu id page của hội thoại không được chọn thì thôi
    if (page_id && !pageStore.selected_page_id_list?.[page_id]) return

    // key của hội thoại
    let data_key = `${page_id}_${user_id}`

    // tìm kiếm hội thoại thoả mãn param
    let target_conversation = find(
      conversationStore.conversation_list,
      (conversation, key) => {
        return data_key === key
      }
    )

    /**dữ liệu hội thoại tìm được */
    let conversation: ConversationInfo | undefined
    waterfall(
      [
        // * verify input
        (cb: CbError) => {
          // nếu không có id khách hàng thì thôi
          if (!page_id || !user_id) return cb(true)

          // nếu đã tìm thấy khách hàng rồi thì thôi
          if (target_conversation) return cb(true)

          cb()
        },
        // * tìm đến hội thoại
        (cb: CbError) =>
          read_conversation(
            {
              page_id: [page_id as string],
              client_id: user_id as string,
              limit: 1,
            },
            (e, r) => {
              if (e) return cb(e)

              conversation = r?.conversation?.[data_key]
              cb()
            }
          ),
        // * thêm hội thoại vào danh sách và pick chọn
        (cb: CbError) => {
          if (!conversation) return cb(true)

          // chọn khách hàng đã tìm được
          target_conversation = {
            ...conversation,
            data_key,
          }

          // thêm khách hàng vào list khách hàng
          let temp: ConversationList = {}
          temp[data_key] = target_conversation

          conversationStore.conversation_list = {
            ...conversationStore.conversation_list,
            ...temp,
          }

          cb()
        },
      ],
      e => {
        // nếu không tìm thấy thì lấy hội thoại đầu tiên
        if (!target_conversation) {
          target_conversation = map(conversationStore.conversation_list)?.[0]

          // đẩy id lên param
          setParamChat(
            $router,
            target_conversation?.fb_page_id,
            target_conversation?.fb_client_id
          )
        }

        selectConversation(target_conversation)
      }
    )
  }
  /**load thêm hội thoại khi lăn chuột xuống cuối */
  loadMoreConversation($event: UIEvent) {
    /**sẽ scroll khi đã đi được số phần trăm trên độ dài  */
    const PERCENT_SCROLL = 90

    /**div đang scroll */
    const TARGET: HTMLDivElement = $event.target as HTMLDivElement

    /**khoảng cách scroll với bottom */
    let padBehind =
      TARGET?.scrollHeight - TARGET?.scrollTop - TARGET?.clientHeight

    if (
      !padBehind ||
      padBehind > TARGET?.scrollHeight * (1 - PERCENT_SCROLL / 100) || // khi đạt mốc 70% scroll thì load thêm dữ liệu
      is_loading.value || // chỉ load thêm khi không có tiến trình khác đang load
      is_done.value // nếu đã hết dữ liệu thì không load nữa
    )
      return

    this.getConversation()
  }
  /**
   * tự động reload lại trang nếu người dùng focus lại tab sau một khoảng thời
   * gian lớn (VD: 3 tiếng)
   */
  autoRefreshPage() {
    // nếu thời gian focus vào tab dưới 3 tiếng thì thôi
    if (differenceInHours(new Date(), mounted_time.value) < 3) return

    // reload lại trang
    location.reload()
  }
}
const $main = new Main()

// khi component được render
onMounted(() => {
  // lắng nghe sự kiện socket
  window.addEventListener(
    'chatbox_socket_conversation',
    $main.onRealtimeUpdateConversation.bind($main)
  )

  // lưu thời gian render hiện tại
  mounted_time.value = new Date()

  // lắng nghe sự kiện focus vào tab
  window.addEventListener('focus', $main.autoRefreshPage.bind($main))
})
// khi component bị xoá
onUnmounted(() => {
  // khi thoát khỏi component này thì xoá dữ liệu hội thoại hiện tại
  conversationStore.conversation_list = {}

  // xoá sự kiện socket
  window.removeEventListener(
    'chatbox_socket_conversation',
    $main.onRealtimeUpdateConversation.bind($main)
  )

  // xoá sự kiện focus vào tab
  window.removeEventListener('focus', $main.autoRefreshPage.bind($main))
})

// khi thay đổi giá trị lọc tin nhắn thì load lại dữ liệu
watch(
  () => conversationStore.option_filter_page_data,
  () => $main.loadConversationFirstTime(),
  { deep: true }
)
// khi có data page được chọn thì tính toán danh sách conversation
watch(
  () => pageStore.selected_page_list_info,
  () => $main.loadConversationFirstTime(true)
)
// khi thay đổi hội thoại, nếu hội thoại trước đó còn tin nhắn chưa đọc thì reset
watch(
  () => conversationStore.select_conversation,
  (new_val, old_val) => {
    // nếu cùng một hội thoại thì thôi
    if (new_val?.data_key === old_val?.data_key) return

    // nếu không có hội thoại trước đó thì thôi
    if (!old_val?.data_key) return

    // nếu người dùng cố tình đánh dấu tin nhắn chưa đọc thì thôi
    if (old_val?.is_force_unread) return

    // nếu tin nhắn của hội thoại trước đó đã đọc thì thôi
    if (
      !conversationStore.conversation_list[old_val.data_key]
        ?.unread_message_amount
    )
      return

    // reset tin nhắn chưa đọc trên biến
    if (conversationStore.conversation_list[old_val.data_key])
      conversationStore.conversation_list[
        old_val.data_key
      ].unread_message_amount = 0

    // gọi api xoá trên backend
    reset_read_conversation(
      {
        page_id: old_val?.fb_page_id,
        client_id: old_val?.fb_client_id,
      },
      (e, r) => {
        if (e) return toastError(e)
      }
    )
  }
)

defineExpose({ loadConversationFirstTime: $main.loadConversationFirstTime })
</script>
