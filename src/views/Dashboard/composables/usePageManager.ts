import { read_link_org } from '@/service/api/chatbox/billing'
import type { PageList } from '@/service/interface/app/page'
import type { ModalPosition } from '@/service/interface/vue'
import {
  useOrgStore,
  usePageManagerStore,
  usePageStore,
  useSelectPageStore,
} from '@/stores'
import { N4SerivceAppPage } from '@/utils/api/N4Service/Page'
import { error } from '@/utils/decorator/Error'
import { loading } from '@/utils/decorator/Loading'
import { Toast } from '@/utils/helper/Alert/Toast'
import { keys, map, pickBy, size } from 'lodash'
import { container } from 'tsyringe'
import { toRef } from 'vue'
import { useRoute } from 'vue-router'

export function usePageManager() {
  const pageStore = usePageStore()
  const selectPageStore = useSelectPageStore()
  const orgStore = useOrgStore()
  const pageManagerStore = usePageManagerStore()
  const $route = useRoute()
  const $toast = container.resolve(Toast)

  class Main {
    /**nạp lại dữ liệu trang */
    reloadPageData() {
      // nếu chọn tất cả tổ chức
      if (orgStore.is_selected_all_org) this.getALlOrgAndPage()
      // nếu chọn 1 tổ chức
      else this.getOrgPages(orgStore.selected_org_id)
    }
    /**vào chế độ chat nhiều trang */
    toggleModelGroupPage() {
      // reset lại danh sách trang đã chọn nếu đang ở chế độ nhiều tổ chức
      if (orgStore.is_selected_all_org) pageStore.selected_page_id_list = {}

      // toggle chế độ chat nhiều page
      selectPageStore.toggleGroupPageMode()
    }
    /**ẩn hiện modal kết nối nền tảng */
    toggleModalConnectPage(key?: string) {
      pageManagerStore.connect_page_ref?.toggleModal?.(key)
    }
    /**lấy toàn bộ các page đang được kích hoạt của 1 tổ chức */
    @loading(toRef(selectPageStore, 'is_loading'))
    @error($toast)
    async getOrgPages(org_id?: string): Promise<void> {
      // nếu không có tổ chức thì thôi
      if (!org_id) return

      // nếu chọn tất cả tổ chức thì thôi
      if (orgStore.is_selected_all_org) return

      /**danh sách trang của tổ chức đang kích hoạt, có lọc theo nhóm nếu cần */
      const RES = await new N4SerivceAppPage().getOrgActiveListPage(
        org_id,
        orgStore.selected_org_group[orgStore.selected_org_id || '']
      )

      
      pageStore.all_page_list = RES?.page_list || {}
    }
    /**có hiển thị các nút của trang chọn page không */
    isShowSelectPageButton() {
      return (
        // đang ở trang chọn page
        $route.path.includes('select-page') &&
        // không ở chế độ chat nhiều page
        (!selectPageStore.is_group_page_mode ||
          // người dùng chưa có trang nào
          !size(pageStore.active_page_list))
      )
    }
    /**lấy toàn bộ dữ liệu tổ chức và trang */
    @loading(toRef(selectPageStore, 'is_loading'))
    @error($toast)
    async getALlOrgAndPage(): Promise<void> {
      // xóa toàn bộ trang hiện tại
      pageStore.active_page_list = {}

      /**toàn bộ các trang của người dùng */
      const PAGE_DATA = await new N4SerivceAppPage().getListPage({
        // org_group: orgStore.selected_org_group,
      })

      // nếu không có dữ liệu trang thì thôi
      if (!PAGE_DATA?.page_list) return

      // lưu trữ dữ liệu trang
      pageStore.all_page_list = PAGE_DATA?.page_list

      // lấy dữ liệu mapping tổ chức và trang
      pageStore.map_orgs = await read_link_org(keys(pageStore.all_page_list))
    }
    /**ẩn hiện dropdown */
    toggleDropdown(
      $event?: MouseEvent,
      _position?: ModalPosition,
      _back?: number
    ) {
      // truyền vị trí và lùi lại
      pageManagerStore.position = _position || 'BOTTOM'
      pageManagerStore.back = _back || 236

      // sử dùng hàm của dropdown
      pageManagerStore.ref_dropdown_pick_connect_platform?.toggleDropdown(
        $event
      )
    }

    /** 
     * hàm lọc các trang theo nhóm 
     * @param active_page_list: danh sách trang được kích hoạt của 1 tổ chức
     * @param pape_to_group_map: mapping trang với nhóm
     * @param selected_org_group: nhóm đang được chọn
     * @param org_id: id của tổ chức
    */
    filterPageByGroup(
      page_list: PageList,
      pape_to_group_map: Record<string, string>,
      page_to_org_map: Record<string, string>,
      selected_org_group: Record<string, string>
    ) {
      return pickBy(page_list, (page, id) => {
        /** id của tổ chức của trang hiện tại */
        const PAGE_ORG_ID = page_to_org_map[id]

        /** id của nhóm của trang hiện tại */
        const PAGE_GROUP_ID = pape_to_group_map[id]

        /** nếu tổ chức đó đang không lọc theo nhóm thì thôi */
        if(!selected_org_group[PAGE_ORG_ID]) return true

        /** nếu có thì cần lọc đúng những page của nhóm đã chọn */
        return selected_org_group[PAGE_ORG_ID] === PAGE_GROUP_ID
      })
    }
  }
  const $main = new Main()

  return {
    toggleModalConnectPage: $main.toggleModalConnectPage,
    getOrgPages: $main.getOrgPages.bind($main),
    getALlOrgAndPage: $main.getALlOrgAndPage.bind($main),
    toggleDropdown: $main.toggleDropdown.bind($main),
    reloadPageData: $main.reloadPageData.bind($main),
    filterPageByGroup: $main.filterPageByGroup
  }
}
