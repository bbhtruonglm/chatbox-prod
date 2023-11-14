<template>
    <div ref="input_chat_warper" class="w-full min-h-[49px] relative">
        <div @click="toggleLabelSelect()"
            class="min-w-[100px] h-[25px] rounded-t-md cursor-pointer absolute top-[-24px] left-[50%] translate-x-[-50%] overflow-hidden z-10">
            <template v-if="!is_show_label_list">
                <div v-if="getCurrentLabel()?.length" class="flex items-center justify-center h-full w-full bg-slate-200">
                    <div v-for="label_id of take(getCurrentLabel(), 5)"
                        :style="{ background: getLabelInfo(conversationStore.select_conversation?.fb_page_id, label_id)?.bg_color }"
                        class="w-[10px] h-[10px] rounded-full mx-1" />
                    <div v-if="getCurrentLabelLength() > 5" class="text-xs mx-1 text-slate-600 font-bold">
                        +
                        {{ getCurrentLabelLength() - 5 }}
                    </div>
                </div>
                <div v-else class="text-slate-600 bg-slate-200 text-xs font-bold py-1 text-center">
                    {{ $t('v1.view.main.dashboard.chat.input.add_tag') }}
                </div>
            </template>
            <div v-else class="bg-slate-600 text-white text-xs py-1 text-center">
                {{ $t('v1.common.close') }}
            </div>
        </div>

        <template v-if="is_show_label_list">
            <div v-if="is_loading_label"
                class="absolute w-full h-[150px] top-[-150px] lef-0 flex justify-center z-10 bg-slate-400/50">
                <Loading />
            </div>
            <div
                class="absolute w-full h-[150px] border-t top-[-150px] lef-0 bg-slate-50 overflow-hidden overflow-y-auto pt-2 pb-7 px-2 ">
                <div class="flex flex-wrap justify-center">
                    <div v-for="label_info of sortLabelList()" @click="toggleLabel(label_info._id)" :style="{
                        color: isActiveLabel(label_info?._id) ? 'white' : label_info?.bg_color,
                        background: isActiveLabel(label_info?._id) ? label_info?.bg_color : 'white',
                        'border-color': label_info?.bg_color,
                    }" class="text-sm w-fit px-2 py-[2px] rounded-full mr-1 mb-1 cursor-pointer border">
                        {{ label_info?.title }}
                    </div>
                </div>
            </div>
        </template>

        <div v-if="size(upload_file_list)"
            class="flex flex-wrap justify-center overflow-hidden overflow-y-auto h-[80px] p-[5px]">
            <div v-for="(file, index) of upload_file_list"
                class="mr-[5px] mb-[5px] overflow-hidden rounded-lg cursor-pointer relative">
                <img v-if="!file.is_done && !file.is_loading" @click="deleteUploadFile(index)"
                    class="absolute top-[1px] left-[1px]" src="@/assets/icons/close-circle.svg" />
                <div v-if="file.is_loading" class="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]">
                    <Loading />
                </div>
                <img v-if="file.is_done" class="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]"
                    src="@/assets/icons/check-circle.svg" />
                <img v-if="file.preview" class="h-[70px] w-[70px]" :src="file.preview" />
                <img v-else-if="file.type === 'image'" class="h-[70px] w-[70px]" src="@/assets/icons/picture.svg" />
                <img v-else-if="file.type === 'video'" class="h-[70px] w-[70px]" src="@/assets/icons/play.svg" />
                <img v-else-if="file.type === 'audio'" class="h-[70px] w-[70px]" src="@/assets/icons/audio.svg" />
                <img v-else class="h-[70px] w-[70px]" src="@/assets/icons/file.svg" />
            </div>
        </div>

        <div class="border-t flex items-center">
            <div @click="selectAttachmentFromDevice"
                class="w-[30px] h-[30px] cursor-pointer flex justify-center items-center">
                <img src="@/assets/icons/clip.svg" width="17" height="17" />
            </div>
            <div @click="toggleQuickAnswer" class="w-[30px] h-[30px] cursor-pointer flex justify-center items-center">
                <img src="@/assets/icons/slash.svg" width="20" height="20" />
            </div>
            <div class="w-[calc(100%_-_95px)] h-full">
                <div ref="input_chat_ref" id="chat-text-input-message" @keydown.enter="submitInput"
                    @keyup="checkOpenQuickAnswer" @paste="onPasteImage"
                    class="min-h-[24px] max-h-[150px] overflow-hidden overflow-y-auto relative pl-2 w-full h-full focus:outline-none"
                    contenteditable="true" />
            </div>
            <div @click="sendMessage" class="w-[48px] h-[48px] cursor-pointer flex justify-center items-center">
                <img src="@/assets/icons/send.svg" width="25" height="25" />
            </div>
        </div>
    </div>
    <div class="w-full flex items-center h-[49px] border-t relative">
        <div class="w-[30px] h-[30px] cursor-pointer flex justify-center items-center relative" @click="toggleEmoji">
            <img src="@/assets/icons/smile.svg" width="20" height="20" />
            <Emoji ref="emoji_ref" :selectEmoji="addEmojiToInput"></Emoji>
        </div>
        <div @click="openAlbum" class="w-[30px] h-[30px] cursor-pointer flex justify-center items-center">
            <img src="@/assets/icons/picture.svg" width="20" height="20" />
        </div>
        <div class="w-[calc(100%_-_60px)] absolute left-[60px] overflow-hidden overflow-x-auto flex" v-if="isMobile()">
            <div v-for="widget of widget_list" @click="toggleWidget(widget)"
                class="w-[30px] h-[30px] cursor-pointer flex justify-center items-center text-slate-600 font-extrabold mr-2">
                <img :src="widget.snap_app.mini_icon || widget.snap_app.icon" width="20" height="20" />
            </div>
        </div>
        <div class="w-[calc(100%_-_60px)] absolute left-[60px] overflow-hidden overflow-x-auto flex" v-else>
            <template v-for="widget of widget_list" @click="toggleWidget(widget)"
                class="w-[30px] h-[30px] cursor-pointer flex justify-center items-center text-slate-600 font-extrabold mr-2">
                <img v-if="widget.position === 'BOTTOM'" :src="widget.snap_app.mini_icon || widget.snap_app.icon" width="20"
                    height="20" />
            </template>
        </div>
    </div>
    <FacebookError ref="facebook_error_ref" :error="facebook_error"></FacebookError>
    <Album @pick_file="handlePickFile" ref="album_ref" />
</template>
<script setup lang="ts">
import { nextTick, onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { map, take, get, size, remove, pullAt } from 'lodash'
import {
    send_message, toggle_label_conversation
} from '@/service/api/chatbox/n4-service'
import { useConversationStore, useMessageStore } from '@/stores'
import { toastError } from '@/service/helper/alert'
import {
    getLabelValid, scrollToBottomMessage, getLabelInfo, getPageLabel,
    getPageWidget, getIframeUrl, isMobile
} from '@/service/function'
import { eachOfLimit, waterfall } from 'async'
import { upload_temp_file } from '@/service/api/chatbox/n6-static'
import { getFbFileType, srcImageToFile } from '@/service/helper/file'

import Emoji from "@/components/Main/Dashboard/Emoji.vue";
import Loading from '@/components/Loading.vue'
import FacebookError from '@/components/Main/Dashboard/FacebookError.vue'
import Album from '@/views/Main/Dashboard/Chat/CenterContent/Album.vue'

import type { ComponentRef } from '@/service/interface/vue'
import type { TempSendMessage } from '@/service/interface/app/message'
import type { AppInstalledInfo } from '@/service/interface/app/widget'
import type { CbError } from '@/service/interface/function'
import type { FileInfo, UploadFile } from '@/service/interface/app/album'

const $emit = defineEmits(['toggle_bottom_widget', 'toggle_quick_answer'])
const { t: $t } = useI18n()

const conversationStore = useConversationStore()
const messageStore = useMessageStore()

/**danh sách widget */
const widget_list = ref<AppInstalledInfo[]>([])
/**ref của input chat */
const input_chat_warper = ref<ComponentRef>()
/**gắn cờ có hiển thị danh sách nhãn hay không */
const is_show_label_list = ref(false)
/**gắn cờ đang loading label */
const is_loading_label = ref(false)
/**ref của ô chat tin nhắn */
const input_chat_ref = ref<ComponentRef>()
/**ref của quản lý album */
const album_ref = ref<ComponentRef>()
/**ref của component emoji */
const emoji_ref = ref<ComponentRef>()
/**ref của component facebook error */
const facebook_error_ref = ref<ComponentRef>()
/** error fb trả về */
const facebook_error = ref<{
    code?: number
    message?: string
}>()
/**các file được chọn để gửi đi */
const upload_file_list = ref<UploadFile[]>([])
/**gắn cờ file đang gửi */
const is_send_file = ref(false)

watch(() => conversationStore.list_widget_token, () => getListWidget())

onMounted(() => onChangeHeightInput())

/**xử lý các file được chọn từ album */
function handlePickFile(file_list: FileInfo[]) {
    upload_file_list.value?.push(...file_list?.map(file => {
        /**kiểu dữ liệu của fb */
        const TYPE = getFbFileType(file.mimetype)

        return {
            type: TYPE,
            is_done: false,
            is_loading: false,
            preview: TYPE === 'image' ? file.url : undefined,
            url: file.url
        }
    }))
}
/**mở album */
function openAlbum() {
    album_ref.value?.toggleAlbum()
}
/**lấy ảnh khi được ctrl + v vào input */
function onPasteImage() {
    setTimeout(() => {
        /**ô input */
        const PARENT: HTMLDivElement = input_chat_ref.value

        // loop dữ liệu input để tìm các img được paste vào
        map(PARENT.children, (element: HTMLElement) => {
            // chỉ xử lý img
            if (element?.tagName !== 'IMG') return

            // lấy source của hình ảnh
            const SRC = (element as HTMLImageElement).src

            // loại bỏ hình ảnh khỏi input
            PARENT.removeChild(element)

            srcImageToFile(SRC, (e, r) => {
                if (e || !r) return

                upload_file_list.value.push({
                    source: r,
                    type: 'image',
                    preview: SRC
                })
            })
        })
    }, 100)
}
/**xoá file định gửi */
function deleteUploadFile(index: number) {
    pullAt(upload_file_list.value, index)

    keepMobileKeyboard()
}
/**giữ bàn phím ảo trên mobile không mất */
function keepMobileKeyboard() {
    if (isMobile() && input_chat_ref.value?.innerText)
        input_chat_ref.value.focus()
}
/**chọn file từ thiết bị để gửi đi */
function selectAttachmentFromDevice() {
    // đang gửi thì không cho chọn lại file để bị lỗi
    if (is_send_file.value) return

    /**input upload file */
    const INPUT = document.createElement('input')

    // thêm các thuộc tính cần thiết
    INPUT.type = 'file'
    INPUT.multiple = true
    INPUT.style.display = 'none'

    // hàm xử lý sau khi upload thành công
    INPUT.onchange = () => {
        // trên mobile, nếu đang chat dở thì mở lại bàn phím ảo
        keepMobileKeyboard()

        // làm sạch danh sách file
        upload_file_list.value = []

        // ghi dữ liệu vào mảng
        map(INPUT.files, file => {
            /**kiểu fb của file */
            const TYPE = getFbFileType(file.type)

            if (TYPE !== 'image')
                return upload_file_list.value.push({ source: file, type: TYPE })

            // render hình ảnh để hiển thị preview
            const READER = new FileReader()
            READER.onload = $event => upload_file_list.value.push({
                source: file,
                type: TYPE,
                preview: $event.target?.result
            })
            READER.readAsDataURL(file)
        })

        // xoá input sau khi xong việc
        if (INPUT && INPUT.parentNode) INPUT.parentNode.removeChild(INPUT)
    }

    // thêm input vào html
    document.body.appendChild(INPUT)

    // click vào input
    INPUT.click()
}
/**hiển thị widget bên dưới */
function toggleWidget(widget: AppInstalledInfo) {
    conversationStore.select_widget = widget

    $emit('toggle_bottom_widget')
}
/**hiển thị trả lời nhanh */
function toggleQuickAnswer() {
    $emit('toggle_quick_answer')
}
/**đọc danh sách các widget của trang này */
function getListWidget() {
    /**id trang */
    const PAGE_ID = conversationStore.select_conversation?.fb_page_id

    if (!PAGE_ID) return []

    // làm mới danh sách
    widget_list.value = []

    // render lại danh sách
    nextTick(() => {
        widget_list.value = getPageWidget(PAGE_ID)?.map(widget => {
            // thêm token cho url
            widget.url = getIframeUrl(widget)

            return widget
        }) || []
    })
}
/**thay đổi gắn nhãn của khách hàng này */
function toggleLabel(label_id: string) {
    is_loading_label.value = true

    toggle_label_conversation({
        page_id: conversationStore.select_conversation?.fb_page_id as string,
        client_id: conversationStore.select_conversation?.fb_client_id as string,
        label_id,
    }, (e, r) => {
        if (e) return toastError(e)

        is_loading_label.value = false
    })
}
/**kiểm tra label có được chọn hay không */
function isActiveLabel(label_id?: string | number) {
    if (!label_id) return false

    return getCurrentLabel()?.includes(label_id as string)
}
/**sắp xếp danh sách nhãn được chọn lên đầu */
function sortLabelList() {
    /**chuyển đổi obj thành array */
    let list_label = map(
        getPageLabel(conversationStore.select_conversation?.fb_page_id)
    )

    // sort đã gắn nhãn lên đầu
    return list_label?.sort(label_info => {
        if (getCurrentLabel()?.includes(label_info._id)) return -1

        return 1
    })
}
/**đếm số nhãn của khách hàng hiện tại */
function getCurrentLabelLength() {
    return getCurrentLabel()?.length || 0
}
/**lấy danh sách id nhãn của khách hàng hiện tại */
function getCurrentLabel() {
    return getLabelValid(
        conversationStore.select_conversation?.fb_page_id,
        conversationStore.select_conversation?.label_id
    )
}
/**ẩn hiện danh sách nhãn */
function toggleLabelSelect() {
    is_show_label_list.value = !is_show_label_list.value
}
/**lắng nghe sự thay đổi độ cao của input, để thay đổi độ cao danh sách tin nhắn */
function onChangeHeightInput() {
    /**input chat */
    const INPUT_CHAT = input_chat_warper.value

    // lắng nghe sự thay đổi
    new ResizeObserver(function (entries) {
        for (var entry of entries) {
            if (entry.target !== INPUT_CHAT) return

            /**độ cao mới */
            const NEW_HEIGHT = entry.contentRect.height

            resizeHeightMessageList(NEW_HEIGHT)
        }
    }).observe(INPUT_CHAT)
}
/**thay đổi độ cao của danh sách tin nhắn */
function resizeHeightMessageList(new_height: number) {
    /**mục tiêu */
    const TARGET = document.getElementById('list-message-warper')

    if (!TARGET) return

    // thay đổi độ cao của danh sách tin nhắn cho khớp với màn hình
    TARGET.style.height = `calc(100% - ${100 + new_height}px)`
}
/**xử lý sự kiện nhấn enter ở ô chat */
function submitInput($event: KeyboardEvent) {
    // nếu bấm shift + enter thì chỉ xuống dòng
    if ($event.shiftKey) return

    // nếu ở mobile thì nhấn enter chỉ xuống dòng, không xử lý sự kiện
    if (isMobile()) return

    // nếu bấm enter thì chặn không cho xuống dòng, để xử lý logic gửi tin nhắn
    $event.preventDefault()

    sendMessage()
}
/**gửi tin nhắn */
function sendMessage() {
    // đang gửi file thì không cho click nút gửi, tránh bị gửi lặp
    if (is_send_file.value) return

    // lấy id trang và client để tránh trường hợp đang gửi dở thì chuyển khách khác
    const PAGE_ID = conversationStore.select_conversation?.fb_page_id as string
    const CLIENT_ID = conversationStore.select_conversation?.fb_client_id as string

    /**div input */
    const INPUT = input_chat_ref.value as HTMLDivElement

    /**nội dung tin nhắn */
    const TEXT = INPUT.innerText.trim()

    // nếu ở trên mobile, click gửi tin sẽ focus lại vào input, để bàn phím không bị mất
    keepMobileKeyboard()

    // gửi text
    if (TEXT) {
        // xoá dữ liệu trong input
        INPUT.innerHTML = ''

        /**nội dung tin nhắn vừa được gửi */
        const TEMP_SEND_MESSAGE: TempSendMessage = {
            text: TEXT,
            time: new Date().toISOString()
        }

        // thêm vào danh sách tin nhắn tạm
        messageStore.send_message_list.push(TEMP_SEND_MESSAGE)

        scrollToBottomMessage()

        send_message({
            page_id: PAGE_ID,
            client_id: CLIENT_ID,
            text: TEXT,
            type: 'FACEBOOK_MESSAGE'
        }, (e, r) => {
            if (e || !r?.message_id) {
                TEMP_SEND_MESSAGE.error = true

                handleSendMessageError(e || r)

                return
            }

            // sử dụng tính chất obj của js để thêm id tin nhắn vào phần tử trong mảng
            TEMP_SEND_MESSAGE.message_id = r?.message_id
        })
    }

    // gửi file
    if (size(upload_file_list.value)) {
        // đánh dấu đang gửi file
        is_send_file.value = true

        eachOfLimit(
            upload_file_list.value,
            1,
            (file: UploadFile, i, next) => {
                // đang gửi mà file bị xoá mất
                if (!file) return next()

                file.is_loading = true
                /**dữ liệu upload */
                const FORM = new FormData()
                /**link file */
                let url: string
                waterfall([
                    // * thêm file để upload
                    (cb: CbError) => {
                        if (!file?.source) return cb()

                        FORM.append('file', file?.source)

                        cb()
                    },
                    // * upload file lên server lấy link
                    (cb: CbError) => {
                        // file từ album
                        if (file.url) {
                            url = file.url

                            return cb()
                        }

                        // file upload trực tiếp
                        upload_temp_file(FORM, (e, r) => {
                            if (e || !r) return cb('DONE')

                            url = r
                            cb()
                        })
                    },
                    // * gửi file lên fb
                    (cb: CbError) => send_message({
                        page_id: PAGE_ID,
                        client_id: CLIENT_ID,
                        attachment: { url: url, type: file.type },
                        type: 'FACEBOOK_MESSAGE'
                    }, (e, r) => {
                        if (e) return cb('DONE')

                        cb()
                    })
                ], e => {
                    file.is_loading = false
                    file.is_done = true

                    next()
                })
            },
            e => {
                // reset upload
                setTimeout(() => {
                    // làm mới list file
                    upload_file_list.value = []

                    // đã gửi xong
                    is_send_file.value = false
                }, 500)
            }
        )
    }
}
/**TODO xử lý báo lỗi khi gửi tin nhắn thất bại */
function handleSendMessageError(error: any) {

    switch (get(error, 'error.code')) {
        case 10: toastError($t('v1.view.main.dashboard.chat.facebook_errors.10'))
            break;
        // case 10:
        //     facebook_error.value = get(error, 'error')
        //     facebook_error_ref.value.toggleModal()
        //     break;
        case 190:
            facebook_error.value = get(error, 'error')
            facebook_error_ref.value.toggleModal()
            break;
        default: toastError(error)
            break;
    }
}
/** Bật tắt modal chọn emoji */
function toggleEmoji() {
    emoji_ref.value.toogleEmoji()
}
/** Thêm emoji vào input chat */
function addEmojiToInput(emoji: string) {
    input_chat_ref.value.innerText += emoji
}
/** Kiểm tra input xem đủ điều kiện mở modal trả lời nhanh hay không? */
function checkOpenQuickAnswer() {
    let input_value: string = input_chat_ref.value.innerText

    if (input_value.length === 1 && input_value === '/') toggleQuickAnswer()
}
</script>

<style>
#chat-text-input-message {
    word-break: break-word !important;
}
</style>