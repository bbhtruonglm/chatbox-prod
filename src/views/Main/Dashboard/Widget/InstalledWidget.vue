<template>
    <div class="h-full overflow-hidden scrollbar-vertical overflow-y-auto pb-5">
        <div class="grid grid-cols-1 md:grid-cols-4">
            <div />
            <SelectPage class="col-span-2" :selected_page="selected_page"
                @update_select_page="$event => selected_page = $event" />
            <div />
        </div>
       
        <template v-if="selected_page">
            <Title v-if="app_installed_list?.filter(app => app.active_widget)?.length"
                :title="$t('v1.view.main.dashboard.widget.installed.active')" />
            <div :class="{ 'md:grid-cols-3 xl:grid-cols-4': commonStore.dashboard_toggle_nav }"
                class="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4 xl:grid-cols-3">
                <template v-for="app of app_installed_list">
                    <Item @setting="openSettingWidget(app)" @link="linkApp(app)" @toggle="toggleApp(app)"
                        @delete="deleteApp(app._id)" v-if="app.active_widget" :widget="app.snap_app" :app="app"
                        :is_control="true" />
                </template>
            </div>
            <button 
                v-if="app_installed_list.length > 0" 
                @click="openArrangeWidget()"
                class="px-2 py-1.5 bg-orange-500 text-white rounded-lg text-sm mt-2"
            >
            {{ $t('v1.view.main.dashboard.widget.arrange') }}
            </button>
            <Title v-if="app_installed_list?.filter(app => !app.active_widget && app.status === 'SUCCESS')?.length" :title="$t('v1.view.main.dashboard.widget.installed.unactive')" />
            <div :class="{ 'md:grid-cols-3 xl:grid-cols-4': commonStore.dashboard_toggle_nav }"
                class="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4 xl:grid-cols-3">
                <template v-for="app of app_installed_list">
                    <Item @setting="openSettingWidget(app)" @link="linkApp(app)" @toggle="toggleApp(app)"
                        @delete="deleteApp(app._id)" v-if="!app.active_widget && app.status === 'SUCCESS'"
                        :widget="app.snap_app" :app="app" :is_control="true" />
                </template>
            </div>
            <Title v-if="app_installed_list?.filter(app => !app.active_widget && app.status === 'INIT')?.length" :title="$t('v1.view.main.dashboard.widget.installed.link')" />
            <div :class="{ 'md:grid-cols-3 xl:grid-cols-4': commonStore.dashboard_toggle_nav }"
                class="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4 xl:grid-cols-3">
                <template v-for="app of app_installed_list">
                    <Item @setting="openSettingWidget(app)" @link="linkApp(app)" @toggle="toggleApp(app)"
                        @delete="deleteApp(app._id)" v-if="!app.active_widget && app.status === 'INIT'"
                        :widget="app.snap_app" :app="app" :is_control="true" />
                </template>
            </div>
        </template>

        
    </div>
    <template>
        <SettingWidget ref="setting_widget_ref" :widget="selected_widget" :group_staff_list="group_staff_list"
            @update_widget="onUpdateWidget" />
    </template>
    <template>
        <ArrangeWidget ref="arrange_widget_ref" :widgets="app_installed_list" />
    </template>
</template>
<script setup lang="ts">
import { ref, watch } from 'vue'
import { get_installed_widget, uninstall_widget, update_widget } from '@/service/api/chatbox/n5-app'
import { useCommonStore } from '@/stores'
import { useI18n } from 'vue-i18n'
import { toggle_loading } from '@/service/helper/async'
import { confirm, toast, toastError } from '@/service/helper/alert'
import { waterfall } from 'async'
import { findIndex, remove } from 'lodash'
import { openPopup } from '@/service/function'
import { get_page_group_staff } from '@/service/api/chatbox/n4-service'
import { copy } from '@/service/helper/format'

import SelectPage from '@/views/Main/Dashboard/Widget/SelectPage.vue'
import Title from '@/views/Main/Dashboard/Widget/Title.vue'
import Item from '@/views/Main/Dashboard/Widget/Item.vue'
import SettingWidget from '@/views/Main/Dashboard/Widget/SettingWidget.vue'
import ArrangeWidget from './ArrangeWidget.vue'

import type { PageData } from '@/service/interface/app/page'
import type { AppInstalledInfo, InputUpdateWidget } from '@/service/interface/app/widget'
import type { GroupStaffInfo } from '@/service/interface/app/page'
import type { CbError } from '@/service/interface/function'
import type { ComponentRef } from '@/service/interface/vue'

const $emit = defineEmits(['is_loading'])

const commonStore = useCommonStore()
const { t: $t } = useI18n()

/**dữ liệu của trang được chọn */
const selected_page = ref<PageData>()
/**danh sách các widget đã cài đặt của trang */
const app_installed_list = ref<AppInstalledInfo[]>([])
/**widget được chọn để cài đặt */
const selected_widget = ref<AppInstalledInfo>()
/**ref của modal cài đặt widget */
const setting_widget_ref = ref<ComponentRef>()
/**ref của modal cài đặt widget */
const arrange_widget_ref = ref<ComponentRef>()
/**danh sách cac nhóm nhân viên của trang đang chọn */
const group_staff_list = ref<GroupStaffInfo[]>([])

watch(() => selected_page.value, () => {
    getInstalledWidget()
    getGroupStaff()
})

/**update giá trị của widget trong mảng */
function onUpdateWidget($event: InputUpdateWidget) {
    // Tìm chỉ số của đối tượng
    let index = findIndex(app_installed_list.value, { _id: $event._id })

    let temp = app_installed_list.value[index]

    if (!temp) return

    // cập nhật các giá trị
    if ($event.position)
        temp.position = $event.position
    if ($event.app_installed_size)
        temp.app_installed_size = $event.app_installed_size
    if ($event.access_group)
        temp.access_group = $event.access_group
    if ($event.access_role_select)
        temp.access_role_select = $event.access_role_select
    if ($event.hide_pc)
        temp.hide_pc = $event.hide_pc

    app_installed_list.value[index] = temp

    app_installed_list.value = copy(app_installed_list.value)
}
/**gỡ cài đặt ứng dụng */
function deleteApp(id: string) {
    waterfall([
        // * cảnh báo
        (cb: CbError) => confirm(
            'warning',
            $t('v1.view.main.dashboard.widget.installed.delete_warning'),
            $t('v1.view.main.dashboard.widget.installed.delete_description'),
            (e, r) => {
                if (e) return

                cb()
            }
        ),
        // * loading
        (cb: CbError) => {
            toggle_loading(true)

            cb()
        },
        // * gọi api xoá
        (cb: CbError) => uninstall_widget(id, (e, r) => {
            if (e) return cb(e)

            cb()
        }),
        // * loại bỏ data khỏi frontend
        (cb: CbError) => {
            remove(app_installed_list.value, app => app._id === id)

            cb()
        },
    ], e => {
        toggle_loading(false)

        if (e) return toastError(e)

        toast('success', $t('v1.view.main.dashboard.widget.installed.delete_success'))
    })
}
/**lấy toàn bộ danh sách widget đã cài cho page này */
function getInstalledWidget() {
    if (!selected_page.value?.page?.fb_page_id) return

    $emit('is_loading', true)

    get_installed_widget({
        _type: 'short-time-token',
        skip: 0,
        limit: 40,
        fb_page_id: selected_page.value?.page?.fb_page_id as string
    }, (e, r) => {
        $emit('is_loading', false)

        if (r) app_installed_list.value = r
    })
}
/**lấy danh sách các nhóm nhân viên của trang */
function getGroupStaff() {
    if (!selected_page.value?.page?.fb_page_id) return

    get_page_group_staff({
        fb_page_id: selected_page.value?.page?.fb_page_id as string,
        skip: 0,
        limit: 40,
    }, (e, r) => {
        if (r) group_staff_list.value = r
    })
}
/**ẩn hiện ứng dụng */
function toggleApp(app: AppInstalledInfo) {
    waterfall([
        // * cảnh báo
        (cb: CbError) => confirm(
            'warning',
            app?.active_widget
                ? $t('v1.view.main.dashboard.widget.installed.unactive_warning')
                : $t('v1.view.main.dashboard.widget.installed.active_warning'),
            app?.active_widget
                ? $t('v1.view.main.dashboard.widget.installed.unactive_description')
                : $t('v1.view.main.dashboard.widget.installed.active_description'),
            (e, r) => {
                if (e) return

                cb()
            }
        ),
        // * loading
        (cb: CbError) => {
            toggle_loading(true)

            cb()
        },
        // * gọi api cập nhật
        (cb: CbError) => update_widget({
            _id: app?._id,
            active_widget: !app?.active_widget
        }, (e, r) => {
            if (e) return cb(e)

            cb()
        }),
        // * cập nhật frontend
        (cb: CbError) => {
            app.active_widget = !app.active_widget

            cb()
        },
    ], e => {
        toggle_loading(false)

        if (e) return toastError(e)

        toast('success', $t('v1.view.main.dashboard.widget.installed.active_success'))
    })
}
/**kết nối lại ứng dụng */
function linkApp(app: AppInstalledInfo) {
    waterfall([
        // * cảnh báo
        (cb: CbError) => confirm(
            'warning',
            $t('v1.view.main.dashboard.widget.installed.link_warning'),
            $t('v1.view.main.dashboard.widget.installed.link_description'),
            (e, r) => {
                if (e) return

                cb()
            }
        ),
        // * mở popup
        (cb: CbError) => {
            openPopup(
                `${app?.snap_app?.url_auth}?page_id=${selected_page.value?.page?.fb_page_id}&access_token=${app?.access_token}`
            )

            cb()
        },
    ])
}
/**mở modal cải đặt widget */
function openSettingWidget(widget: AppInstalledInfo) {
    // gán giá trị cho widget được chọn
    selected_widget.value = widget

    // mở modal
    setting_widget_ref.value.toggleModal()
}
/**mở modal sắp xếp widget */
function openArrangeWidget() {
    arrange_widget_ref.value.toggleModal()
}
</script>