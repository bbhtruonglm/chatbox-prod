import { chatboxSync } from '@/service/api/chatbox/common'
import type { OrgInfo } from '@/service/interface/app/billing'

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
