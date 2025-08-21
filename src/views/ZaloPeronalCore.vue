<template>
  <div
    class="bg-gray-100 rounded-xl p-2 flex flex-col relative w-full h-full overflow-hidden gap-2 text-sm"
    @dragover.prevent
    @drop="onDropFile"
  >
    <div
      class="bg-white py-2 px-3 rounded-lg gap-2 flex items-center text-slate-700"
    >
      {{ $t('Chọn Zalo cá nhân:') }}
      <button
        class="flex items-center gap-2 flex-grow"
        @click="zalo_personal_dropdown_ref?.toggleDropdown"
      >
        <div class="flex flex-grow items-center gap-1">
          <PageAvatar
            v-if="selected_page_id"
            :page_info="selected_page_info"
            class="rounded-full size-5"
          />
          <p class="text-slate-700">{{ selected_page_info?.name }}</p>
        </div>
        <ChevronDownIcon class="size-5" />
      </button>
    </div>

    <template v-if="true">
      <section>
        <div class="w-full relative border-b pb-2">
          <MagnifyingGlassIcon
            class="size-5 text-slate-500 absolute top-0 bottom-0 m-auto left-2"
          />
          <input
            v-model="query_string_data.phone"
            type="text"
            :placeholder="$t('Nhập số điện thoại muốn tìm kiếm')"
            class="placeholder:text-slate-500 pl-9 py-2 pr-4 outline-none rounded-lg w-full"
          />
        </div>
      </section>

      <section>
        <!-- <div class="flex flex-col items-center pt-8 gap-2.5">
          <SearchContactIcon class="size-20" />
          <p class="text-slate-700">
            {{ $t('Nhập số điện thoại để thêm khách hàng') }}
          </p>
        </div> -->
        <!-- <div class="p-3">
          <div
            class="border border-blue-200 rounded-lg flex gap-2 items-center p-2"
          >
            <div class="bg-blue-100 rounded-xl size-8"></div>
            <div class="flex flex-col gap-1">
              <div class="bg-blue-100 rounded-full h-4 w-44"></div>
              <div class="bg-blue-100 rounded-full h-3 w-28"></div>
            </div>
          </div>
        </div> -->
        <ul>
          <li class="bg-white rounded-lg flex gap-2 items-center py-3 px-4">
            <PageAvatar
              v-if="selected_page_id"
              :page_info="selected_page_info"
              class="rounded-oval size-8"
            />
            <div class="flex flex-col flex-1">
              <div class="font-medium">Nguyễn Văn A</div>
              <div class="text-slate-500 text-xs">***8212</div>
            </div>
            <div class="flex gap-2 font-medium">
              <button class="py-2 px-4 rounded-md bg-slate-200">
                Gửi tin nhắn
              </button>
              <button class="py-2 px-4 rounded-md bg-blue-200 text-blue-700">
                Kết bạn
              </button>
            </div>
          </li>
        </ul>
      </section>
    </template>
    <template v-else>
    <section class="py-3 px-4 flex gap-2 bg-white rounded-xl items-center">
      <PageAvatar
        v-if="selected_page_id"
        :page_info="selected_page_info"
        class="rounded-oval size-8 flex-shrink-0"
      />
      <div class="flex flex-col w-full">
        <div class="flex gap-2 font-medium justify-between">
          <p class="flex items-center gap-2">
            Nguyễn Văn B
            <PencilSquareIcon class="size-4 cursor-pointer text-slate-500" />
          </p>
          <button class="py-1 px-4 rounded-md bg-blue-200 text-blue-700">
            Kết bạn
          </button>
        </div>
        <div class="flex gap-5 text-slate-500 text-xs">
          <p class="flex gap-1"><PhoneIcon class="size-4 flex-shrink-0" /> ***8212</p>
          <p class="flex gap-1"><GenderIcon class="size-4 flex-shrink-0" /> Nam</p>
          <p class="flex gap-1"><CakeIcon class="size-4 flex-shrink-0" /> 12/09/1990</p>
        </div>
      </div>
    </section>

    <!-- Hội thoại -->
    <div class="h-full w-full overflow-hidden">
      <MessageList
        v-if="conversationStore.select_conversation"
        class="h-full"
      />
      <div
        v-else
        class="flex flex-col gap-2.5 items-center justify-center h-full"
      >
        <img
          src="@/assets/imgs/empty-conversation.png"
          class="w-24 h-24"
        />
        <p>{{ $t('Không có lịch sử hội thoại') }}</p>
      </div>
    </div>

    <!-- <div
      class="py-2 px-3 gap-2 rounded-md bg-blue-100 border border-blue-200 text-xs flex items-center"
      v-if="is_show_send_friend_request"
    >
      <div class="text-blue-700 flex-grow flex flex-col gap-1 min-w-0 w-full">
        <p class="font-semibold">
          {{ $t('Gửi lời mời kết bạn') }}
        </p>
      </div>
      <button
        @click="$main.sendFriendRequest()"
        class="flex-shrink-0 font-medium py-2 px-4 rounded-md bg-blue-700 text-white"
      >
        {{ $t('Kết bạn') }}
      </button>
      <XMarkIcon
        class="size-6 cursor-pointer flex-shrink-0"
        @click="is_show_send_friend_request = false"
      />
    </div> -->

    <!-- ô nhập chat -->
    <InputChat :client_id="client_id" />
    </template>

    <!-- danh sách zalo personal -->
    <Dropdown
      ref="zalo_personal_dropdown_ref"
      width="250px"
      height="auto"
      :is_fit="false"
      :distance="0"
      class_content="flex flex-col gap-2 text-sm p-3"
      @close_dropdown="search_zalo_personal = ''"
    >
      <input
        type="text"
        class="outline-none border border-slate-500 rounded-md py-1.5 px-2"
        :placeholder="$t('Tìm kiếm Zalo cá nhân')"
        v-model="search_zalo_personal"
      />
      <ul class="flex flex-col gap-2 max-h-[50dvh] overflow-auto">
        <li
          v-for="zlp_os of zlp_oss"
          class="cursor-pointer flex items-center gap-2 p-2 hover:bg-slate-100 rounded"
          v-show="$main.isShowZaloPersonal(zlp_os?.page_info)"
          @click="$main.selectPage(zlp_os)"
        >
          <PageAvatar
            :page_info="zlp_os?.page_info"
            class="rounded-full size-5"
          />
          {{ zlp_os?.page_info?.name }}
        </li>
      </ul>
    </Dropdown>
  </div>
</template>
<script setup lang="ts">
import { read_os } from '@/service/api/chatbox/billing'
import { read_conversation } from '@/service/api/chatbox/n4-service'
import { nonAccentVn } from '@/service/helper/format'
import {
  useChatbotUserStore,
  useCommonStore,
  useConversationStore,
  useMessageStore,
  useOrgStore,
  usePageStore,
} from '@/stores'
import { N4SerivceAppPage } from '@/utils/api/N4Service/Page'
import { N4SerivceAppZaloPersonal } from '@/utils/api/N4Service/ZaloPersonal'
import { error } from '@/utils/decorator/Error'
import { loadingV2 } from '@/utils/decorator/Loading'
import { Toast } from '@/utils/helper/Alert/Toast'
import { LocalStorage } from '@/utils/helper/LocalStorage'
import { QueryString } from '@/utils/helper/QueryString'
import { Socket } from '@/utils/helper/Socket'
import { useDropFile } from '@/views/composable'
import { pick, size } from 'lodash'
import { container } from 'tsyringe'
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'

import PageAvatar from '@/components/Avatar/PageAvatar.vue'
import Dropdown from '@/components/Dropdown.vue'
import InputChat from '@/views/ChatWarper/Chat/CenterContent/InputChat.vue'
import MessageList from '@/views/ChatWarper/Chat/CenterContent/MessageList.vue'

import {
  ChevronDownIcon,
  MagnifyingGlassIcon,
  XMarkIcon,
} from '@heroicons/vue/24/outline'

import type { OwnerShipInfo } from '@/service/interface/app/billing'
import type { SocketEvent } from '@/service/interface/app/common'
import type { ConversationInfo } from '@/service/interface/app/conversation'
import type { MessageInfo } from '@/service/interface/app/message'
import type { IPage } from '@/service/interface/app/page'
import type { FacebookCommentPost } from '@/service/interface/app/post'
import type { StaffSocket } from '@/service/interface/app/staff'
import type { IAlert } from '@/utils/helper/Alert/type'
import SearchContactIcon from '@/components/Icons/SearchContactIcon.vue'
import SkeletonLoading from '@/views/ChatWarper/Chat/LeftBar/Conversation/SkeletonLoading.vue'
import { CakeIcon, PencilSquareIcon, PhoneIcon } from '@heroicons/vue/24/solid'
import GenderIcon from '@/components/Icons/GenderIcon.vue'

const pageStore = usePageStore()
const commonStore = useCommonStore()
const messageStore = useMessageStore()
const conversationStore = useConversationStore()
const chatbotUserStore = useChatbotUserStore()
const $toast = container.resolve(Toast)
const { t: $t } = useI18n()

// composable
const { onDropFile } = useDropFile()

const orgStore = useOrgStore()

/** đối tượng thao tác với query string */
const $query_string = container.resolve(QueryString)

/** dữ liệu trong local storage */
const $local_storage = container.resolve(LocalStorage)

/** socket chatbot */
const $socket = container.resolve(Socket)

/** dữ liệu query string */
const query_string_data = ref({
  org_id: '',
  actual_client_id: '',
  actual_page_id: '',
  message_id: '',
  phone: '',
})

/** id của khách hàng ở page zalo được chọn */
const client_id = ref('')

/** ẩn hiện nút gửi lời mời kết bạn */
const is_show_send_friend_request = ref(true)

/**id trang được chọn */
const selected_page_id = ref<string>()

/**dữ liệu của trang được chọn */
const selected_page_info = computed(
  () =>
    zlp_oss.value?.find(zlp_os => zlp_os?.page_id === selected_page_id.value)
      ?.page_info
)

/** danh sách các trang zalo của tổ chức hiện tại */
const zlp_oss = ref<OwnerShipInfo[]>()

/** tham chiếu tới dropdown danh sách zalo cá nhân của tổ chức */
const zalo_personal_dropdown_ref = ref<InstanceType<typeof Dropdown>>()

/** từ khóa tìm kiếm zalo cá nhân */
const search_zalo_personal = ref('')

class CustomToast extends Toast implements IAlert {
  public error(message: any): void {
    return super.error($t('Số điện thoại không chính xác'))
  }
}

class NoneToast extends Toast implements IAlert {
  public error(message: any): void {
    // chỉ log ra chứ không hiển thị lên màn hình
    console.log($t('Số điện thoại không chính xác'))
    return
  }
}

/** thông báo dạng toast */
const $custom_toast = container.resolve(CustomToast)

class Main {
  /**
   * @param API gọi API
   */
  constructor(
    private readonly API = container.resolve(N4SerivceAppZaloPersonal)
  ) {}

  /**gửi lời mời kết bạn */
  @loadingV2(commonStore, 'is_loading_full_screen')
  @error($custom_toast)
  async sendFriendRequest() {
    // trang bị mất kết nối không
    if (this.isDiconnect()) return

    // nếu chưa chọn id trang thì dừng
    if (
      !selected_page_id.value ||
      !query_string_data.value.actual_page_id ||
      !query_string_data.value.actual_client_id
    )
      return

    // gửi kết bạn
    const RES = await this.API.sendFriendRequest(
      selected_page_id.value,
      query_string_data.value.actual_page_id,
      query_string_data.value.actual_client_id,
      query_string_data.value.message_id
    )

    // đã kết bạn
    if (RES?.is_accept_friend_request)
      return $toast.error($t('Đã là bạn bè rồi'))

    // thông báo thành công
    $toast.success($t('Đã gửi lời mời kết bạn'))
  }

  /** kiểm tra xem trang zalo có bị mất kết nối không */
  isDiconnect(): boolean {
    // trang bị mất kết nối không
    if (selected_page_info.value?.is_disconnected) {
      $toast.error($t('Trang zalo bạn chọn đang bị mất kết nối'))
      return true
    }
    return false
  }

  /** lấy dữ liệu hội thoại */
  @error(new NoneToast())
  async getConversation() {
    // trang bị mất kết nối không
    if (this.isDiconnect()) return
    // nếu chưa chọn id trang thì dừng
    if (!selected_page_id.value) return
    // nếu không có id nhân viên thì thôi
    if (!client_id.value) return

    // lấy dữ liệu hội thoại
    conversationStore.select_conversation = await new Promise(
      (resolve, reject) => {
        read_conversation(
          {
            page_id: [selected_page_id.value as string],
            client_id: client_id.value,
            limit: 1,
          },
          (e, r) => {
            /** id của hội thoại đầu tiên */
            const FIRST_KEY_CONVERSATION = Object.keys(
              r?.conversation || {}
            )?.[0]

            /** lấy ra hội thoại đầu tiên */
            const CONVERSATION = r?.conversation?.[FIRST_KEY_CONVERSATION]

            // nếu có thì trả về không thì báo lỗi
            if (CONVERSATION) {
              resolve(CONVERSATION)
            } else {
              reject()
            }
          }
        )
      }
    )
  }

  /** lấy danh sách các page zalo của tổ chức hiện tại */
  @error($custom_toast)
  async getZaloPage() {
    // nếu không có id tổ chức thì thôi
    if (!query_string_data.value.org_id) return

    /**lấy danh sách trang của tổ chức hiện tại */
    const OSS = await read_os(query_string_data.value.org_id)

    // lưu danh sách các trang của tổ chức hiện tại vào store
    orgStore.list_os = OSS

    /**lọc ra các trang zalo cá nhân */
    zlp_oss.value = OSS.filter(os => os?.page_info?.type === 'ZALO_PERSONAL')

    /** id trang zalo lưu trong local storage */
    const ZALO_PAGE_ID = this.getZaloPageIdFromLocalStorage()

    // lặp qua danh sách nếu id lưu trong local storage tồn tại trong danh sách thì chọn
    zlp_oss.value?.forEach(os => {
      if (os.page_id === ZALO_PAGE_ID) {
        selected_page_id.value = os.page_id
      }
    })

    // nếu không có id nào trùng thì thôi, chọn tài khoản zl đầu tiên
    if (!selected_page_id.value) {
      selected_page_id.value = zlp_oss.value?.[0]?.page_id
    }

    // kết nối socket để nhận tin nhắn realtime
    $socket.connect(
      $env.host.n3_socket,
      zlp_oss.value?.map(os => os.page_id || ''),
      chatbotUserStore.chatbot_user?.fb_staff_id || '',
      this.handleSocketEvent
    )
  }

  /** lấy thông tin của các page zalo */
  // @loadingV2(commonStore, 'is_loading_full_screen')
  @error($custom_toast)
  async getZaloPageInfo() {
    /** danh sách các page zalo */
    const SELECTED_PAGE_IDS = zlp_oss.value?.map(os => os.page_id || '')

    /** nếu không có page nào thì thôi */
    if (!SELECTED_PAGE_IDS) return

    /**dữ liệu các trang đang chọn */
    const PAGES = await new N4SerivceAppPage().getPageInfoToChat(
      query_string_data.value.org_id,
      SELECTED_PAGE_IDS,
      true
    )

    pageStore.selected_page_list_info = PAGES
  }

  /** hàm lấy dữ liệu từ query string */
  getDataFromQueryString() {
    // lấy id tổ chức từ query string
    this.getQueryStringByKey('org_id')
    // lấy id khách hàng hiện tại từ query string
    this.getQueryStringByKey('actual_client_id')
    // lấy id trang hiện tại từ query string
    this.getQueryStringByKey('actual_page_id')
    // lấy id tin nhắn trong query string
    this.getQueryStringByKey('message_id')
    // lấy số điện thoại trong query string
    this.getQueryStringByKey('phone')
  }

  /** lấy dữ liệu từng field từ query string */
  getQueryStringByKey(key: keyof typeof query_string_data.value) {
    query_string_data.value[key] = $query_string.get(key) || ''
  }

  /** chọn trang zalo */
  selectPage(page_info?: OwnerShipInfo) {
    // nếu không có thông tin page thì thôi
    if (!page_info) return

    // lưu lại id page
    selected_page_id.value = page_info.page_id

    // gửi id trang tới trang cha để lấy id khách hàng
    this.getClientId()

    // tắt dropdown chọn page zalo
    zalo_personal_dropdown_ref.value?.toggleDropdown()

    // nếu không có id trang zalo thì thôi
    if (!selected_page_id.value) return

    // lưu lại id trang xuống localstorage
    this.setZaloPageIdToLocalStorage(selected_page_id.value)
  }

  /** hàm gửi sự kiện để lấy id khách hàng từ iframe cha */
  getClientId() {
    // reset hội thoại
    conversationStore.select_conversation = undefined

    // gửi sự kiện get.client_id đến iframe cha với id page đã chọn
    window.parent.postMessage(
      {
        type: 'get.client_id',
        from: 'ZALO_PERSONAL_CORE',
        data: {
          page_id: selected_page_id.value,
        },
      },
      '*'
    )
  }

  /** hàm xử lý sự kiện khi nhận được từ iframe cha */
  handleEvent(event: MessageEvent) {
    // nếu không phải là thẻ bọc của iframe zalo personal core thi thôi
    if (event.data?.from !== 'ZALO_PERSONAL_CONTAINER') return

    // nếu là sự kiện get.client_id thì lưu lại id khách hàng
    if (event.data?.type === 'get.client_id') {
      client_id.value = event.data?.data?.client_id
    }

    // lấy dữ liệu hội thoại của khách hàng đó
    this.getConversation()
  }

  /** hàm xử lý sự kiện nhận được từ socket */
  handleSocketEvent(socket_data: {
    /**dữ liệu của khách hàng */
    conversation?: ConversationInfo
    /**dữ liệu tin nhắn mới */
    message?: MessageInfo
    /**dữ liệu nhân viên */
    staff?: StaffSocket
    /**tên sự kiện */
    event?: SocketEvent
    /**dữ liệu tin nhắn cần cập nhật */
    update_message?: MessageInfo
    /**dữ liệu comment cập nhật */
    update_comment?: FacebookCommentPost
  }) {
    let { message, update_message, conversation } = socket_data

    // gửi thông điệp đến component xử lý danh sách hội thoại - ở đây cần xử lý khi update các nhãn
    if (size(conversation)) {
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

    // gửi thông điệp đến component xử lý hiển thị danh sách tin nhắn
    if (size(message)) {
      // socket tin nhắn mới cho các component
      window.dispatchEvent(
        new CustomEvent('chatbox_socket_message', { detail: message })
      )
    }

    // gửi thông điệp cập nhật tin nhắn đã có
    if (size(update_message))
      window.dispatchEvent(
        new CustomEvent('chatbox_socket_update_message', {
          detail: update_message,
        })
      )
  }

  /** hàm kiểm tra xem có hiển thị option zalo cá nhân không */
  isShowZaloPersonal(page_info?: IPage) {
    // nếu không có thông tin page thì ẩn
    if (!page_info) return

    /** Tên của page zalo đó khi được bỏ dấu và viết hoa và loại bỏ hết khoảng trắng*/
    const PAGE_NAME = nonAccentVn(page_info?.name || '')?.replace(/ /g, '')
    /** Từ khóa tìm kiếm khi được bỏ dấu và viết hoa và loại bỏ hết khoảng trắng */
    const KEY_WORD = nonAccentVn(search_zalo_personal.value)?.replace(/ /g, '')

    return PAGE_NAME.includes(KEY_WORD)
  }

  /** lưu id của page zalo xuống localstorage */
  setZaloPageIdToLocalStorage(page_id: string) {
    /** Ánh xạ id trang zalo được chọn của các tổ chức */
    let selected_zalo_page_org_id_map: Record<string, string> =
      this.getZaloPageIdOrgIdMapFromLocalStorage()

    /** id của tổ chức hiện tại */
    const ORG_ID = orgStore.selected_org_id

    // nếu không có id tổ chức hiện tại thì thôi
    if (!ORG_ID) return

    // thêm id của trang đã chọn với id của tổ chức hiện tại
    selected_zalo_page_org_id_map[ORG_ID] = page_id

    // lưu dữ liệu mới xuống localstorage
    $local_storage.setItem(
      'selected_zalo_page_org_id_map',
      JSON.stringify(selected_zalo_page_org_id_map)
    )
  }

  /** lấy id trang zalo được chọn của tổ chức hiện tại lưu trong localstorage */
  getZaloPageIdFromLocalStorage(): string {
    /** Ánh xạ id trang zalo được chọn của các tổ chức */
    const SELECTED_ZALO_PAGE_ORG_ID_MAP: Record<string, string> =
      this.getZaloPageIdOrgIdMapFromLocalStorage()

    /** id của tổ chức hiện tại */
    const ORG_ID = orgStore.selected_org_id

    // nếu không có id tổ chức hiện tại thì thôi
    if (!ORG_ID) return ''

    return SELECTED_ZALO_PAGE_ORG_ID_MAP[ORG_ID] || ''
  }

  /** lấy ánh xạ của page zalo được chọn với các tổ chức ở localstorage */
  getZaloPageIdOrgIdMapFromLocalStorage(): Record<string, string> {
    try {
      /** dữ liệu ánh xạ trang zalo được chọn và các tổ chức theo id được lưu trong localstorage ở dạng string */
      const SELECTED_ZALO_PAGE_ORG_ID_MAP_STR = $local_storage.getItem(
        'selected_zalo_page_org_id_map'
      )

      // nếu không có dữ liệu thì trả về object rỗng
      if (!SELECTED_ZALO_PAGE_ORG_ID_MAP_STR) return {}

      /** dữ liệu sau khi parse thành công */
      const SELECTED_ZALO_PAGE_ORG_ID_MAP = JSON.parse(
        SELECTED_ZALO_PAGE_ORG_ID_MAP_STR
      )

      // nếu không có thì trả về object rỗng
      if (!SELECTED_ZALO_PAGE_ORG_ID_MAP) return {}

      return SELECTED_ZALO_PAGE_ORG_ID_MAP
    } catch (error) {
      // nếu parse lỗi thì trả về object rỗng
      return {}
    }
  }
}
const $main = new Main()

/** hàm xử lý sự kiện khi nhân được từ iframe zalo personal container */
const handleEvent = $main.handleEvent.bind($main)

onMounted(async () => {
  // hàm lấy dữ liệu từ query string
  $main.getDataFromQueryString()

  // lấy danh sách các page zalo của tổ chức hiện tại
  await $main.getZaloPage()

  // lấy thông tin của các page zalo
  $main.getZaloPageInfo()

  // gửi iframe đến trang cha
  $main.getClientId()

  // lắng nghe sự kiện từ iframe cha
  window.addEventListener('message', handleEvent)

  messageStore.list_message_id = 'iframe-list-message'
})

onUnmounted(() => {
  // hủy lắng nghe sự kiện từ iframe cha
  window.removeEventListener('message', handleEvent)

  // đóng socket
  $socket.close()
})
</script>
