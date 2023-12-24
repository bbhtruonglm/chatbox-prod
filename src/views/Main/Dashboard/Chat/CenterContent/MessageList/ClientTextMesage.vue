<template>
    <div @click="onClickMessage" v-html="renderText(text)" :class="{ 'border-2 border-red-600': isAlert() }"
        class="text-sm break-words whitespace-pre-line bg-white rounded-r-2xl rounded-l-md p-2 relative z-1" />
</template>
<script setup lang="ts">
import { getPageInfo } from '@/service/function'
import { copyToClipboard } from '@/service/helper/copyWithAlert'
import { differenceInMinutes } from 'date-fns'

import type { MessageInfo } from '@/service/interface/app/message'

const $props = withDefaults(defineProps<{
    /**nội dung tin nhắn bí mật của page */
    text: string
    /**dữ liệu của tin hiện tại */
    current_message: MessageInfo
    /**vị trí của tin nhắn hiện tại */
    current_index: number
    /**toàn bộ danh sách tin nhắn */
    list_message: MessageInfo[]
}>(), {})

/**xử lý chuỗi tin nhắn trước khi hiển thị */
function renderText(text: string) {
    let regex_phone =
        /[\/]?(?:[+]84|0)(?:[\-\.\s])?[35789]+[\-\.\s]?\d{1}?[\-\.\s]?\d{1}?[\-\.\s]?\d{1}?[\-\.\s]?\d{1}?[\-\.\s]?\d{1}?[\-\.\s]?\d{1}?[\-\.\s]?\d{1}?[\-\.\s]?\d{1}/;
    let regex_email =
        /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$|([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/gi;
    let regex_url = /((http|https)?:\/\/[^\s]+)/g;

    let phone_regex = regex_phone.exec(text);
    let email_regex = regex_email.exec(text);
    let url_regex = regex_url.exec(text);

    console.log(email_regex)

    // Check phone regex contain url
    if (
        phone_regex &&
        phone_regex !== null &&
        url_regex &&
        url_regex !== null
    ) {
        let isExistPhoneUrl = url_regex[0].includes(phone_regex[0]);
        if (isExistPhoneUrl) phone_regex = null;
    }

    // Check if phone has slash
    if (phone_regex && phone_regex !== null) {
        let hasSlash = phone_regex[0].includes("/");
        if (hasSlash) phone_regex = null;
    }

    if (
        phone_regex &&
        phone_regex !== null &&
        email_regex &&
        email_regex !== null
    ) {
        let phone = phone_regex[0];
        let email = email_regex[0];
        let textChange = text
            .replace(phone, ` <span class="phone-detect">${phone.trim()}</span>`)
            .replace(email, ` <span class="email-detect">${email.trim()}</span>`);
        return textChange;
    } else if (
        phone_regex &&
        phone_regex !== null &&
        url_regex &&
        url_regex !== null
    ) {
        let phone = phone_regex[0];
        let url = url_regex[0];
        let textChange = text
            .replace(phone, ` <span class="phone-detect">${phone.trim()}</span>`)
            .replace(url, `<a class="link-detect" href="${url}" target="_blank">${url}</a>`);
        return textChange;
    } else if (
        email_regex &&
        email_regex !== null &&
        url_regex &&
        url_regex !== null
    ) {
        let email = email_regex[0];
        let url = url_regex[0];
        let textChange = text
            .replace(email, ` <span class="email-detect">${email.trim()}</span>`)
            .replace(url, `<a class="link-detect" href="${url}" target="_blank">${url}</a>`);
        return textChange;
    } else if (
        phone_regex &&
        phone_regex !== null &&
        email_regex &&
        email_regex !== null &&
        url_regex &&
        url_regex !== null
    ) {
        let phone = phone_regex[0];
        let email = email_regex[0];
        let url = url_regex[0];
        let textChange = text
            .replace(phone, ` <span class="phone-detect">${phone.trim()}</span>`)
            .replace(email, ` <span class="email-detect">${email.trim()}</span>`)
            .replace(url, `<a class="link-detect" href="${url}" target="_blank">${url}</a>`);
        return textChange;
    } else if (phone_regex && phone_regex !== null) {
        let phone = phone_regex[0];
        let textChange = text.replace(
            phone,
            ` <span class="phone-detect">${phone.trim()}</span>`
        );
        return textChange;
    } else if (email_regex && email_regex !== null) {
        let email = email_regex[0];
        let textChange = text.replace(
            email,
            ` <span class="email-detect">${email.trim()}</span>`
        );
        return textChange;
    } else if (url_regex && url_regex !== null) {
        let url = url_regex[0];
        let textChange = text.replace(
            url,
            ` <a class="link-detect" href="${url}" target="_blank">${url}</a>`
        );
        return textChange;
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
/**có cảnh báo rep chậm không */
function isAlert() {
    /**thời gian rep chậm bị cảnh báo */
    let ALERT_TIME = getPageInfo($props.current_message?.fb_page_id)?.alert_slow_rep_time

    // nếu không bật cảnh báo thì thôi
    if (!ALERT_TIME || ALERT_TIME <= 0) return false

    /**thời gian tin này được nhắn */
    let current_date = $props.current_message?.time || $props.current_message?.createdAt

    if (!current_date) return false

    /**tin nhắn tiếp theo */
    let next_message = $props.list_message?.[$props.current_index + 1]

    // nếu tin tiếp theo không phải là của page thì thôi
    if (!next_message || next_message?.message_type !== 'page') return false

    /**thời gian tin tiếp theo được nhắn */
    let next_date = next_message?.time || next_message?.createdAt

    if (!next_date) return false

    /**khoảng thời gian tính bằng phút giữa 2 tin */
    let duration_minute = differenceInMinutes(new Date(next_date), new Date(current_date))

    // nếu trong khoảng cho phép thì thôi
    if (duration_minute < ALERT_TIME) return false

    return true
}
</script>

<style lang="scss">
.phone-detect,
.email-detect {
    cursor: copy;
    font-weight: 400;
    font-size: 14px;
    color: white;
    border-radius: 4px;
    padding: 1px 5px;
    text-align: center;
    background-color: #ff5f0b;
}

.link-detect {
    color: #007bff
}
</style>