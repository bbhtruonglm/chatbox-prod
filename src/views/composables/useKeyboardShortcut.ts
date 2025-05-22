import { useCommonStore } from '@/stores'
import { useMagicKeys, type MagicKeysInternal } from '@vueuse/core'
import { watch, type ComputedRef, type Ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

/** xử lý logic lắng nghe các phím tắt */
export function useKeyboardShortcut() {
  /** các phím tắt */
  const keys = useMagicKeys()

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
    console.log(123);
    
    commonStore.filter_show_with_shortcut = 'interact'
  }

  /** hàm bật lọc trạng thái */
  const toggleMessage = () => {
    console.log(1234);
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

  /** hàm xóa lọc */
  const deleteLabel = () => {
    
  }
  

  /** danh sách các phím tắt */
  const KEYMAP = {
    CTRL_ARROW_LEFT: {
      key: keys['Ctrl+ArrowLeft'],
      fn: {
        'ALL': backToSelectPage,
      },
    },
    CTRL_B: {
      key: keys['Ctrl+B'],
      fn: {},
    },
    CTRL_L: {
      key: keys['Ctrl+L'],
      fn: {},
    },
    CTRL_E: {
      key: keys['Ctrl+E'],
      fn: {},
    },
    CTRL_K: {
      key: keys['Ctrl+K'],
      fn: {},
    },
    CTRL_P: {
      key: keys['Ctrl+P'],
      fn: {},
    },
    CTRL_R: {
      key: keys['Ctrl+R'],
      fn: {},
    },
    CTRL_X: {
      key: keys['Ctrl+X'],
      fn: {},
    },
    CTRL_1: {
      key: keys['Ctrl+1'],
      fn: {},
    },
    CTRL_2: {
      key: keys['Ctrl+2'],
      fn: {},
    },
    ALT_1: {
      key: keys['Alt+1'],
      fn: {
        '/': toggleInteract,
      },
    },
    ALT_2: {
      key: keys['Alt+2'],
      fn: {
        '/': toggleMessage,
      },
    },
    ALT_3: {
      key: keys['Alt+3'],
      fn: {
        '/': togglePhone,
      },
    },
    ALT_4: {
      key: keys['Alt+4'],
      fn: {
        '/': toggleDate,
      },
    },
    ALT_5: {
      key: keys['Alt+5'],
      fn: {
        '/': toggleTag,
      },
    },
    ALT_6: {
      key: keys['Alt+6'],
      fn: {
        '/': toggleNotTag,
      },
    },
    ALT_7: {
      key: keys['Alt+7'],
      fn: {
        '/': toggleStaff,
      },
    },
    ALT_8: {
      key: keys['Alt+8'],
      fn: {
        '/': togglePost,
      },
    },
    ALT_X: {
      key: keys['Alt+X'],
      fn: {
        '/': deleteLabel,
      },
    },
    ALT_Q: {
      key: keys['Alt+Q'],
      fn: {},
    },
    ALT_W: {
      key: keys['Alt+W'],
      fn: {},
    },
    ALT_E: {
      key: keys['Alt+E'],
      fn: {},
    },
    ALT_FALL: {
      key: keys['Alt+~'],
      fn: {},
    },
    ALT_S: {
      key: keys['Alt+S'],
      fn: {},
    },
    ALT_M: {
      key: keys['Alt+M'],
      fn: {},
    },
    ALT_O: {
      key: keys['Alt+O'],
      fn: {},
    },
    ALT_A: {
      key: keys['Alt+A'],
      fn: {},
    },
    ALT_SHIFT_M: {
      key: keys['Alt+Shift+M'],
      fn: {},
    },
    SHIFT_L: {
      key: keys['Shift+L'],
      fn: {},
    },
    SHIFT_P: {
      key: keys['Shift+P'],
      fn: {},
    },
    SHIFT_K: {
      key: keys['Shift+K'],
      fn: {},
    },
    SHIFT_E: {
      key: keys['Shift+E'],
      fn: {},
    },
  }

  // Lắng nghe tất cả phím trong keyMap
  Object.keys(KEYMAP).forEach(key => {
    watch(KEYMAP[key as keyof typeof KEYMAP].key, pressed => {
      // nếu không nhấn thì thôi
      if (!pressed) return

      // các hàm được gọi với từng màn
      const FUNC = KEYMAP[key as keyof typeof KEYMAP].fn as Record<string, () => void>

      // lặp qua các màn
      Object.keys(FUNC).forEach(path => {        
        // nếu đang ở màn nào thì gọi hàm tương ứng
        if ($route.path === path || path === 'ALL') {
          FUNC?.[path]?.()
        }
      })
    })
  })


  return {}
}
