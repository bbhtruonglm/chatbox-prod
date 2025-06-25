import { getItem } from '@/service/helper/localStorage'
import { singleton } from 'tsyringe'

/** Sự kiện trigger */
@singleton()
export class TriggerEventRef {
  /** hàm gửi tin nhắn trigger */
  async sendMessage(text: string) {
    /** id cần gửi tới */
    const CLIENT_ID = getItem('client_id')

    /** link api */
    const URL = 'https://chatbox-public-v2.botbanhang.vn/app/send_message'

    /** Dữ liệu header thêm vào api */
    const HEADERS = {
      Authorization: '4edfa08221104f8391a573d30c3a1ec7',
      'Content-Type': 'application/json',
    }

    /** dữ liệu gửi đi */
    const BODY = JSON.stringify({
      page_id: '1706801539392655',
      client_id: CLIENT_ID,
      is_note: true,
      message: {
        text: text,
      },
    })

    try {
      /** kết quả trả về */
      const RES = await fetch(URL, {
        method: 'POST',
        headers: HEADERS,
        body: BODY,
      })

      // nếu không thành công thì in ra lỗi
      if (!RES.ok) {
        console.log('Lỗi')
      }

      /** kết quả json */
      const RESULT = RES.json()

      // trả về kết quả
      return RESULT
    } catch (error) {
      console.error('Error sending message:', error)
      throw error
    }
  }

  /** gửi tin nhắn đánh dấu đăng nhập với facebook */
  async sendMessageLoginFacebook() {    
    this.sendMessage('Đã click đăng nhập với Facebook')
  }

  /** gửi tin nhắn đánh dấu đăng nhập với email */
  async sendMessageLoginEmail(email: string) {
    this.sendMessage('Đã click đăng nhập với email \n Email: '+ email)
  }

  /** gửi tin nhắn đánh dấu đăng ký với email */
  async sendMessageRegisterEmail(email: string) {
    this.sendMessage('Đã click đăng ký với email \n Email: '+ email)
  }
}
