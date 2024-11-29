import { format as data_format } from 'date-fns'
import { isDate } from 'lodash'
import { singleton } from 'tsyringe'

/**các hàm hỗ trợ cho ngày tháng */
export interface IDateHandle {
  /**
   * chuyển đổi ngày tháng sang chuỗi theo định dạng
   * @param date dữ liệu ngày tháng
   * @param format định dạng chuỗi
   */
  format(date?: Date | string | number, format?: string): string
}

/**các hàm hỗ trợ cho ngày tháng */
@singleton()
export class DateHandle implements IDateHandle {
  format(
    date: Date | string | number = new Date(),
    format: string = 'HH:mm:ss dd/MM/yyyy'
  ): string {
    /**dữ liệu ngày tháng */
    const DATE = isDate(date) ? date : new Date(date)

    return data_format(DATE, format)
  }
}
