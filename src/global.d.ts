/*******************************************************************************
 * 
 * * CÀI ĐẶT CÁC BIẾN TOÀN CỤC Ở ĐÂY
 * 
 ******************************************************************************/

import type { IndexedDB } from '@/service/helper/indexedDB'

declare global {
    /**các cài đặt của môi trường */
    var $env: EnvInfo
    /**NODE_ENV */
    var $node_env: string
    /**đối tượng index db */
    var $indexed_db: IndexedDB
    /**gắn cờ trình check adblock đã hoạt động */
    var check_ad_blocker: boolean
    /**gắn cờ trình phát hiện adblock đã hoạt động */
    var detect_ad_blocker: boolean
}

export {}