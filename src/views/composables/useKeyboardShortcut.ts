import { confirm } from '@/service/helper/alert'
import { signout } from '@/service/helper/oauth'
import { useCommonStore, useConversationStore } from '@/stores'
import { tinykeys } from 'tinykeys'
import { onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'

/** xử lý logic lắng nghe các phím tắt */
export function useKeyboardShortcut() {
  /** router */
  const $router = useRouter()
  const $route = useRoute()

  /** i18n */
  const { t } = useI18n()

  /** store */
  const commonStore = useCommonStore()
  const conversationStore = useConversationStore()

  /** hàm quay lại màn chọn trang */
  const backToSelectPage = () => {
    // nếu đã ở trang thì thôi
    if ($route.path !== '/dashboard/select-page') {
      $router.push('/dashboard/select-page')
    }
  }

  /** hàm xử lý đăng xuất */
  const handleSignout = () => {
    confirm(
      'question',
      t('Xác nhận đăng xuất?'),
      '',
      (is_cancel) => {
        if(!is_cancel) signout()
      }
      ,
      t('Xác nhận'),
      t('Hủy'),
    )
  }

  /** hàm bật lọc tương tác */
  const toggleInteract = () => {
    commonStore.keyboard_shortcut = 'interact'
  }

  /** hàm bật lọc trạng thái */
  const toggleMessage = () => {
    commonStore.keyboard_shortcut = 'message'
  }

  /** hàm bật lọc số điện thoại */
  const togglePhone = () => {
    commonStore.keyboard_shortcut = 'phone'
  }

  /** hàm bật lọc thời gian */
  const toggleDate = () => {
    commonStore.keyboard_shortcut = 'date'
  }

  /** hàm bật lọc gắn nhãn */
  const toggleTag = () => {
    commonStore.keyboard_shortcut = 'tag'
  }

  /** hàm bật lọc loại trừ nhãn */
  const toggleNotTag = () => {
    commonStore.keyboard_shortcut = 'not_tag'
  }

  /** hàm bật lọc nhân viên */
  const toggleStaff = () => {
    commonStore.keyboard_shortcut = 'staff'
  }

  /** hàm bật lọc bài viết */
  const togglePost = () => {
    commonStore.keyboard_shortcut = 'post'
  }

  /** hàm xóa bộ lọc */
  const clearFilter = () => {
    commonStore.keyboard_shortcut = 'clear_all_filter'
  }

  /** chuyển chế độ chat */
  const toggleChatMode = (e: KeyboardEvent) => {
    conversationStore.option_filter_page_data.conversation_type = 'CHAT'
    // chặn hành động mặc định của 
    e.preventDefault()
  }

  /** chuyển chế độ bài viết */
  const togglePostMode = (e: KeyboardEvent) => {
    conversationStore.option_filter_page_data.conversation_type = 'POST'
    e.preventDefault()
  }

  /** toggle trạng thái tìm kiếm */
  const toggleSearch = (e: KeyboardEvent) => {
    commonStore.keyboard_shortcut = 'search_conversation'
    e.preventDefault()
  }

  /** toggle hiện thị danh sách nhãn */
  const toggleLabel = () => {
    commonStore.keyboard_shortcut = 'toggle_labels'
  }

  /** mở xem hồ sở của khách hiện tại */
  const openClientInfo = (e: KeyboardEvent) => {
    commonStore.keyboard_shortcut = 'view_client_info'
    e.preventDefault()
  }

  /** toggle trạng thái chưa xem */
  const toggleUnread = (e: KeyboardEvent) => {
    commonStore.keyboard_shortcut = 'toggle_unread'
    e.preventDefault()
  }

  /** hàm clean up sự kiện lắng nghe các phím tắt */
  let unsubscribe: () => void

  /** danh sách các phím tắt */
  const KEYMAP: Record<string, Record<string, (e: KeyboardEvent) => void>> = {
    'Shift+ArrowLeft': {
      ALL: backToSelectPage,
    },
    'Control+Shift+E': {
      ALL: handleSignout,
    },
    'Alt+Digit1': {
      '/': toggleInteract,
    },
    'Alt+Digit2': {
      '/': toggleMessage,
    },
    'Alt+Digit3': {
      '/': togglePhone,
    },
    'Alt+Digit4': {
      '/': toggleDate,
    },
    'Alt+Digit5': {
      '/': toggleTag,
    },
    'Alt+Digit6': {
      '/': toggleNotTag,
    },
    'Alt+Digit7': {
      '/': toggleStaff,
    },
    'Alt+Digit8': {
      '/': togglePost,
    },
    'Alt+X': {
      '/': clearFilter,
    },
    'Control+Digit1': {
      '/': toggleChatMode,
    },
    'Control+Digit2': {
      '/': togglePostMode,
    },
    'Control+K': {
      '/': toggleSearch,
    },
    'Shift+L': {
      '/': toggleLabel,
    },
    'Control+P': {
      '/': openClientInfo,
    },
    'Control+R': {
      '/': toggleUnread,
    },
  }

  /** hàm lấy hàm xử lý khi nhấn tổ hợp với màn hiện tại */
  function handlePressKey(key: string) {
    return KEYMAP?.[key]?.[$route.path] || KEYMAP?.[key]?.['ALL']
  }

  onMounted(() => {
    /** dữ liệu lắng nghe sự kiện */
    let shortcut_handle_map: Record<string, (event: KeyboardEvent) => void> = {}

    /** lặp qua các phím tắt và lấy hàm xử lý phù hợp với màn đó */
    Object.keys(KEYMAP).forEach(key => {
      shortcut_handle_map[key] = handlePressKey(key)
    })

    /** đăng ký lắng nghe các phím tắt */
    unsubscribe = tinykeys(window, shortcut_handle_map)
  })
  onUnmounted(() => {
    /** hủy lắng nghe sự kiện */
    unsubscribe?.()
  })

  return {}
}
