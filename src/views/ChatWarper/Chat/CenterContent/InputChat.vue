<template>
    <div ref="input_chat_warper" class="w-full min-h-[49px] relative flex-shrink-0">
        <div @click="scrollToBottomMessage()" v-if="messageStore.is_show_to_bottom"
            :class="is_show_label_list ? 'top-[-210px]' : 'top-[-85px]'"
            class="absolute left-[50%] translate-x-[-50%] border rounded-full flex items-center justify-center w-[35px] h-[35px] bg-white cursor-pointer shadow-xl">
            <img src="@/assets/icons/arrow-down-orange.svg" />
        </div>

        <QuickAnswer ref="quick_answer_ref" />

        <div :class="is_expand_label ? 'h-[79px]' : 'h-[29px]'" class="flex">
            <div v-if="is_loading_label"
                class="absolute w-full h-[150px] top-[-150px] lef-0 flex justify-center z-10 bg-slate-400/50">
                <Loading />
            </div>
            <div class="w-full overflow-y-auto pt-1 px-2">

                <div class="flex flex-wrap justify-start">
                    <div v-for="label_info of getActiveLabel()" @click="toggleLabel(label_info._id)" :style="{
            color: isActiveLabel(label_info?._id) ? 'white' : label_info?.bg_color,
            background: isActiveLabel(label_info?._id) ? label_info?.bg_color : 'white',
            'border-color': label_info?.bg_color,
        }" class="text-xs w-fit px-2 py-[2px] rounded-full mr-1 mb-1 cursor-pointer border">
                        {{ label_info?.title }}
                    </div>
                </div>

                <div class="flex flex-wrap justify-start">
                    <div v-for="label_info of getUnactiveLabel()" @click="toggleLabel(label_info._id)" :style="{
            color: isActiveLabel(label_info?._id) ? 'white' : label_info?.bg_color,
            background: isActiveLabel(label_info?._id) ? label_info?.bg_color : 'white',
            'border-color': label_info?.bg_color,
        }" class="text-xs w-fit px-2 py-[2px] rounded-full mr-1 mb-1 cursor-pointer border">
                        {{ label_info?.title }}
                    </div>
                </div>
            </div>
            <div v-tooltip="$t('v1.common.expand')" @click="is_expand_label = !is_expand_label"
                class="cursor-pointer flex items-center justify-center w-[50px]">
                <img src="@/assets/icons/expand.svg" />
            </div>
        </div>

        <div v-if="size(messageStore.upload_file_list)"
            class="flex flex-wrap justify-center overflow-y-auto h-[80px] p-[5px]">
            <div v-for="(file, index) of messageStore.upload_file_list"
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

        <div class="flex items-center bg-white rounded-full">
            <div v-tooltip="$t('v1.view.main.dashboard.chat.action.select_file')" @click="selectAttachmentFromDevice"
                class="w-[30px] h-[30px] cursor-pointer flex justify-center items-center mr-2">
                <img src="@/assets/icons/clip.svg" width="17" height="17" />
            </div>
            <div v-tooltip="$t('v1.view.main.dashboard.chat.action.open_quick_anwser')"
                @click="quick_answer_ref?.toggleModal()"
                class="w-[30px] h-[30px] cursor-pointer flex justify-center items-center">
                <img src="@/assets/icons/slash.svg" width="20" height="20" />
            </div>
            <div class="w-[calc(100%_-_95px)] h-full">
                <div ref="input_chat_ref" id="chat-text-input-message" @keydown.enter="submitInput"
                    @keyup="quick_answer_ref?.handleChatValue" @paste="onPasteImage"
                    class="min-h-[24px] max-h-[150px] overflow-y-auto relative pl-2 w-full h-full focus:outline-none"
                    contenteditable="true"
                    :placeholder="`${$t('v1.view.main.dashboard.chat.send_to')} ${conversationStore.select_conversation?.client_name}`" />
            </div>
            <div v-tooltip="$t('v1.view.main.dashboard.chat.action.send_message')" @click="sendMessage"
                class="w-[48px] h-[48px] cursor-pointer flex justify-center items-center">
                <img src="@/assets/icons/send.svg" width="25" height="25" />
            </div>
        </div>
    </div>
    <div class="w-full flex items-center h-[49px] relative flex-shrink-0">
        <div v-tooltip="$t('v1.view.main.dashboard.chat.action.select_emoji')"
            class="w-[30px] h-[30px] cursor-pointer flex justify-center items-center relative mr-2"
            @click="toggleEmoji">
            <img src="@/assets/icons/smile.svg" width="20" height="20" />
            <Emoji ref="emoji_ref" :selectEmoji="addEmojiToInput"></Emoji>
        </div>
        <div v-tooltip="$t('v1.view.main.dashboard.chat.action.open_album')" @click="openAlbum"
            class="w-[30px] h-[30px] cursor-pointer flex justify-center items-center">
            <img src="@/assets/icons/picture.svg" width="20" height="20" />
        </div>
        <div
            class="w-[calc(100%_-_76px)] absolute left-[60px] overflow-x-auto flex ml-4">
            <template v-for="widget of widget_list">
                <div v-tooltip="widget?.snap_app?.name" v-if="widget.position === 'BOTTOM'"
                    @click="$event => toggleWidget($event, widget)"
                    class="w-[30px] h-[30px] cursor-pointer flex justify-center items-center text-slate-600 font-extrabold mr-2">
                    <img :src="widget.snap_app.mini_icon || widget.snap_app.icon" width="20" height="20" />
                </div>
            </template>
        </div>
    </div>
    <FacebookError ref="facebook_error_ref" :error="facebook_error" />
    <Album @pick_file="handlePickFile" ref="album_ref" />
</template>
<script setup lang="ts">
import { nextTick, onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { map, get, size, pullAt, uniqueId, remove, partition, intersection } from 'lodash'
import {
    send_message, toggle_label_conversation
} from '@/service/api/chatbox/n4-service'
import { useConversationStore, useMessageStore, useCommonStore, usePageStore } from '@/stores'
import { toastError } from '@/service/helper/alert'
import {
    getLabelValid, scrollToBottomMessage, getPageLabel,
    getPageWidget, getIframeUrl, getPageCurrentStaff
} from '@/service/function'
import { eachOfLimit, waterfall } from 'async'
import { upload_temp_file } from '@/service/api/chatbox/n6-static'
import { getFbFileType, srcImageToFile, handleFileLocal } from '@/service/helper/file'
import { sendTextMesage, sendImageMessage } from '@/service/helper/ext'
import { onUnmounted } from 'vue'

import Emoji from "@/components/Main/Dashboard/Emoji.vue";
import Loading from '@/components/Loading.vue'
import FacebookError from '@/components/Main/Dashboard/FacebookError.vue'
import Album from '@/views/ChatWarper/Chat/CenterContent/Album.vue'
import QuickAnswer from '@/views/ChatWarper/Chat/CenterContent/QuickAnswer.vue'

import type { ComponentRef } from '@/service/interface/vue'
import type { TempSendMessage } from '@/service/interface/app/message'
import type { AppInstalledInfo, WidgetEventData } from '@/service/interface/app/widget'
import type { Cb, CbError } from '@/service/interface/function'
import type { FileInfo, UploadFile } from '@/service/interface/app/album'

const $emit = defineEmits(['toggle_bottom_widget', 'toggle_quick_answer'])
const { t: $t } = useI18n()

const conversationStore = useConversationStore()
const messageStore = useMessageStore()
const commonStore = useCommonStore()
const pageStore = usePageStore()

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
/**ref của trả lời nhanh */
const quick_answer_ref = ref<ComponentRef>()
/**ref của component facebook error */
const facebook_error_ref = ref<ComponentRef>()
/** error fb trả về */
const facebook_error = ref<{
    code?: number
    message?: string
}>()
/**gắn cờ hiển thị nhiều nhãn */
const is_expand_label = ref(false)

watch(() => conversationStore.list_widget_token?.data, () => getListWidget())

onMounted(() => {
    window.addEventListener('message', onWidgetEvent)
})
onUnmounted(() => window.removeEventListener('message', onWidgetEvent))

/**xử lý dữ liệu widget truyền vào */
function onWidgetEvent($event: MessageEvent<WidgetEventData>) {
    let { _type, content, list_images } = $event.data

    if (_type !== 'WIDGET') return true

    // thêm văn bản vào input chat, lọc bỏ cũ pháp cũ
    if (content)
        input_chat_ref.value.innerText = content?.split('\n\n##attachment##')?.[0]

    // nạp hình ảnh vào danh sách gửi
    if (list_images && size(list_images))
        messageStore.upload_file_list = list_images?.map(url => {
            return {
                type: 'image',
                is_done: false,
                is_loading: false,
                preview: url,
                url,
            }
        })
}
/**xử lý các file được chọn từ album */
function handlePickFile(file_list: FileInfo[]) {
    messageStore.upload_file_list?.push(...file_list?.map(file => {
        /**kiểu dữ liệu của fb */
        const TYPE = getFbFileType(file.mimetype)

        return {
            type: TYPE,
            is_done: false,
            is_loading: false,
            preview: TYPE === 'image' ? file.url : undefined,
            url: file.url,
            fb_image_id: get(file, 'fb_image_id[0]')
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

                messageStore.upload_file_list.push({
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
    pullAt(messageStore.upload_file_list, index)
}
/**chọn file từ thiết bị để gửi đi */
function selectAttachmentFromDevice() {
    // đang gửi thì không cho chọn lại file để bị lỗi
    if (messageStore.is_send_file) return

    /**input upload file */
    const INPUT = document.createElement('input')

    // thêm các thuộc tính cần thiết
    INPUT.type = 'file'
    INPUT.multiple = true
    INPUT.style.display = 'none'

    // hàm xử lý sau khi upload thành công
    INPUT.onchange = () => {
        // làm sạch danh sách file
        messageStore.upload_file_list = []

        // ghi dữ liệu vào mảng
        map(INPUT.files, file => handleFileLocal(file))

        // xoá input sau khi xong việc
        if (INPUT && INPUT.parentNode) INPUT.parentNode.removeChild(INPUT)
    }

    // thêm input vào html
    document.body.appendChild(INPUT)

    // click vào input
    INPUT.click()
}
/**hiển thị widget bên dưới */
function toggleWidget($event: MouseEvent, widget: AppInstalledInfo) {
    conversationStore.select_widget = widget

    $emit('toggle_bottom_widget', $event)
}
/**đọc danh sách các widget của trang này */
function getListWidget() {
    /**id trang */
    const PAGE_ID = conversationStore.select_conversation?.fb_page_id

    if (!PAGE_ID) return

    /**các nhóm mà nhân viên này được phép truy cập dữ liệu */
    const GROUP_STAFF = getPageCurrentStaff(PAGE_ID)?.group_staff

    // làm mới danh sách
    widget_list.value = []

    // render lại danh sách
    nextTick(() => {
        widget_list.value = getPageWidget(PAGE_ID)
            ?.filter(widget => {
                /**kiểm tra user có quyền xem widget này không */
                const IS_ACCESSIBLE = intersection(widget.access_group, GROUP_STAFF)?.length

                // chỉ hiển thị widget được kích hoạt và có quyền xem
                return widget.active_widget && IS_ACCESSIBLE
            })
            ?.map(widget => {
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
/**chỉ lấy các nhãn được chọn */
function getActiveLabel() {
    /**chuyển đổi obj thành array */
    let list_label = map(
        getPageLabel(conversationStore.select_conversation?.fb_page_id)
    )

    return list_label?.filter(label_info => isActiveLabel(label_info._id))
}
/**chỉ lấy các nhãn không được chọn */
function getUnactiveLabel() {
    /**chuyển đổi obj thành array */
    let list_label = map(
        getPageLabel(conversationStore.select_conversation?.fb_page_id)
    )

    return list_label?.filter(label_info => !isActiveLabel(label_info._id))
}
/**lấy danh sách id nhãn của khách hàng hiện tại */
function getCurrentLabel() {
    return getLabelValid(
        conversationStore.select_conversation?.fb_page_id,
        conversationStore.select_conversation?.label_id
    )
}
/**xử lý sự kiện nhấn enter ở ô chat */
function submitInput($event: KeyboardEvent) {
    // nếu bấm shift + enter thì chỉ xuống dòng
    if ($event.shiftKey) return

    // nếu bấm enter thì chặn không cho xuống dòng, để xử lý logic gửi tin nhắn
    $event.preventDefault()

    // nếu đang mở trả lời nhanh thì enter sẽ chọn câu trả lời
    if (quick_answer_ref.value?.is_show) return

    // nếu không thì gửi tin nhắn bình thường
    else sendMessage()
}
/**gửi tin nhắn */
function sendMessage() {
    // đang gửi file thì không cho click nút gửi, tránh bị gửi lặp
    if (messageStore.is_send_file) return

    // lấy id trang và client để tránh trường hợp đang gửi dở thì chuyển khách khác
    const PAGE_ID = conversationStore.select_conversation?.fb_page_id as string
    const CLIENT_ID = conversationStore.select_conversation?.fb_client_id as string

    /**div input */
    const INPUT = input_chat_ref.value as HTMLDivElement

    /**nội dung tin nhắn */
    const TEXT = INPUT.innerText.trim()

    // gửi text
    if (TEXT) sendText(PAGE_ID, CLIENT_ID, TEXT, INPUT)

    // gửi file
    if (size(messageStore.upload_file_list)) sendFile(PAGE_ID, CLIENT_ID)
}
/**gửi tập tin */
function sendFile(page_id: string, client_id: string) {
    // đánh dấu đang gửi file
    messageStore.is_send_file = true

    // cắt file gửi thành 2 loại
    const [
        /**danh sách hình ảnh */
        IMAGE_LIST,
        /**danh sách file còn lại */
        FILE_LIST
    ] = partition(messageStore.upload_file_list, file => file.type === 'image')

    waterfall([
        // * loop qua các file ảnh để upload lên server nếu cần
        (cb: CbError) => eachOfLimit(
            IMAGE_LIST,
            1,
            (file: UploadFile, i, next) => {
                file.is_loading = true

                // đang gửi mà file bị xoá mất, hoặc đã có url rồi
                if (!file || file.url) return next()

                // file tự upload
                getFileUrl(file?.source as File, (e, r) => {


                    if (r) file.url = r

                    next()
                })
            },
            cb
        ),
        // * gửi các hình ảnh đã được upload
        (cb: CbError) => {
            // gửi ngang qua ext
            if (commonStore.extension_status === 'FOUND') {
                // gắn cờ done
                IMAGE_LIST.forEach(image => {
                    image.is_loading = false
                    image.is_done = true
                })

                // gửi qua ext
                sendImageMessage(
                    conversationStore.select_conversation?.platform_type,
                    page_id,
                    client_id,
                    pageStore?.selected_page_list_info?.[page_id]?.page?.fb_page_token,
                    conversationStore.select_conversation?.client_bio?.fb_uid,
                    IMAGE_LIST.map(image => {
                        return {
                            url: image.url as string,
                            fb_image_id: image.fb_image_id,
                            type: 'image'
                        }
                    })
                )

                cb()
            }
            // gửi chính thống
            else eachOfLimit(
                IMAGE_LIST,
                1,
                (file: UploadFile, i, next) => {
                    if (!file.url) return next()

                    send_message({
                        page_id,
                        client_id,
                        attachment: { url: file.url, type: file.type },
                        type: 'FACEBOOK_MESSAGE'
                    }, (e, r) => {
                        file.is_loading = false
                        file.is_done = true

                        next()
                    })
                },
                cb
            )
        },
        // * loop qua các file còn lại
        (cb: CbError) => eachOfLimit(
            FILE_LIST,
            1,
            (file: UploadFile, i, next) => {
                // đang gửi mà file bị xoá mất
                if (!file) return next()

                file.is_loading = true
                /**link file */
                let url: string
                waterfall([
                    // lấy link của file
                    (_cb: CbError) => {
                        // file từ album
                        if (file.url) {
                            url = file.url

                            return _cb()
                        }

                        // file tự upload
                        getFileUrl(file?.source as File, (e, r) => {
                            if (e) return _cb(e)

                            if (r) url = r
                            _cb()
                        })
                    },
                    // * gửi file lên fb
                    (_cb: CbError) => send_message({
                        page_id,
                        client_id,
                        attachment: { url: url, type: file.type },
                        type: 'FACEBOOK_MESSAGE'
                    }, (e, r) => {
                        if (e) return _cb('DONE')

                        _cb()
                    })
                ], e => {
                    file.is_loading = false
                    file.is_done = true

                    next()
                })
            },
            cb
        ),
    ], e => {
        // reset upload
        setTimeout(() => {
            // làm mới list file
            messageStore.upload_file_list = []

            // đã gửi xong
            messageStore.is_send_file = false
        }, 500)
    })
}
/**upload file lên server để lấy link tạm thời */
function getFileUrl(source: File, proceed: Cb<string>) {
    /**dữ liệu upload */
    const FORM = new FormData()
    /**link file */
    let url: string

    waterfall([
        // * thêm file để upload
        (cb: CbError) => {
            FORM.append('file', source)

            cb()
        },
        // * upload file lên server lấy link
        (cb: CbError) => upload_temp_file(FORM, (e, r) => {
            if (e || !r) return cb('DONE')

            url = r
            cb()
        }),
    ], e => proceed(e, url))
}
/**gửi tin nhắn dạng văn bản */
function sendText(page_id: string, client_id: string, text: string, input: HTMLDivElement) {
    // xoá dữ liệu trong input
    input.innerHTML = ''

    scrollToBottomMessage()

    // gửi force qua ext
    if (commonStore.force_send_message_over_inbox) sendTextMesage(
        conversationStore.select_conversation?.platform_type,
        page_id,
        client_id,
        pageStore?.selected_page_list_info?.[page_id]?.page?.fb_page_token,
        conversationStore.select_conversation?.client_bio?.fb_uid,
        text
    )
    // gửi chính thống
    else {
        /**nội dung tin nhắn vừa được gửi */
        const TEMP_SEND_MESSAGE: TempSendMessage = {
            text,
            time: new Date().toISOString(),
            temp_id: uniqueId(text)
        }

        // thêm vào danh sách tin nhắn tạm
        messageStore.send_message_list.push(TEMP_SEND_MESSAGE)

        // gửi tin nhắn bằng api chính thống
        send_message({
            page_id,
            client_id,
            text,
            type: 'FACEBOOK_MESSAGE'
        }, (e, r) => {
            if (e || !r?.message_id) {
                // nếu bật ext thì gửi lại 1 lần nữa
                if (commonStore.extension_status === 'FOUND') {
                    sendTextMesage(
                        conversationStore.select_conversation?.platform_type,
                        page_id,
                        client_id,
                        pageStore?.selected_page_list_info?.[page_id]?.page?.fb_page_token,
                        conversationStore.select_conversation?.client_bio?.fb_uid,
                        text
                    )

                    // xoá tin nhắn tạm
                    remove(
                        messageStore.send_message_list,
                        message => message.temp_id === TEMP_SEND_MESSAGE.temp_id
                    )

                    return
                }

                // nếu không có ext thì báo lỗi
                TEMP_SEND_MESSAGE.error = true

                handleSendMessageError(e || r)

                return
            }

            // sử dụng tính chất obj của js để thêm id tin nhắn vào phần tử trong mảng
            TEMP_SEND_MESSAGE.message_id = r?.message_id
        })
    }
}
/**xử lý báo lỗi khi gửi tin nhắn thất bại */
function handleSendMessageError(error: any) {
    switch (get(error, 'error.code')) {
        case 10: toastError($t('v1.view.main.dashboard.chat.facebook_errors.10'))
            break;
        // case 10:
        //     facebook_error.value = get(error, 'error')
        //     facebook_error_ref.value.toggleModal()
        //     break;
        case 551: toastError($t('v1.view.main.dashboard.chat.facebook_errors.551'))
            break;
        case 100: toastError($t('v1.view.main.dashboard.chat.facebook_errors.100'))
            break;
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
</script>

<style>
#chat-text-input-message {
    word-break: break-word !important;
}
</style>