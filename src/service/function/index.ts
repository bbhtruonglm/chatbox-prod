import { useConversationStore, usePageStore, useMessageStore } from '@/stores'
import { identity, isEqual, keys, omit, pickBy, size, sortBy } from 'lodash'
import { flow, toggle_loading } from '@/service/helper/async'
import { checkPricingValid } from '@/service/helper/pricing'
import { differenceInMinutes } from 'date-fns'
import {
  get_page_info_to_chat,
  reset_read_conversation,
} from '../api/chatbox/n4-service'
import { toastError } from '../helper/alert'
import { format as format_date } from 'date-fns'
import { useRoute } from 'vue-router'
import { nextTick } from 'vue'
import { getItem } from '../helper/localStorage'
import { useI18n, type ComposerTranslation } from 'vue-i18n'

import type { Cb, CbError } from '@/service/interface/function'
import type { ConversationInfo } from '../interface/app/conversation'
import type { AppInstalledInfo } from '../interface/app/widget'
import type { Router } from 'vue-router'
import type { MessageInfo } from '../interface/app/message'
import { copyToClipboard } from '../helper/copyWithAlert'

/**kiểm tra, xử lý một số logic trước khi đi đến trang chat */
export const preGoToChat = (proceed: Cb) => {
  const pageStore = usePageStore()
  const conversationStore = useConversationStore()

  flow(
    [
      // * kiểm tra xem page đã được chọn hay chưa
      (cb: CbError) => {
        if (!size(pageStore.selected_page_id_list))
          return cb('v1.view.main.dashboard.select_page.empty_page.title')

        cb()
      },
      // * kiểm tra các page và user hiện tại có gói hay không
      // (cb: CbError) =>
      //   checkPricingValid((e, r) => {
      //     // tắt loading
      //     if (e) return toggle_loading(false)

      //     cb()
      //   }),
      // * nếu danh sách page chọn thay đổi, thì xoá filter conversation
      (cb: CbError) => {
        // nếu vẫn là các page cũ đã chọn thì bỏ qua
        if (
          isEqual(
            sortBy(keys(pageStore.selected_page_id_list)),
            sortBy(keys(pageStore.selected_page_list_info))
          )
        )
          return cb()

        // nếu chọn khác page thì

        //  xoá lọc
        resetConversationFilter()

        // xoá conversation đang chọn
        conversationStore.select_conversation = undefined

        cb()
      },
    ],
    proceed,
    true
  )
}

/**xoá lọc hội thoại */
export const resetConversationFilter = () => {
  const conversationStore = useConversationStore()

  conversationStore.option_filter_page_data = { is_spam_fb: 'NO' }
}

/**chọn một hội thoại */
export const selectConversation = (conversation: ConversationInfo) => {
  if (!conversation) return

  const conversationStore = useConversationStore()

  // chọn khách hàng này, lưu dữ liệu vào store
  conversationStore.select_conversation = conversation

  // đánh dấu tin nhắn là đã đọc
  reset_read_conversation(
    {
      page_id: conversation?.fb_page_id,
      client_id: conversation?.fb_client_id,
    },
    (e, r) => {
      if (e) return toastError(e)
    }
  )

  // tự động focus vào input chat
  document.getElementById('chat-text-input-message')?.focus()
}

/**cuộn xuống cuối trang */
export const scrollToBottomMessage = () => {
  const LIST_MESSAGE = document.getElementById('list-message')

  if (!LIST_MESSAGE) return

  // html được render thì mới cuộn
  nextTick(() => {
    LIST_MESSAGE.scrollTop = LIST_MESSAGE.scrollHeight
  })
}

/**lấy danh sách nhãn của trang */
export const getPageLabel = (page_id?: string) => {
  const pageStore = usePageStore()

  return pageStore.selected_page_list_info?.[page_id as string]?.label_list
}

/**lấy danh sách nhân viên của trang */
export const getPageStaff = (page_id?: string) => {
  const pageStore = usePageStore()

  return pageStore.selected_page_list_info?.[page_id as string]?.staff_list
}

/**đọc tên của nhân viên */
export function getStaffName(page_id?: string, staff_id?: string) {
  const $t = useI18n().t

  return (
    getPageStaff(page_id)?.[staff_id as string]?.name ||
    `[${$t('v1.view.main.dashboard.chat.center_content.del_staff')}]`
  )
}

/**format thời gian đọc tin nhắn */
export function getStaffReadDate(staff_id: string) {
  const conversationStore = useConversationStore()

  const TIME =
    conversationStore.select_conversation?.staff_read?.[staff_id] || 0

  return format_date(new Date(TIME), 'HH:mm:ss, dd/MM/yyyy')
}

/**lấy danh sách widget của trang */
export const getPageWidget = (page_id?: string) => {
  const pageStore = usePageStore()

  return pageStore.selected_page_list_info?.[page_id as string]?.widget_list
}
/**lấy dữ liệu nhân viên hiện tại có liên quan đến trang này */
export const getPageCurrentStaff = (page_id?: string) => {
  const pageStore = usePageStore()

  return pageStore.selected_page_list_info?.[page_id as string]?.current_staff
}
/**lấy dữ liệu của nhân viên của trang */
export const getStaffInfo = (page_id?: string, staff_id?: string) => {
  const pageStore = usePageStore()

  return pageStore.selected_page_list_info?.[page_id!]?.staff_list?.[staff_id!]
}
/**lấy thông tin của trang */
export const getPageInfo = (page_id?: string) => {
  const pageStore = usePageStore()

  return pageStore.selected_page_list_info?.[page_id as string]?.page
}

/**đọc dữ liệu của nhãn */
export const getLabelInfo = (page_id?: string, label_id?: string) => {
  return getPageLabel(page_id)?.[label_id as string]
}

/**lọc các nhãn chưa bị xoá */
export const getLabelValid = (page_id?: string, label_list?: string[]) => {
  return label_list?.filter(label_id => getLabelInfo(page_id, label_id))
}

/**kiểm tra staff hiện tại có phải là admin của page không */
export const isCurrentStaffIsPageAdmin = (page_id: string) => {
  const pageStore = usePageStore()

  /**dữ liệu của trang */
  const PAGE_INFO = pageStore.selected_page_list_info?.[page_id]

  // kiểm tra staff có nằm trong nhóm admin không
  if (
    !PAGE_INFO?.group_admin_id ||
    !PAGE_INFO?.current_staff?.group_staff ||
    !PAGE_INFO?.current_staff?.group_staff?.includes(PAGE_INFO?.group_admin_id)
  )
    return false

  return true
}

/**khởi tạo url và token cho iframe */
export const getIframeUrl = (widget: AppInstalledInfo) => {
  const conversationStore = useConversationStore()

  const URL_APP = widget.snap_app.url_app
  const ACCESS_TOKEN = conversationStore.list_widget_token?.data?.[widget._id]
  const CHATBOX_TOKEN = getItem('access_token')
  const LOCALE = localStorage.getItem('locale') || 'vn'
  const IS_PAGE_ADMIN = isCurrentStaffIsPageAdmin(widget.fb_page_id)

  return `${URL_APP}?access_token=${ACCESS_TOKEN}&locale=${LOCALE}&chatbox_token=${CHATBOX_TOKEN}&is_page_admin=${IS_PAGE_ADMIN}`
}

/**mở link tab mới */
export const openNewTab = (url: string) => {
  window.open(url, '_blank')
}

/**mở link tab mới */
export const openPopup = (url: string, width = 800, height = 600) => {
  // Tính vị trí bên trái sao cho cửa sổ nằm giữa màn hình
  var left = (screen.width - width) / 2
  // Tính vị trí trên cùng sao cho cửa sổ nằm giữa màn hình
  var top = (screen.height - height) / 2

  var params = `width=${width}, height=${height}, top=${top}, left=${left}, resizable=yes, scrollbars=yes`

  // Mở cửa sổ popup
  window.open(url, 'PopupWindow', params)
}

/**kiểm tra xem có đang kích hoạt filter tin nhắn hay không */
export function isActiveMessageFilter() {
  const conversationStore = useConversationStore()

  if (
    conversationStore.option_filter_page_data.unread_message ||
    conversationStore.option_filter_page_data.not_response_client ||
    conversationStore.option_filter_page_data.not_exist_label ||
    conversationStore.option_filter_page_data.is_spam_fb === 'YES'
  )
    return true

  return false
}
/**check xem có đang kích hoạt lọc hội thoại hay không */
export function isFilterActive() {
  const conversationStore = useConversationStore()

  // đọc lấy dữ liệu lọc không có search
  let filter = omit(conversationStore.option_filter_page_data, ['search'])

  // loại bỏ các giá trị bị undefied trong object
  filter = pickBy(filter, identity)

  // kiểm tra lọc
  if (isEqual(filter, { is_spam_fb: 'NO' })) return false

  return true
}

/**lấy dữ liệu ngôn ngữ hiện tại */
export function getLocale() {
  // đọc ngôn ngữ hiện tại được lưu từ local storage
  return localStorage.getItem('locale') || 'vn'
}

/**cài đặt id trang và user cho chat */
export function setParamChat(
  $router: Router,
  page_id: string,
  client_id: string
) {
  // $router.replace({ query: { p: page_id, u: client_id } })
  $router.replace({ query: { page_id: page_id, user_id: client_id } })
}

/** Check trạng thái kích hoạt bộ lọc */
export function isActiveFilter(type: string): boolean {
  const conversationStore = useConversationStore()

  let status = false
  switch (type) {
    case 'date':
      if (
        conversationStore.option_filter_page_data.time_range &&
        !conversationStore.option_filter_page_data.post_id
      )
        status = true
      break
    case 'phone':
      if (
        conversationStore.option_filter_page_data.have_phone &&
        !conversationStore.option_filter_page_data.post_id
      )
        status = true
      break
    default:
      break
  }
  return status
}

/**
 * đọc dữ liệu của các trang được chọn để chat
 * - i18n phải được truyền vào để đọc ngôn ngữ
 */
export function getSelectedPageInfo($t: ComposerTranslation, proceed: Cb) {
  const pageStore = usePageStore()

  get_page_info_to_chat(keys(pageStore.selected_page_id_list), (e, r) => {
    if (e) return proceed(e)
    if (!r)
      return proceed($t('v1.view.main.dashboard.chat.error.get_page_info'))

    pageStore.selected_page_list_info = r
    proceed()
  })
}

/**kiểm tra xem tin nhắn có quá thời gian không */
export function calcIsClientRepSlow(
  page_id?: string,
  time?: string,
  current_index?: number,
) {
  // nếu không có page_id thì thôi
  if (!page_id || !current_index) return false

  // nếu không có thời gian thì thôi
  if (!time) return false

  /**thời gian rep chậm bị cảnh báo */
  let ALERT_TIME = getPageInfo(page_id)?.alert_slow_rep_time

  // nếu không bật cảnh báo thì thôi
  if (!ALERT_TIME || ALERT_TIME <= 0) return false

  const messageStore = useMessageStore()

  /**tin nhắn tiếp theo */
  let next_message = messageStore.list_message?.[current_index + 1]

  // nếu tin tiếp theo không phải là của page thì thôi
  if (!next_message || next_message?.message_type !== 'page') return false

  /**thời gian tin tiếp theo được nhắn */
  let next_date = next_message?.time || next_message?.createdAt

  if (!next_date) return false

  /**khoảng thời gian tính bằng phút giữa 2 tin */
  let duration_minute = differenceInMinutes(new Date(next_date), new Date(time))

  // nếu trong khoảng cho phép thì thôi
  if (duration_minute < ALERT_TIME) return false

  return true
}
/**kiểm tra xem trang có quá trễ không */
export function calcIsPageRepSlow(
  page_id?: string,
  current_index?: number,
  list_message?: MessageInfo[]
) {
  // nếu không có page_id thì thôi
  if (!page_id || !current_index) return false

  /**vị trí của tin nhắn trước đó */
  const BEFORE_INDEX = current_index - 1

  // nếu không có tin trước đó thì thôi
  if (BEFORE_INDEX < 0) return false

  /**tin nhắn trước đó */
  let before_message = list_message?.[BEFORE_INDEX]

  // nếu tin trước đó không phải là của client thì thôi
  if (!before_message || before_message?.message_type !== 'client') return false

  /**thời gian tin trước đó được nhắn */
  let before_date = before_message?.time || before_message?.createdAt

  // nếu không có thời gian thì thôi
  if (!before_date) return false

  // tính dựa vào hàm trước
  return calcIsClientRepSlow(page_id, before_date, BEFORE_INDEX)
}

/**xử lý chuỗi tin nhắn trước khi hiển thị */
export function renderText(text: string) {
  /**regex kiểm tra số điện thoại */
  const REGEX_PHONE =
    /[\/]?(?:[+]84|0)(?:[\-\.\s])?[35789]+[\-\.\s]?\d{1}?[\-\.\s]?\d{1}?[\-\.\s]?\d{1}?[\-\.\s]?\d{1}?[\-\.\s]?\d{1}?[\-\.\s]?\d{1}?[\-\.\s]?\d{1}?[\-\.\s]?\d{1}/

  /**regex kiểm tra email */
  const REGEX_EMAIL =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$|([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/gi

  /**regex kiểm tra url */
  const REGEX_URL = /((http|https)?:\/\/[^\s]+)/g

  /**số điện thoại */
  let phone = REGEX_PHONE.exec(text)?.[0]?.trim()
  /**email */
  let email = REGEX_EMAIL.exec(text)?.[0]?.trim()
  /**đường dẫn url */
  let url = REGEX_URL.exec(text)?.[0]?.trim()

  // nếu sdt nằm trong link, thì loại bỏ sdt tìm được
  if (phone && url && url.includes(phone)) phone = undefined

  // nếu trong sdt có dấu '/' thì bỏ sdt tìm được
  if (phone?.includes('/')) phone = undefined

  // thay đổi hiển thị của sdt
  if (phone)
    text = text.replace(phone, ` <span class="phone-detect">${phone}</span>`)

  // thay đổi hiển thị của email
  if (email)
    text = text.replace(email, ` <span class="email-detect">${email}</span>`)

  // thay đổi hiển thị của url
  if (url)
    text = text.replace(
      url,
      `<a class="link-detect" href="${url}" target="_blank">${url}</a>`
    )

  // trả về chuỗi đã xử lý
  return text
}

/**xử lý sự kiện click vào tin nhắn để sao chép sdt, email */
export function clickCopyPhoneEmail($event: MouseEvent) {
  /**mục tiêu thực tế được click */
  const TARGET = $event.target as HTMLElement

  // nếu không phải là sdt, email thì thôi
  if (!['phone-detect', 'email-detect'].includes(TARGET.className)) return

  /**giá trị cấn copy */
  const VALUE = TARGET.innerText

  copyToClipboard(VALUE)
}