import { defineStore } from 'pinia'
import { ref} from 'vue'
import { saveIndexedDB, getIndexedDB } from '@/service/helper/store'
import { saveLocal, getLocal } from '@/service/helper/store'

import type { PageList } from '@/service/interface/app/page'

export const usePageStore = defineStore('page_store', () => {
    /**lưu dữ liệu của các page được kích hoạt của user này */
    const active_page_list = ref<PageList>({})
    /**lưu id của các page được chọn để chat */
    const selected_page_id_list = ref<{
        [index: string]: boolean | undefined
    }>(getLocal('selected_page_id_list', {}))

    // lưu dữ liệu xuống local
    saveLocal(selected_page_id_list, 'selected_page_id_list')

    // đọc dữ liệu được lưu ở indexeddb
    getIndexedDB(
        'active_page_list',
        undefined,
        (e, r) => active_page_list.value = r
    )

    // lưu dữ liệu xuống indexed khi có thay đổi
    saveIndexedDB(active_page_list, 'active_page_list')

    return {
        active_page_list,
        selected_page_id_list,
    }
})