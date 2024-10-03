import { N4Serivce } from '@/utils/api/N4Serivce'

/**kết quả đăng nhập */
export interface LoginRes {
  /**id người dùng mới nhất */
  user_id?: string
  /**AS_ID của fb */
  fb_staff_id?: string
  /**id gốc của mongo */
  _id?: string
  /**jwt để truy cập */
  access_token?: string
}

/**gọi API xác thực truy cập */
export class N4SerivcePublicOauth extends N4Serivce {
  constructor(path: string) {
    // gọi API module xác thực
    super(`public/oauth/${path}`)
  }
}

/**gọi API xác thực truy cập của FB */
export class N4SerivcePublicOauthFacebok extends N4SerivcePublicOauth {
  constructor() {
    // gọi API module xác thực của FB
    super('facebook')
  }

  /**api đăng nhâp */
  public async login(access_token: string): Promise<LoginRes> {
    // gọi api
    return this.post('login', { access_token })
  }
}
/**gọi API xác thực truy cập email */
export class N4SerivcePublicOauthBasic extends N4SerivcePublicOauth {
  constructor() {
    // gọi API module xác thực của FB
    super('basic')
  }

  /**api đăng nhâp */
  public async login(email: string, password: string): Promise<LoginRes> {
    // gọi api
    return this.post('login', { email, password })
  }
}
