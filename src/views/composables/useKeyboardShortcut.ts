import { useCommonStore } from '@/stores'
import { tinykeys } from 'tinykeys'
import { onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

/** xử lý logic lắng nghe các phím tắt */
export function useKeyboardShortcut() {
  /** router */
  const $router = useRouter()
  const $route = useRoute()

  /** store */
  const commonStore = useCommonStore()

  /** hàm quay lại màn chọn trang */
  const backToSelectPage = () => {
    // nếu đã ở trang thì thôi
    if ($route.path !== '/dashboard/select-page') {
      $router.push('/dashboard/select-page')
    }
  }

  /** hàm bật lọc tương tác */
  const toggleInteract = () => {
    commonStore.filter_show_with_shortcut = 'interact'
  }

  /** hàm bật lọc trạng thái */
  const toggleMessage = () => {
    commonStore.filter_show_with_shortcut = 'message'
  }

  /** hàm bật lọc số điện thoại */
  const togglePhone = () => {
    commonStore.filter_show_with_shortcut = 'phone'
  }

  /** hàm bật lọc thời gian */
  const toggleDate = () => {
    commonStore.filter_show_with_shortcut = 'date'
  }

  /** hàm bật lọc gắn nhãn */
  const toggleTag = () => {
    commonStore.filter_show_with_shortcut = 'tag'
  }

  /** hàm bật lọc loại trừ nhãn */
  const toggleNotTag = () => {
    commonStore.filter_show_with_shortcut = 'not_tag'
  }

  /** hàm bật lọc nhân viên */
  const toggleStaff = () => {
    commonStore.filter_show_with_shortcut = 'staff'
  }

  /** hàm bật lọc bài viết */
  const togglePost = () => {
    commonStore.filter_show_with_shortcut = 'post'
  }

  /** hàm xóa bộ lọc */
  const clearFilter = () => {
    commonStore.filter_show_with_shortcut = 'clear_all_filter'
  }

  /** hàm xóa lọc */
  const deleteLabel = () => {}

  /** hàm clean up sự kiện lắng nghe các phím tắt */
  let unsubscribe: () => void

  /** danh sách các phím tắt */
  const KEYMAP: Record<string, Record<string, () => void>> = {
    'Shift+ArrowLeft': {
      ALL: backToSelectPage,
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
