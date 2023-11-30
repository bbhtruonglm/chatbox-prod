<template>
    <div :class="{ 'md:grid-cols-3 xl:grid-cols-4': commonStore.dashboard_toggle_nav }"
        class="h-full overflow-hidden scrollbar-vertical overflow-y-auto grid grid-cols-1 pb-5 md:grid-cols-2 gap-2 md:gap-4 xl:grid-cols-3">
        <Item v-for="widget of widget_list" @click="openInstallWidget(widget)" :widget="widget" />
    </div>
    <template>
        <InstallWidget ref="install_widget_ref" :widget="selected_widget" />
    </template>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useCommonStore } from '@/stores'
import { get_market_widget } from '@/service/api/chatbox/n5-app'
import { toastError } from '@/service/helper/alert'
import { waterfall } from 'async'

import InstallWidget from '@/views/Main/Dashboard/Widget/InstallWidget.vue'
import Item from '@/views/Main/Dashboard/Widget/Item.vue'

import type { AppInfo } from '@/service/interface/app/widget'
import type { CbError } from '@/service/interface/function'
import type { ComponentRef } from '@/service/interface/vue'

const $emit = defineEmits(['is_loading'])

const commonStore = useCommonStore()

/**phân trang */
const LIMIT = 30
/**phân trang */
const skip = ref(0)
/**danh sách widget trên chợ */
const widget_list = ref<AppInfo[]>()
/**ref của modal cài đặt widget */
const install_widget_ref = ref<ComponentRef>()
/**widget được chọn để cài đặt */
const selected_widget = ref<AppInfo>()

onMounted(() => getWidget())

/**mở modal cải đặt widget */
function openInstallWidget(widget: AppInfo) {
    // gán giá trị cho widget được chọn
    selected_widget.value = widget

    // mở modal
    install_widget_ref.value.toggleModal()
}
/**lấy danh sách widget */
function getWidget() {
    waterfall([
        // * loading
        (cb: CbError) => {
            $emit('is_loading', true)

            cb()
        },
        // * lấy danh sách từ api v1
        (cb: CbError) => get_market_widget({
            status: 'APPROVED',
            _type: 'marketplace',
            skip: skip.value,
            limit: LIMIT
        }, (e, r) => {
            if (e) return cb(e)

            widget_list.value = r
            cb()
        })
    ], e => {
        $emit('is_loading', false)

        if (e) return toastError(e)
    })
}
</script>