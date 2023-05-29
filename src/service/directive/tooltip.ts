/**
 * lib tooltip tự viết
 * 
 * cú pháp:
 * v-tooltip:<top | bottom | left | right>.tooltip="<variable>"
 * 
 * ví dụ:
 * v-tooltip:top.tooltip="$t('v1.common.ghtk')"
 * v-tooltip:bottom.tooltip="`Xin chào`"
 */

import type { App, DirectiveBinding } from 'vue'

enum Position {
    top,
    right,
    bottom,
    left,
}

const init = (el: any, binding: DirectiveBinding): void => {
    let position: keyof typeof Position | any = binding.arg || 'top'
    let tooltip_text: string = binding.value || 'This is tooltip'

    el.setAttribute('position', position)
    el.setAttribute('tooltip', tooltip_text)
}

export const loadTooltip = (APP: App): void => {
    APP.directive('tooltip', {
        mounted(el: any, binding: DirectiveBinding): void { init(el, binding) },
        updated(el: any, binding: DirectiveBinding): void { init(el, binding) }
    })
}