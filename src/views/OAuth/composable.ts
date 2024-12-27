import { useCommonStore } from '@/stores'
import { N4SerivcePublicOauthFacebok } from '@/utils/api/N4Service/Oauth'
import { error } from '@/utils/decorator/Error'
import { loadingV2 } from '@/utils/decorator/Loading'
import { LocalStorage, type ILocalStorage } from '@/utils/helper/LocalStorage'
import { container, singleton } from 'tsyringe'
import { useRouter } from 'vue-router'

/**các hàm composable của OAuth */
export function composableOAuth() {
  const commonStore = useCommonStore()
  const $router = useRouter()

  /**class xử lý đăng nhập */
  @singleton()
  class ServiceOAuth {
    /**
     * @param API_OAUTH_FB API đăng nhập
     * @param SERVICE_LOCAL_STORAGE service quản lý local storage
     */
    constructor(
      private readonly API_OAUTH_FB = container.resolve(
        N4SerivcePublicOauthFacebok
      ),
      private readonly SERVICE_LOCAL_STORAGE: ILocalStorage = container.resolve(
        LocalStorage
      )
    ) {}

    /**đăng nhập chatbox bằng token fb */
    @loadingV2(commonStore, 'is_loading_full_screen')
    @error()
    async loginFb(access_token: string) {
      /**jwt đại diện cho người dùng */
      const { access_token: JWT } = await this.API_OAUTH_FB.login(
        access_token,
        this.SERVICE_LOCAL_STORAGE.getItem('ref')
      )

      // lưu token vào local storage
      this.SERVICE_LOCAL_STORAGE.setItem('access_token', JWT)

      // chuyển hướng vào dashboard
      $router.push('/dashboard')
    }
  }

  return { ServiceOAuth }
}
