<template>
    <Modal ref="album_ref">
        <template v-slot:header>
            {{ $t('v1.view.main.dashboard.chat.album.title') }}
        </template>
        <template v-slot:body>
            <div class="text-sm relative">
                <div class="absolute top-8 left-[50%] translate-x-[-50%]">
                    <Loading v-if="is_loading" />
                </div>
                <div class="flex border-b mb-2">
                    <div @click="selected_category = 'NEW'"
                        :class="selected_category === 'NEW' ? 'font-medium border-b-2 border-orange-500' : 'font-light'"
                        class="mr-2 cursor-pointer">
                        {{ $t('v1.view.main.dashboard.chat.album.category.new') }}
                    </div>
                    <div @click="selected_category = 'FOLDER'"
                        :class="selected_category === 'FOLDER' ? 'font-medium border-b-2 border-orange-500' : 'font-light'"
                        class="cursor-pointer">
                        {{ $t('v1.view.main.dashboard.chat.album.category.folder') }}
                    </div>
                </div>
                <div class="grid grid-cols-2">
                    <div>
                        <button @click="uploadFileFromDevice"
                            class="rounded-full bg-orange-500 text-white font-medium px-2 flex items-center py-1">
                            <img src="@/assets/icons/upload.svg" />
                            {{ $t('v1.common.upload') }}
                        </button>
                    </div>
                    <div class="font-medium flex justify-end">
                        <div @click="selectAllFile(!isSelectAllFile())"
                            class="flex items-center justify-end cursor-pointer">
                            {{ $t('v1.common.select_all') }}
                            <input :checked="isSelectAllFile()" type="checkbox"
                                class="w-[15px] h-[15px] ml-1 accent-orange-600">
                        </div>
                        <!-- <div class="cursor-pointer">
                            <img src="@/assets/icons/new-folder.svg" />
                        </div> -->
                    </div>
                </div>
                <div
                    @scroll="loadMore"
                    class="h-[calc(100vh_-_300px)] overflow-hidden overflow-y-auto flex justify-center flex-wrap mt-2 content-start">
                    <div v-for="file of file_list" @click="file.is_select = !file.is_select"
                        :class="file.is_select ? 'border-orange-500' : 'border-white'"
                        class="relative w-[110px] h-[100px] m-1 cursor-pointer group border-2  hover:border-orange-500">
                        <div @click.stop="openSettingFile(file)" class="absolute top-1 right-1 hidden group-hover:block">
                            <img src="@/assets/icons/more.svg" />
                        </div>
                        <div class="w-full h-[80px]">
                            <!-- <img src="@/assets/icons/folder.svg" class="w-full h-full" /> -->

                            <img v-if="file.mimetype?.includes('image')" :src="file.url" class="w-full h-full" />
                            <img v-else-if="file.mimetype?.includes('video')" src="@/assets/icons/play.svg"
                                class="w-full h-full" />
                            <img v-else-if="file.mimetype?.includes('audio')" src="@/assets/icons/audio.svg"
                                class="w-full h-full" />
                            <img v-else src="@/assets/icons/file.svg" class="w-full h-full" />
                        </div>
                        <div class="truncate text-center">
                            {{ file.original_name }}
                        </div>
                    </div>
                </div>
            </div>
        </template>
        <template v-slot:footer>
            <div class="grid grid-cols-2 gap-2 border-t pt-2">
                <FilterButton @click="selectAllFile(false)" type="text-slate-500 hover:text-white hover:bg-slate-500"
                    :title="$t('v1.common.cancel')" />
                <FilterButton @click="pickFile"
                    type="border-orange-500 text-orange-500 hover:text-white hover:bg-orange-500"
                    :title="$t('v1.view.main.dashboard.chat.album.select')" />
            </div>
        </template>
    </Modal>
    <Modal @close_modal="onCloseSetting" ref="item_setting_ref">
        <template v-slot:header>
            {{ $t('v1.common.setting') }}
        </template>
        <template v-slot:body>
            <div v-if="selected_folder">
                <input type="text" class="border-2 rounded-md w-full h-[40px] px-2 focus:outline-none"
                    :placeholder="$t('v1.view.main.dashboard.chat.album.name')">
            </div>
        </template>
        <template v-slot:footer>
            <FilterButton v-if="selected_file" @click="deleteFile" type="text-slate-500 hover:text-white hover:bg-slate-500"
                :title="$t('v1.common.delete')" />
            <div v-if="selected_folder" class="grid grid-cols-2 gap-2">
                <FilterButton type="text-slate-500 hover:text-white hover:bg-slate-500" :title="$t('v1.common.delete')" />
                <FilterButton @click="updateInfo"
                    type="border-orange-500 text-orange-500 hover:text-white hover:bg-orange-500"
                    :title="$t('v1.common.update')" />
            </div>
        </template>
    </Modal>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import { eachOfLimit, waterfall } from 'async'
import { read_file_album, upload_file_album, delete_file_album } from '@/service/api/chatbox/n6-static'
import { useConversationStore } from '@/stores'
import { toast, toastError } from '@/service/helper/alert'

import Modal from '@/components/Modal.vue'
import FilterButton from '@/views/Main/Dashboard/Chat/LeftBar/FilterModal/FilterButton.vue'
import Loading from '@/components/Loading.vue'

import type { ComponentRef } from '@/service/interface/vue'
import type { FileInfo } from '@/service/interface/app/album'
import type { CbError } from '@/service/interface/function'
import { useI18n } from 'vue-i18n'
import { remove } from 'lodash'

const $emit = defineEmits(['pick_file'])

const $t = useI18n().t
const conversationStore = useConversationStore()

/**số bản ghi một thời điểm */
const LIMIT = 40

/**đánh dấu có kích hoạt loading hay không */
const is_loading = ref(false)
/**ref của quản lý album */
const album_ref = ref<ComponentRef>()
/**ref của cài đặt item */
const item_setting_ref = ref<ComponentRef>()
/**chọn danh mục nào */
const selected_category = ref<'NEW' | 'FOLDER'>('NEW')
/**id của thư mục đang chọn nếu có */
const selected_folder_id = ref<string>()
/**danh sách tập tin */
const file_list = ref<FileInfo[]>([])
/**đánh dấu đã đọc hết dữ liệu */
const is_done = ref(false)
/**số bản ghi bỏ qua */
const skip = ref(0)
/**file được chọn để cài đặt */
const selected_file = ref<FileInfo>()
/**thư mục được chọn để cài đặt */
const selected_folder = ref<any>()

/**lấy thêm dữ liệu file khi scroll xuống */
function loadMore($event: Event) {
    // nếu đang chạy hoặc đã hết dữ liệu thì thôi
    if (is_loading.value || is_done.value) return

    const DIV = $event.target as HTMLElement

    const SCROLL_TOP = DIV?.scrollTop
    const DIV_HEIGHT = DIV?.offsetHeight
    const SCROLL_HEIGHT = DIV?.scrollHeight

    // kiểm tra xem đã scroll xuống cuối cùng chưa
    if (SCROLL_TOP + DIV_HEIGHT < SCROLL_HEIGHT - 100) return

    getFile()
}
/**xử lý sự kiện khi đóng thiết lập file */
function onCloseSetting() {
    selected_file.value = undefined
}
/**xoá tập tin */
function deleteFile() {
    if (!selected_file.value || is_loading.value) return

    is_loading.value = true

    delete_file_album({
        page_id: conversationStore.select_conversation?.fb_page_id as string,
        file_id: selected_file.value._id
    }, (e, r) => {
        is_loading.value = false

        // xoá khỏi danh sách tập tin
        remove(file_list.value, (file: FileInfo) => file._id === selected_file.value?._id)

        // tắt modal
        item_setting_ref.value.toggleModal()
    })
}
/**cập nhật thông tin folder */
function updateInfo() {

}
/**mở cài đặt tập tin hoặc thư mục */
function openSettingFile(file: FileInfo) {
    selected_file.value = file

    item_setting_ref.value?.toggleModal()
}
/**lấy các tập tin đưa vào danh sách gửi */
function pickFile() {
    // đóng modal
    album_ref.value.toggleModal()

    // lấy dữ liệu của file được chọn
    $emit('pick_file', file_list.value?.filter(file => file.is_select))

    // huỷ bỏ file được chọn
    selectAllFile(false)
}
/**kiểm tra xem có phải đang chọn toàn bộ tập tin không */
function isSelectAllFile() {
    return !file_list.value?.find(n => !n.is_select)
}
/**chọn/huỷ chọn toàn bộ tập tin */
function selectAllFile(value: boolean) {
    file_list.value?.forEach(file => file.is_select = value)
}
/**mở album */
function toggleAlbum() {
    album_ref.value?.toggleModal()

    // reset cờ khi mở modal
    is_done.value = false
    skip.value = 0
    file_list.value = []

    getFile()
}
/**thêm dữ liệu vào danh sách tập tin hiện tại */
function addDataToFileList(data?: FileInfo[]) {
    if (!data?.length) return

    file_list.value?.push(...data?.map(file => {
        // thêm gắn cờ
        file.is_select = false

        return file
    }))
}
/**lấy danh sách tập tin */
function getFile() {
    is_loading.value = true

    waterfall([
        // * đọc file từ server
        (cb: CbError) => read_file_album({
            page_id: conversationStore.select_conversation?.fb_page_id as string,
            folder_id: selected_folder_id.value,
            limit: LIMIT,
            skip: skip.value
        }, (e, r) => {
            if (e) return cb(e)
            if (!r?.length || r?.length < LIMIT) is_done.value = true

            addDataToFileList(r)
            cb()
        }),
        // * next
        (cb: CbError) => {
            skip.value += LIMIT

            cb()
        },
    ], e => {
        is_loading.value = false

        if (e) return toastError(e)
    })
}
/**chọn file từ thiết bị để thêm vào album */
function uploadFileFromDevice() {
    /**input upload file */
    const INPUT = document.createElement('input')

    // thêm các thuộc tính cần thiết
    INPUT.type = 'file'
    INPUT.multiple = true
    INPUT.style.display = 'none'

    // hàm xử lý sau khi upload thành công
    INPUT.onchange = () => {
        is_loading.value = true

        // xử upload file
        eachOfLimit(INPUT.files, 1, (file: File, i, next) => {
            /**dữ liệu upload */
            const FORM = new FormData()
            FORM.append('file', file)

            // upload lên server
            upload_file_album(
                {
                    page_id: conversationStore.select_conversation?.fb_page_id as string,
                    folder_id: selected_folder_id.value
                },
                FORM,
                (e, r) => {
                    if (r) addDataToFileList([r])

                    next()
                }
            )
        }, e => {
            is_loading.value = false

            toast('success', $t('v1.common.success'))
        })

        // xoá input sau khi xong việc
        if (INPUT && INPUT.parentNode) INPUT.parentNode.removeChild(INPUT)
    }

    // thêm input vào html
    document.body.appendChild(INPUT)

    // click vào input
    INPUT.click()
}

defineExpose({ toggleAlbum })
</script>