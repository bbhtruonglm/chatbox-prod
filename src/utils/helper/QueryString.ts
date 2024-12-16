import { singleton } from 'tsyringe'

/**xử lý query string */
export interface IQueryString {
  /**
   * lấy giá trị của 1 key trong query string
   * @param key key cần lấy giá trị
   */
  get(key: string): string | null
  /**lấy tất cả query string */
  getAll(): Record<string, string>
}

/**xử lý query string */
@singleton()
export class QueryString implements IQueryString {
  /**
   * @param SEARCH_PARAMS query string cần xử lý
   */
  constructor(
    private readonly SEARCH_PARAMS: URLSearchParams = new URLSearchParams(
      location.search
    )
  ) {}

  get(key: string) {
    return this.SEARCH_PARAMS.get(key)
  }
  getAll() {
    return this.SEARCH_PARAMS as unknown as Record<string, string>
  }
}
