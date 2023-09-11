import { Manager, Swipe } from 'hammerjs'
import { isMobile } from '../function'

import type { Cb } from '../interface/function'

/**
 * xử lý sự kiện vuốt từ bên trái sang
 * @param block_id id của thẻ gốc
 * @param proceed cb
 */
export const swipe_left = (block_id: string, proceed: Cb<HammerInput>) => {
    // chỉ xử lý ở diện thoại
    if (!isMobile()) return

    /**mục tiêu cần xử lý */
    const BLOCK = document.getElementById(block_id)

    if (!BLOCK) return

    /**cài đặt thư viện vào khối */
    const HAMMER_SWIPE = new Manager(BLOCK)

    /**vị trí ngón tay khi bắt đầu vuốt ngang */
    let start_position: number

    // kích hoạt lắng nghe sự kiện vuốt nhanh
    HAMMER_SWIPE.add(new Swipe())

    // xử lý sự kiện vuốt nhanh từ trái sang phải
    HAMMER_SWIPE.on('swiperight', $event => {
        if (isOutsideStartQuarterLeft()) return

        proceed(null, $event)
    })

    /**
     * kiểm tra ngón tay có ngoài từ vị trí bên trái và ngoài khoảng 1/4 chiều 
     * ngang màn hình hay không 
     */
    function isOutsideStartQuarterLeft() {
        return start_position > (window.innerWidth / 8)
    }
}