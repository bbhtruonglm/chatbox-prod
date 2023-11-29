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
            <div class="h-[calc(100vh_-_217px)] scrollbar-vertical overflow-hidden overflow-y-auto">
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
                        <div class="mt-3 text-sm text-slate-500">
                            {{ $t('v1.view.main.dashboard.nav.select_page') }}
                        </div>
                        <div class="relative">
                            <div @click="is_show_select_page = !is_show_select_page"
                                class="rounded-full h-[40px] border flex items-center cursor-pointer">
                                <div class="w-[calc(100%_-_25px)] flex items-center">
                                    <template v-if="selected_page">
                                        <PageAvatar class="rounded-full ml-[6px]" size="30"
                                            :page_id="selected_page?.page?.fb_page_id"
                                            :page_type="selected_page?.page?.type"
                                            :page_avatar="selected_page?.page?.avatar" />
                                        <div class="w-[calc(100%_-_36px)] px-2 truncate">
                                            {{ selected_page?.page?.name }}
                                        </div>
                                    </template>
                                    <div v-else class="text-xs text-slate-500 pl-2">
                                        {{ $t('v1.view.main.dashboard.widget.select_page') }}
                                    </div>
                                </div>
                                <img src="@/assets/icons/arrow-down.svg" class="w-[15px] h-[15px]" />
                            </div>
                            <div v-if="is_show_select_page"
                                class="absolute top-[45px] border rounded-lg py-2 mt-1 scrollbar-vertical overflow-hidden overflow-y-auto h-[150px] bg-slate-100 z-[10] w-full">
                                <div @click="selected_page = page; is_show_select_page = false"
                                    v-for="page of pageStore.active_page_list"
                                    class="cursor-pointer flex items-center mb-2 hover:bg-orange-100">
                                    <PageAvatar class="rounded-full ml-[6px]" size="30" :page_id="page?.page?.fb_page_id"
                                        :page_type="page?.page?.type" :page_avatar="page?.page?.avatar" />
                                    <div class="ml-2">
                                        {{ page?.page?.name }}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <template v-if="selected_page">
                            <div class="mt-3 text-sm text-slate-500">
                                {{ $t('v1.view.main.dashboard.widget.role') }}
                            </div>
                            <div>
                                <div @click="role.value = !role.value" v-for="role of role_list"
                                    class="flex items-center border-b py-1 cursor-pointer">
                                    <div class="w-[25px] h-[25px]">
                                        <img :src="role.icon" class="w-full h-full" />
                                    </div>
                                    <div class="ml-3 w-[calc(100%_-_77px)]">
                                        <div class="truncate">
                                            {{ role.title }}
                                        </div>
                                        <div class="text-slate-500 truncate">
                                            {{ role.description }}
                                        </div>
                                    </div>
                                    <label class="relative inline-flex items-center cursor-pointer">
                                        <input disabled v-model="role.value" type="checkbox" class="sr-only peer">
                                        <div
                                            class="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all  peer-checked:bg-orange-600">
                                        </div>
                                    </label>
                                </div>
                            </div>
                            <div class="mt-3 text-sm text-slate-500">
                                {{ $t('v1.view.main.dashboard.widget.position') }}
                            </div>
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
                            <div class="mt-3 text-sm text-slate-500">
                                {{ $t('v1.view.main.dashboard.widget.size') }}
                            </div>
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
                            <div class="mt-3 text-sm text-slate-500">
                                {{ $t('v1.view.main.dashboard.widget.staff_group') }}
                            </div>
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
                            <div class="mt-3 text-sm text-slate-500">
                                {{ $t('v1.view.main.dashboard.widget.special') }}
                            </div>
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
import { usePageStore } from '@/stores'
import { useI18n } from 'vue-i18n'
import { watch } from 'vue'
import { map, mapValues } from 'lodash'
import { get_page_group_staff } from '@/service/api/chatbox/n4-service'
import { check_page_install_widget, install_widget } from '@/service/api/chatbox/n5-app'
import { openPopup } from '@/service/function'

import Modal from '@/components/Modal.vue'
import FilterButton from '@/views/Main/Dashboard/Chat/LeftBar/FilterModal/FilterButton.vue'
import PageAvatar from '@/components/Avatar/PageAvatar.vue'

import conversationContactSvg from '@/assets/icons/conversation_contact.svg'
import conversationLabelSvg from '@/assets/icons/conversation_label.svg'
import conversationLastNoteSvg from '@/assets/icons/conversation_last_note.svg'
import conversationMessageSvg from '@/assets/icons/conversation_message.svg'
import conversationStaffSvg from '@/assets/icons/conversation_staff.svg'
import publicProfileSvg from '@/assets/icons/public_profile.svg'
import conversationChatbotSvg from '@/assets/imgs/chatbox.svg'

import type { ComponentRef } from '@/service/interface/vue'
import type { AppInfo, AppInstalledPosition, AppInstalledSize } from '@/service/interface/app/widget'
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

const pageStore = usePageStore()

/**các quyền có thể cài đặt */
const role_list = ref<{
    [index: string]: {
        title: string
        description: string
        icon: string
        value: boolean
    }
}>({
    public_profile: {
        title: $t('v1.view.main.dashboard.widget.role_list.public_profile.title'),
        description: $t('v1.view.main.dashboard.widget.role_list.public_profile.description'),
        icon: publicProfileSvg,
        value: false
    },
    conversation_message: {
        title: $t('v1.view.main.dashboard.widget.role_list.conversation_message.title'),
        description: $t('v1.view.main.dashboard.widget.role_list.conversation_message.description'),
        icon: conversationMessageSvg,
        value: false
    },
    conversation_contact: {
        title: $t('v1.view.main.dashboard.widget.role_list.conversation_contact.title'),
        description: $t('v1.view.main.dashboard.widget.role_list.conversation_contact.description'),
        icon: conversationContactSvg,
        value: false
    },
    conversation_label: {
        title: $t('v1.view.main.dashboard.widget.role_list.conversation_label.title'),
        description: $t('v1.view.main.dashboard.widget.role_list.conversation_label.description'),
        icon: conversationLabelSvg,
        value: false
    },
    conversation_last_note: {
        title: $t('v1.view.main.dashboard.widget.role_list.conversation_last_note.title'),
        description: $t('v1.view.main.dashboard.widget.role_list.conversation_last_note.description'),
        icon: conversationLastNoteSvg,
        value: false
    },
    conversation_staff: {
        title: $t('v1.view.main.dashboard.widget.role_list.conversation_staff.title'),
        description: $t('v1.view.main.dashboard.widget.role_list.conversation_staff.description'),
        icon: conversationStaffSvg,
        value: false
    },
    conversation_chatbot: {
        title: $t('v1.view.main.dashboard.widget.role_list.conversation_chatbot.title'),
        description: $t('v1.view.main.dashboard.widget.role_list.conversation_chatbot.description'),
        icon: conversationChatbotSvg,
        value: false
    },
})
/**ref của modal */
const install_widget_ref = ref<ComponentRef>()
/**dữ liệu của trang được chọn */
const selected_page = ref<PageData>()
/**có hiện chọn trang không */
const is_show_select_page = ref(false)
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
            access_role_select: mapValues(role_list.value, role => role.value),
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
        role_list.value[role].value = is_active
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