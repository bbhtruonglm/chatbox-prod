import { format as data_format } from 'date-fns'
import { singleton } from 'tsyringe'

/**các hàm hỗ trợ cho ngày tháng */
export interface IDateHandle {
  /**
   * chuyển đổi ngày tháng sang chuỗi theo định dạng
   * @param date dữ liệu ngày tháng
   * @param format định dạng chuỗi
   */
  format(date?: Date, format?: string): string
}

/**các hàm hỗ trợ cho ngày tháng */
@singleton()
export class DateHandle implements IDateHandle {
  format(
    date: Date = new Date(),
    format: string = 'HH:mm:ss dd/MM/yyyy'
  ): string {
    return data_format(date, format)
  }
}
