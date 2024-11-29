import { container, singleton } from 'tsyringe'
import { WindowAction, type IWindowAction } from './Navigation'
import { NotImplementedError } from '../error/NotImplemented'
import { useConversationStore, useOrgStore } from '@/stores'
import { Parser, type IParser } from './Parser'
import { LocalStorage, type ILocalStorage } from './LocalStorage'
import { Locale, type ILocale } from './Locale'

/**các tiện ích liên quan đến trang web bên ngoài */
export interface IExternalSite {
  /**
   * mở thiết lập trang
   * @param path loại thiết lập trang
   */
  openPageSetting(path?: string): void
  /**mở trang thống kê */
  openPageAnalytic(): void
  /**mở trang thiết lập chatbot */
  openPageChatbot(): void
  /**mở merchant.vn */
  openMerchant(): void
  /**mở trang thiết lập hệ thống */
  openSystemDashboard(): void
}

/**các tiện ích liên quan đến trang web bên ngoài */
@singleton()
export class ExternalSite implements IExternalSite {
  /**
   * @param STORE_CONVERSATION store dữ liệu cuộc trò chuyện
   * @param STORE_ORG store dữ liệu tổ chức
   * @param SERVICE_WINDOW_ACTION các tiện ích liên quan đến cửa sổ trình duyệt
   * @param SERVICE_PARSER các tiện ích liên quan đến xử lý dữ liệu
   * @param SERVICE_LOCALSTORAGE các tiện ích liên quan đến lưu trữ dữ liệu cục bộ
   * @param SERVICE_LOCALE các tiện ích liên quan đến ngôn ngữ
   */
  constructor(
    private readonly STORE_CONVERSATION = useConversationStore(),
    private readonly STORE_ORG = useOrgStore(),
    private readonly SERVICE_WINDOW_ACTION: IWindowAction = container.resolve(
      WindowAction
    ),
    private readonly SERVICE_PARSER: IParser = container.resolve(Parser),
    private readonly SERVICE_LOCALSTORAGE: ILocalStorage = container.resolve(
      LocalStorage
    ),
    private readonly SERVICE_LOCALE: ILocale = container.resolve(Locale)
  ) {}

  openPageSetting(path: string = '') {
    // nếu không phải là admin thì không được phép
    if (!this.STORE_ORG.isAdminOrg()) return

    /**id trang */
    const PAGE_ID = this.STORE_CONVERSATION.select_conversation?.fb_page_id

    /**đường dẫn ui thiết lập trang */
    const URI = $env.host.page_setting_view

    /**dữ liệu đính kèm url */
    const QS = this.SERVICE_PARSER.toQueryString({
      token: this.SERVICE_LOCALSTORAGE.getItem('access_token'),
      fb_page_id: PAGE_ID,
      page_id: PAGE_ID,
      locale: this.SERVICE_LOCALE.get(),
      org_id: this.STORE_ORG.selected_org_id,
    })

    // mở tab mới
    this.SERVICE_WINDOW_ACTION.openNewTab(`${URI}/${path}?${QS}`)
  }
  openPageAnalytic() {
    throw new NotImplementedError()
  }
  openPageChatbot() {
    throw new NotImplementedError()
  }
  openMerchant() {
    throw new NotImplementedError()
  }
  openSystemDashboard() {
    throw new NotImplementedError()
  }
}
