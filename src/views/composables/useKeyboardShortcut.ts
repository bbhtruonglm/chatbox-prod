import { useMagicKeys } from '@vueuse/core'
import { watch } from 'vue'

/** xử lý logic lắng nghe các phím tắt */
export function useKeyboardShortcut() {
  /** các phím tắt */
  const keys = useMagicKeys()
  /** tổ hợp phím Ctrl + B */
  const CTRL_B = keys['Ctrl+B']
  /** tổ hợp phím Ctrl + L */
  const CTRL_L = keys['Ctrl+L']
  /** tổ hợp phím Ctrl + E */
  const CTRL_E = keys['Ctrl+E']
  /** tổ hợp phím Ctrl + K */
  const CTRL_K = keys['Ctrl+K']
  /** tổ hợp phím Ctrl + P */
  const CTRL_P = keys['Ctrl+P']
  /** tổ hợp phím Ctrl + R */
  const CTRL_R = keys['Ctrl+R']
  /** tổ hợp phím Ctrl + X */
  const CTRL_X = keys['Ctrl+X']
  /** tổ hợp phím Ctrl + 1 */
  const CTRL_1 = keys['Ctrl+1']
  /** tổ hợp phím Ctrl + 2 */
  const CTRL_2 = keys['Ctrl+2']
  /** tổ hợp phím Alt + 1 */
  const ALT_1 = keys['Alt+1']
  /** tổ hợp phím Alt + 2 */
  const ALT_2 = keys['Alt+2']
  /** tổ hợp phím Alt + 3 */
  const ALT_3 = keys['Alt+3']
  /** tổ hợp phím Alt + 4 */
  const ALT_4 = keys['Alt+4']
  /** tổ hợp phím Alt + 5 */
  const ALT_5 = keys['Alt+5']
  /** tổ hợp phím Alt + 6 */
  const ALT_6 = keys['Alt+6']
  /** tổ hợp phím Alt + 7 */
  const ALT_7 = keys['Alt+7']
  /** tổ hợp phím Alt + 8 */
  const ALT_8 = keys['Alt+8']
  /** tổ hợp phím Alt + X */
  const ALT_X = keys['Alt+X']
  /** tổ hợp phím Alt + Q */
  const ALT_Q = keys['Alt+Q']
  /** tổ hợp phím Alt + W */
  const ALT_W = keys['Alt+W']
  /** tổ hợp phím Alt + E */
  const ALT_E = keys['Alt+E']
  /** tổ hợp phím Alt + ~ */
  const ALT_FALL = keys['Alt+~']
  /** tổ hợp phím Alt + S */
  const ALT_S = keys['Alt+S']
  /** tổ hợp phím Alt + M */
  const ALT_M = keys['Alt+M']
  /** tổ hợp phím Alt + O */
  const ALT_O = keys['Alt+O']
  /** tổ hợp phím Alt + A */
  const ALT_A = keys['Alt+A']
  /** tổ hợp phím Alt + Shift + M */
  const ALT_SHIFT_M = keys['Alt+Shift+M']
  /** tổ hợp phím Shift + L */
  const SHIFT_L = keys['Shift+L']
  /** tổ hợp phím Shift + P */
  const SHIFT_P = keys['Shift+P']
  /** tổ hợp phím Shift + K */
  const SHIFT_K = keys['Shift+K']
  /** tổ hợp phím Shift + E */
  const SHIFT_E = keys['Shift+E']
  return {}
}
