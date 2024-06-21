<template>
    <Modal ref="install_widget_ref">
        <template v-slot:header>
            <div class="flex items-center">
                <object :data="widget?.icon" type="image/png" class="w-[20px] h-[20px]">
                    <img src="@/assets/imgs/chatbox.svg" class="w-[20px] h-[20px]" />
                </object>
                <div class="ml-1">
                    {{ widget?.name }}
                </div>
            </div>
        </template>
        <template v-slot:body>
            <div class="h-[calc(100vh_-_217px)] overflow-y-auto">
                <div class="text-sm text-slate-500 whitespace-break-spaces">
                    {{ widget?.description }}
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-x-5">
                    <div>
                        <div class="font-semibold mt-3 text-sm">
                            {{ $t('v1.view.main.dashboard.nav.info') }}
                        </div>
                        <div v-html="widget?.document" class="border p-1 rounded-lg" />
                    </div>
                    <div>
                        <div class="font-semibold mt-3 text-sm">
                            {{ $t('v1.common.config') }}
                        </div>
                        <Title :title="$t('v1.view.main.dashboard.nav.select_page')" />
                        <SelectPage :selected_page="selected_page" @update_select_page="$event => selected_page = $event" />
                        <template v-if="selected_page">
                            <Title :title="$t('v1.view.main.dashboard.widget.role')" />
                            <div>
                                <Role :access_role_select="access_role_select"
                                    @update="$event => access_role_select = $event" />
                            </div>
                            <Title :title="$t('v1.view.main.dashboard.widget.position')" />
                            <div class="mt-1 grid grid-cols-2">
                                <div @click="position = 'RIGHT'" class="flex items-center cursor-pointer">
                                    <input v-model="position" value="RIGHT" type="radio"
                                        class="accent-orange-600 w-[20px] h-[20px]">
                                    <div class="ml-2">
                                        {{ $t('v1.view.main.dashboard.widget.position_list.right') }}
                                    </div>
                                </div>
                                <div @click="position = 'BOTTOM'" class="flex items-center cursor-pointer">
                                    <input v-model="position" value="BOTTOM" type="radio"
                                        class="accent-orange-600 w-[20px] h-[20px]">
                                    <div class="ml-2">
                                        {{ $t('v1.view.main.dashboard.widget.position_list.bottom') }}
                                    </div>
                                </div>
                            </div>
                            <Title :title="$t('v1.view.main.dashboard.widget.size')" />
                            <div class="mt-1 grid grid-cols-3">
                                <div @click="size = 'MINIMUM'" class="flex items-center cursor-pointer">
                                    <input v-model="size" value="MINIMUM" type="radio"
                                        class="accent-orange-600 w-[20px] h-[20px]">
                                    <div class="ml-2">
                                        {{ $t('v1.view.main.dashboard.widget.size_list.small') }}
                                    </div>
                                </div>
                                <div @click="size = 'MEDIUM'" class="flex items-center cursor-pointer">
                                    <input v-model="size" value="MEDIUM" type="radio"
                                        class="accent-orange-600 w-[20px] h-[20px]">
                                    <div class="ml-2">
                                        {{ $t('v1.view.main.dashboard.widget.size_list.medium') }}
                                    </div>
                                </div>
                                <div @click="size = 'FULL'" class="flex items-center cursor-pointer">
                                    <input v-model="size" value="FULL" type="radio"
                                        class="accent-orange-600 w-[20px] h-[20px]">
                                    <div class="ml-2">
                                        {{ $t('v1.view.main.dashboard.widget.size_list.big') }}
                                    </div>
                                </div>
                            </div>
                            <Title :title="$t('v1.view.main.dashboard.widget.staff_group')" />
                            <div class="mt-1 grid grid-cols-3 gap-y-2">
                                <div @click="group_staff.is_select = !group_staff.is_select"
                                    v-for="group_staff of group_staff_list" class="flex items-center cursor-pointer">
                                    <input v-model="group_staff.is_select" type="checkbox"
                                        class="accent-orange-600 w-[20px] h-[20px]">
                                    <div class="ml-2">
                                        {{ group_staff.name }}
                                    </div>
                                </div>
                            </div>
                            <Title :title="$t('v1.view.main.dashboard.widget.special')" />
                            <div class="mt-1 grid grid-cols-3 gap-y-2">
                                <div @click="is_hide_pc = !is_hide_pc" class="flex items-center cursor-pointer">
                                    <input v-model="is_hide_pc" type="checkbox" class="accent-orange-600 w-[20px] h-[20px]">
                                    <div class="ml-2">
                                        {{ $t('v1.view.main.dashboard.widget.special_list.hide_pc') }}
                                    </div>
                                </div>
                            </div>
                        </template>
                    </div>
                </div>
            </div>
        </template>
        <template v-slot:footer>
            <div class="grid grid-cols-2 gap-2">
                <FilterButton @click="toggleModal" type="text-slate-500 hover:text-white hover:bg-slate-500"
                    :title="$t('v1.common.cancel')" />
                <FilterButton @click="installWidget"
                    type="border-orange-500 text-orange-500 hover:text-white hover:bg-orange-500"
                    :title="$t('v1.common.setting')" />
            </div>
        </template>
    </Modal>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { watch } from 'vue'
import { map, set } from 'lodash'
import { get_page_group_staff } from '@/service/api/chatbox/n4-service'
import { check_page_install_widget, install_widget } from '@/service/api/chatbox/n5-app'
import { openPopup } from '@/service/function'

import Modal from '@/components/Modal.vue'
import FilterButton from '@/views/ChatWarper/Menu/FilterModal/FilterButton.vue'
import SelectPage from '@/views/Dashboard/Widget/SelectPage.vue'
import Title from '@/views/Dashboard/Widget/Title.vue'
import Role from '@/views/Dashboard/Widget/Role.vue'

import type { ComponentRef } from '@/service/interface/vue'
import type { AppInfo, AppInstalledPosition, AppInstalledSize, AccessRoleInfo } from '@/service/interface/app/widget'
import type { GroupStaffInfo } from '@/service/interface/app/page'
import type { PageData } from '@/service/interface/app/page'
import { flow } from '@/service/helper/async'
import type { CbError } from '@/service/interface/function'

const $emit = defineEmits(['update_this_pricing'])

const $props = withDefaults(defineProps<{
    /**giá trị widget đang chọn */
    widget?: AppInfo
}>(), {})

const $t = useI18n().t

/**các quyền có thể cài đặt */
const access_role_select = ref<AccessRoleInfo>({})
/**ref của modal */
const install_widget_ref = ref<ComponentRef>()
/**dữ liệu của trang được chọn */
const selected_page = ref<PageData>()
/**vị trí hiển thị của app */
const position = ref<AppInstalledPosition>('RIGHT')
/**kích cỡ */
const size = ref<AppInstalledSize>('MEDIUM')
/**thiết lập ẩn trên máy tính */
const is_hide_pc = ref(false)
/**danh sách cac nhóm nhân viên của trang đang chọn */
const group_staff_list = ref<GroupStaffInfo[]>([])

watch(() => $props.widget, () => setDefaultValueSetting())
watch(() => selected_page.value, () => getGroupStaff())

/**cài đặt widget */
function installWidget() {
    if (!$props.widget?._id || !selected_page.value?.page?.fb_page_id) return

    /**token truyền cho popup để kích hoạt */
    let access_token: string | undefined
    flow([
        // * kiểm tra page đã được cài widget này chưa
        (cb: CbError) => {
            /**xử lý trang truyền lên */
            const TEMP: { [index: string]: {} } = {}
            TEMP[selected_page.value?.page?.fb_page_id as string] = {}

            check_page_install_widget({
                _type: 'check-page-is-installed-app',
                app_id: $props.widget?._id as string,
                list_page: TEMP
            }, (e, r) => {
                if (e) return cb(e)
                if (
                    r?.[selected_page.value?.page?.fb_page_id as string]?.is_installed
                ) return cb($t(`v1.view.main.dashboard.widget.widget_installed`))

                cb()
            })
        },
        // * gọi api cài đặt
        (cb: CbError) => install_widget({
            app_id: $props.widget?._id as string,
            fb_page_id: selected_page.value?.page?.fb_page_id as string,
            position: position.value,
            app_installed_size: size.value,
            access_role_select: access_role_select.value,
            // access_role_select: mapValues(role_list.value, role => role.value),
            access_group: group_staff_list.value?.filter(n => n.is_select)?.map(n => n._id),
            hide_pc: is_hide_pc.value
        }, (e, r) => {
            if (e) return cb(e)

            access_token = r?.access_token
            cb()
        }),
        // * done
        (cb: CbError) => {
            // tắt modal
            toggleModal()

            // mở popup
            openPopup(
                `${$props.widget?.url_auth}?page_id=${selected_page.value?.page?.fb_page_id}&access_token=${access_token}`
            )

            cb()
        },
    ], undefined, true)
}
/**thiết lập các cài đặt mặc định cho widget */
function setDefaultValueSetting() {
    // cài đặt mặc định các quyền mà widget yêu cầu
    map($props.widget?.access_role, (is_active, role) => {
        // bỏ qua id record mongo
        if (role === '_id') return

        // mapping kích hoạt mặc định
        set(access_role_select.value, [role], is_active)
    })
}
/**mở modal của pricing detail */
function toggleModal() {
    install_widget_ref.value.toggleModal()
}
/**lấy danh sách các nhóm nhân viên của trang */
function getGroupStaff() {
    if (!selected_page.value?.page?.fb_page_id) return

    get_page_group_staff({
        fb_page_id: selected_page.value?.page?.fb_page_id,
        skip: 0,
        limit: 40,
    }, (e, r) => {
        group_staff_list.value = r?.map(group_staff => {
            group_staff.is_select = true

            return group_staff
        }) || []
    })
}

defineExpose({ toggleModal })
</script>