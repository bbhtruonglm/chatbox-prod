import { IndexedDB } from '@/service/helper/indexedDB'

import type { Cb } from '../interface/function'

export const loadLib = (proceed: Cb) => {
    // khởi tạo kết nối đến indexeDB của trình duyệt
    globalThis.$indexed_db = new IndexedDB()

    proceed()
}