import type { InjectionKey } from 'vue'

/**đọc lại dữ liệu user hiện tại */
export const KEY_GET_CHATBOT_USER_FUNCT = Symbol() as InjectionKey<Function>

/**toggle modal kết nối trang */
export const KEY_TOGGLE_MODAL_CONNECT_PAGE_FUNCT = Symbol() as InjectionKey<Function>

/**hàm lấy danh sách trang */
export const KEY_LOAD_LIST_PAGE_FUNCT = Symbol() as InjectionKey<Function>