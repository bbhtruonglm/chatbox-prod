import { chatboxSync } from '@/service/api/chatbox/common'
import type { OrgInfo, OwnerShipInfo } from '@/service/interface/app/billing'

/**đọc danh sách tổ chức */
export const read_org = async (): Promise<OrgInfo[]> =>
  chatboxSync({
    uri: `${$env.host.billing}/app/organization/read_org`,
  })

/**cập nhật thiết lập, thông tin một tổ chức */
export const update_org = async (org_id: string, body: {}): Promise<OrgInfo> =>
  chatboxSync({
    uri: `${$env.host.billing}/app/organization/update_org`,
    body: {
      org_id,
      ...body,
    },
  })

/**đọc danh sách các trang trong tổ chức */
export const read_os = async (org_id: string): Promise<OwnerShipInfo[]> =>
  chatboxSync({
    uri: `${$env.host.billing}/app/owner_ship/read_page`,
    body: { org_id },
  })

/**thêm trang vào tổ chức */
export const add_os = async (
  org_id: string,
  page_id: string
): Promise<OwnerShipInfo[]> =>
  chatboxSync({
    uri: `${$env.host.billing}/app/owner_ship/add_page`,
    body: { org_id, page_id },
  })

/**xoá trang khỏi tổ chức */
export const kick_os = async (
  org_id: string,
  page_id: string
): Promise<OwnerShipInfo[]> =>
  chatboxSync({
    uri: `${$env.host.billing}/app/owner_ship/kick_page`,
    body: { org_id, page_id },
  })
