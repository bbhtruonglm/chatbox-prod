import type { InjectionKey } from 'vue'

/**sử dụng để inject hàm của dashboard cho component con gọi được */
export const KEY_GET_CHATBOT_USER_FUNCT = Symbol() as InjectionKey<Function>