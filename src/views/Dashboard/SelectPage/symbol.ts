import type { InjectionKey } from 'vue'

/**hàm sort danh sách page */
export const KEY_SORT_LIST_PAGE_FUNCT = Symbol() as InjectionKey<Function>

/**hàm chuyển trang chat */
export const KEY_GO_TO_CHAT_FUNCT = Symbol() as InjectionKey<Function>