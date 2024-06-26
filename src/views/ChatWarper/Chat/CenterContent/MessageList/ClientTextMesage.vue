<template>
  <div
    @click="onClickMessage"
    v-html="renderText()"
    :class="{
      'border border-red-500': calcIsClientRepSlow(
        current_message?.fb_page_id,
        current_message?.time || current_message?.createdAt,
        current_index,
        list_message
      ),
    }"
    class="message-box break-words whitespace-pre-line bg-white z-1"
  />
</template>
<script setup lang="ts">
import { calcIsClientRepSlow, getPageInfo } from '@/service/function'
import { copyToClipboard } from '@/service/helper/copyWithAlert'
import { differenceInMinutes } from 'date-fns'

import type { MessageInfo } from '@/service/interface/app/message'

const $props = withDefaults(
  defineProps<{
    /**dữ liệu của tin hiện tại */
    current_message: MessageInfo
    /**vị trí của tin nhắn hiện tại */
    current_index: number
    /**toàn bộ danh sách tin nhắn */
    list_message: MessageInfo[]
  }>(),
  {}
)

/**xử lý chuỗi tin nhắn trước khi hiển thị */
function renderText() {
  /**tin nhắn văn bản của khách */
  let text =
    $props.current_message?.message_text ||
    $props.current_message?.postback_title ||
    ''

  let regex_phone =
    /[\/]?(?:[+]84|0)(?:[\-\.\s])?[35789]+[\-\.\s]?\d{1}?[\-\.\s]?\d{1}?[\-\.\s]?\d{1}?[\-\.\s]?\d{1}?[\-\.\s]?\d{1}?[\-\.\s]?\d{1}?[\-\.\s]?\d{1}?[\-\.\s]?\d{1}/
  let regex_email =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$|([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/gi
  let regex_url = /((http|https)?:\/\/[^\s]+)/g

  let phone_regex = regex_phone.exec(text)
  let email_regex = regex_email.exec(text)
  let url_regex = regex_url.exec(text)

  // Check phone regex contain url
  if (phone_regex && phone_regex !== null && url_regex && url_regex !== null) {
    let isExistPhoneUrl = url_regex[0].includes(phone_regex[0])
    if (isExistPhoneUrl) phone_regex = null
  }

  // Check if phone has slash
  if (phone_regex && phone_regex !== null) {
    let hasSlash = phone_regex[0].includes('/')
    if (hasSlash) phone_regex = null
  }

  if (
    phone_regex &&
    phone_regex !== null &&
    email_regex &&
    email_regex !== null
  ) {
    let phone = phone_regex[0]
    let email = email_regex[0]
    let textChange = text
      .replace(phone, ` <span class="phone-detect">${phone.trim()}</span>`)
      .replace(email, ` <span class="email-detect">${email.trim()}</span>`)
    return textChange
  } else if (
    phone_regex &&
    phone_regex !== null &&
    url_regex &&
    url_regex !== null
  ) {
    let phone = phone_regex[0]
    let url = url_regex[0]
    let textChange = text
      .replace(phone, ` <span class="phone-detect">${phone.trim()}</span>`)
      .replace(
        url,
        `<a class="link-detect" href="${url}" target="_blank">${url}</a>`
      )
    return textChange
  } else if (
    email_regex &&
    email_regex !== null &&
    url_regex &&
    url_regex !== null
  ) {
    let email = email_regex[0]
    let url = url_regex[0]
    let textChange = text
      .replace(email, ` <span class="email-detect">${email.trim()}</span>`)
      .replace(
        url,
        `<a class="link-detect" href="${url}" target="_blank">${url}</a>`
      )
    return textChange
  } else if (
    phone_regex &&
    phone_regex !== null &&
    email_regex &&
    email_regex !== null &&
    url_regex &&
    url_regex !== null
  ) {
    let phone = phone_regex[0]
    let email = email_regex[0]
    let url = url_regex[0]
    let textChange = text
      .replace(phone, ` <span class="phone-detect">${phone.trim()}</span>`)
      .replace(email, ` <span class="email-detect">${email.trim()}</span>`)
      .replace(
        url,
        `<a class="link-detect" href="${url}" target="_blank">${url}</a>`
      )
    return textChange
  } else if (phone_regex && phone_regex !== null) {
    let phone = phone_regex[0]
    let textChange = text.replace(
      phone,
      ` <span class="phone-detect">${phone.trim()}</span>`
    )
    return textChange
  } else if (email_regex && email_regex !== null) {
    let email = email_regex[0]
    let textChange = text.replace(
      email,
      ` <span class="email-detect">${email.trim()}</span>`
    )
    return textChange
  } else if (url_regex && url_regex !== null) {
    let url = url_regex[0]
    let textChange = text.replace(
      url,
      ` <a class="link-detect" href="${url}" target="_blank">${url}</a>`
    )
    return textChange
  } else {
    return text
  }
}
/**xử lý sự kiện click vào tin nhắn */
function onClickMessage($event: MouseEvent) {
  /**mục tiêu thực tế được click */
  const TARGET = $event.target as HTMLElement

  if (!['phone-detect', 'email-detect'].includes(TARGET.className)) return

  /**giá trị cấn copy */
  const VALUE = TARGET.innerText

  copyToClipboard(VALUE)
}
</script>
<style lang="scss">
.phone-detect,
.email-detect {
  @apply cursor-copy text-white rounded px-1 bg-orange-500 text-sm;
}

.link-detect {
  @apply text-blue-500 underline;
}
</style>
