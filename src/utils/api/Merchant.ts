import { ApiManager } from '@/utils/base/Api'

/**lịch sử cuộc gọi */
export interface ICallHistory {
  /**id bản ghi */
  id?: string
  /**id cuộc gọi */
  call_id?: null
  /**Thời lượng cuộc gọi - ms */
  duration?: number
  /**Thời điểm kết thúc cuộc gọi */
  end_time?: null
  /**
   * Loại cuộc gọi:
   * - "OUTGOING": Gọi đi
   */
  call_type?: 'OUTGOING'
  /**Thời điểm tạo bản ghi*/
  createdAt?: string
  /**Thời điểm cập nhật bản ghi*/
  updatedAt?: string
  /**ID liên hệ*/
  contact_id?: string
  /**Thời điểm bắt đầu cuộc gọi*/
  start_time?: null
  /**
   * Trạng thái cuộc gọi:
   * - "ANSWERED": Đã trả lời
   * - "NO_ANSWER": Không nghe máy
   * - "CANCELED": Đã hủy
   * - "BUSY": Máy bận
   */
  call_status?: 'ANSWERED' | 'NO_ANSWER' | 'CANCELED' | 'BUSY'
  /**Số điện thoại*/
  phone?: string
}

/**gọi API lên server của merchant */
export class MerchantContact extends ApiManager {
  constructor() {
    super($env.host.merchant.contact)
  }

  /**
   * đọc lịch sử cuộc gọi
   * @param org_id id tổ chức
   * @param page_id id trang
   * @param client_id id khách hàng
   */
  async getCallHistory(
    org_id: string,
    page_id: string,
    client_id: string
  ): Promise<ICallHistory[]> {
    /**dữ liệu gốc */
    return await this.post('customer/call_history', {
      org_id,
      page_id,
      client_id,
    })
  }
}

/**
  const RES = await new MerchantContact().getCallHistory(
    '7bd3ac17116c4aacb2e9e55ba0330388',
    '414786618395170',
    '8354158424709905'
  )
  console.log('res', RES)
 */
