import type { ISortConversation } from '@/service/interface/app/page'
import { useOrgStore, usePageStore } from '@/stores'
import { keys } from 'lodash'
import { singleton } from 'tsyringe'

/**thiết lập đặc biết của trang cần tính toán */
export interface ISpecialPageConfigs {
  /**sort hội thoại */
  sort_conversation?: ISortConversation
  /**
   * hiện hội thoại theo nhân viên chỉ định
   * - true: chỉ hiện hội thoại của nhân viên đó
   * - false, undefined: hiện hội thoại của tất cả nhân viên
   */
  is_only_visible_client_of_staff?: boolean
}

/**tính toán một số thiết lập trang đặc biết */
export interface ICalcSpecialPageConfigs {
  /**thực thi */
  exec(): ISpecialPageConfigs
}

/**tính toán một số thiết lập trang đặc biết */
@singleton()
export class CalcSpecialPageConfigs implements ICalcSpecialPageConfigs {
  /**
   * @param STORE_PAGE store của trang
   * @param STORE_ORG store của tổ chức
   */
  constructor(
    // private readonly STORE_PAGE = usePageStore(),
    private readonly STORE_ORG = useOrgStore()
  ) {}

  exec(): ISpecialPageConfigs {
    // lấy trực tiếp từ store của tổ chức
    return {
      sort_conversation:
        this.STORE_ORG.selected_org_info?.org_config?.org_sort_conversation,
      is_only_visible_client_of_staff:
        this.STORE_ORG.selected_org_info?.org_config
          ?.org_is_only_visible_client_of_staff,
    }

    // /**danh sách id page */
    // const PAGE_IDS = keys(this.STORE_PAGE.selected_page_id_list)

    // /**kết quả */
    // const RESULT: ISpecialPageConfigs = {}

    // // TODO logic này là tạm thời
    // // nếu chỉ chọn 1 page, thì kích hoạt 1 số thiết lập trang
    // if (PAGE_IDS?.length === 1) {
    //   /**id trang duy nhất */
    //   const PAGE_ID = PAGE_IDS[0]

    //   /**thiết lập trang */
    //   const PAGE_CONFIG = this.STORE_PAGE.getPage(PAGE_ID)?.page

    //   // lấy thiết lập sort
    //   RESULT.sort_conversation = PAGE_CONFIG?.sort_conversation

    //   // nếu là nhân viên và page đang bật chỉ cho nv xem hội thoại của mình
    //   RESULT.is_only_visible_client_of_staff =
    //     PAGE_CONFIG?.is_only_visible_client_of_staff &&
    //     !this.STORE_PAGE.isCurrentStaffAdmin(PAGE_ID)
    // }

    // // trả về sort
    // return RESULT
  }
}
