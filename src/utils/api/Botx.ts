import { getItem } from '@/service/helper/localStorage'
import { ApiManager } from '../base/Api'

/**gọi API lên server của botx, tự động nạp token */
export class Botx extends ApiManager {
  constructor(uri: string) {
    // tự động nạp token
    super(uri, { Authorization: getItem('access_token') })
  }
}
