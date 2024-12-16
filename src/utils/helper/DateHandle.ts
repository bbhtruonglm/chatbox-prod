import {
  format as data_format,
  isToday,
  isThisYear,
  formatDistanceToNow,
} from 'date-fns'
import { isDate } from 'lodash'
import { singleton } from 'tsyringe'
import viLocale from 'date-fns/locale/vi'

/**thời gian đầu vào */
export type IDateInput = Date | string | number
/**các hàm hỗ trợ cho ngày tháng */
export interface IDateHandle {
  /**
   * chuyển đổi ngày tháng sang chuỗi theo định dạng
   * @param date dữ liệu ngày tháng
   * @param format định dạng chuỗi
   */
  format(date?: IDateInput, format?: string): string
  /**
   * chuyển đổi ngày tháng sang chuỗi so sánh với ngày hiện tại
   * @param date dữ liệu ngày tháng
   */
  formatCompareCurrentYear(date?: IDateInput): string
}

/**các hàm hỗ trợ cho ngày tháng */
@singleton()
export class DateHandle implements IDateHandle {
  /**20 giây trước, 2 ngày trước, ... */
  private genAgoDate(date: Date) {
    return formatDistanceToNow(date, {
      addSuffix: true,
      locale: viLocale,
    })
      ?.replace('khoảng', '')
      ?.replace('dưới', '')
      ?.replace('nữa', 'trước')
      ?.trim()
  }

  format(
    date: IDateInput = new Date(),
    format: string = 'HH:mm:ss dd/MM/yyyy'
  ): string {
    /**dữ liệu ngày tháng */
    const DATE = isDate(date) ? date : new Date(date)

    return data_format(DATE, format)
  }
  formatCompareCurrentYear(date: IDateInput = new Date()) {
    /**dữ liệu ngày tháng */
    const DATE = isDate(date) ? date : new Date(date)

    // nếu thời gian trong ngày thì chỉ hiện ago
    if (isToday(DATE)) return this.genAgoDate(DATE)

    // nếu trong năm thì hiện ngày tháng
    if (isThisYear(DATE)) return data_format(DATE, 'dd/MM')

    // nếu khác năm thì hiện full
    return data_format(DATE, 'dd/MM/yy')
  }
}
