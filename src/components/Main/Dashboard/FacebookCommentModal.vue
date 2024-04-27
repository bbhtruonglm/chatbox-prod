<template>
    <Modal @close_modal="onCloseModal" ref="modal_ref" :fit_content="true">
        <template v-slot:header>
            {{ $props.post_title || 'Bình luận trong bài viết' }}
        </template>
        <template v-slot:body>
            <div v-if="is_loading" class="absolute top-10 left-[50%] translate-x-[-50%]">
                <Loading />
            </div>

            <div class="sm:w-[888px] h-[75vh] overflow-y-auto">
                <div v-for="(comment, index) in post_comments" class="flex justify-between mb-3">
                    <div>
                        <ClientAvatar :client_name="conversationStore.select_conversation?.client_name"
                            :client_id="conversationStore.select_conversation?.fb_client_id"
                            :page_id="conversationStore.select_conversation?.fb_page_id"
                            :staff_id="chatbotUserStore.chatbot_user?.fb_staff_id"
                            :platform_type="conversationStore.select_conversation?.platform_type" size="40"
                            :client_avatar="conversationStore.select_conversation?.client_avatar"
                            class="rounded-full" />
                    </div>
                    <div class="ml-3 w-full">

                        <div class="rounded-lg bg-slate-100 p-2 text-sm w-fit">
                            <p class="font-bold">{{ comment.from?.name }}</p>
                            <p>{{ comment.message }}</p>
                            <img v-if="comment.photo" class="w-[60px] mt-3" :src="comment.photo" alt="">
                        </div>

                        <div class="flex text-xs text-slate-400 mt-1.5">
                            <p class="font-bold mr-3 cursor-pointer hover:text-orange-500"
                                @click="focusInput(comment.comment_id)">
                                {{ $t('v1.view.main.dashboard.chat.post.reply_comment') }}
                            </p>
                            <p @click="openPrivateInbox({ target_id: comment.comment_id, target_name: comment.from?.name })"
                                class="font-bold mr-3 cursor-pointer hover:text-orange-500">
                                {{ $t('v1.view.main.dashboard.chat.post.private_inbox') }}
                            </p>
                            <p>{{ formatDistanceToNow(new Date(comment.createdAt as string), { locale: vi }) }}</p>
                        </div>

                        <div class="flex mt-3" v-for="chil_comment in comment.child_comments">
                            <div>
                                <PageAvatar
                                    v-if="chil_comment.from?.id === conversationStore.select_conversation?.fb_page_id"
                                    :page_info="pageStore.selected_page_list_info?.[conversationStore.select_conversation?.fb_page_id as string]?.page"
                                    class="rounded-full" :page_id="conversationStore.select_conversation?.fb_page_id"
                                    page_type="FB_MESS" />
                                <ClientAvatar v-else :client_name="chil_comment.from?.name"
                                    :client_id="chil_comment.from?.id"
                                    :page_id="conversationStore.select_conversation?.fb_page_id"
                                    :staff_id="chatbotUserStore.chatbot_user?.fb_staff_id"
                                    :platform_type="conversationStore.select_conversation?.platform_type" size="40"
                                    :client_avatar="conversationStore.select_conversation?.client_avatar"
                                    class="rounded-full" />
                            </div>
                            <div class="ml-3">
                                <div class="rounded-lg bg-slate-100 p-2 text-sm w-fit">
                                    <p class="font-bold">{{ chil_comment.from?.name }}</p>
                                    <p>{{ chil_comment.message }}</p>
                                    <img v-if="chil_comment.photo" class="w-[60px] mt-3" :src="chil_comment.photo"
                                        alt="">
                                </div>
                                <div class="flex text-xs text-slate-400 mt-1.5">
                                    <p class="font-bold mr-3 cursor-pointer hover:text-orange-500"
                                        @click="focusInput(comment.comment_id)">
                                        {{ $t('v1.view.main.dashboard.chat.post.reply_comment') }}
                                    </p>
                                    <p @click="openPrivateInbox({ target_id: chil_comment.comment_id, target_name: chil_comment.from?.name })"
                                        class="font-bold mr-3 cursor-pointer hover:text-orange-500"
                                        v-if="chil_comment.from?.id !== conversationStore.select_conversation?.fb_page_id">
                                        {{ $t('v1.view.main.dashboard.chat.post.private_inbox') }}
                                    </p>
                                    <p>{{ formatDistanceToNow(new Date(chil_comment.createdAt as string), {
        locale: vi
    }) }}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <p v-if="!comment.done_load_comment" @click="getFbPostChildComments(comment)"
                            class="text-sm font-bold cursor-pointer mt-3 hover:text-orange-500">
                            {{ $t('v1.view.main.dashboard.chat.post.get_more_comments') }}
                        </p>

                        <div class="flex mt-3 w-full">
                            <!-- <img src="https://merchant-dev-static.s3.ap-southeast-1.amazonaws.com/files/business_642655457c339f9194288da9/1695532605955.jpeg" alt="" class="w-[40px] h-[40px] rounded-full"> -->
                            <div>
                                <PageAvatar class="rounded-full"
                                    :page_info="pageStore.selected_page_list_info?.[conversationStore.select_conversation?.fb_page_id as string]?.page"
                                    :page_id="conversationStore.select_conversation?.fb_page_id" page_type="FB_MESS" />
                            </div>
                            <div class="ml-3 w-full flex relative">
                                <input v-model="comment.new_comment" :id="`input_${comment.comment_id}`"
                                    class="w-full pl-4 pr-10 py-1.5 bg-slate-100 rounded-2xl text-sm focus:outline-none"
                                    type="text"
                                    :placeholder="`Bình luận với vai trò ${pageStore.selected_page_list_info?.[conversationStore.select_conversation?.fb_page_id as string]?.page?.name}`"
                                    v-on:keyup.enter="sendPostComment(comment.new_comment as string, comment.comment_id, index)">
                                <img v-if="!comment.sending_message"
                                    class=" absolute right-3 top-3 cursor-pointer hover:saturate-150"
                                    :src="SendMessageIcon" alt=""
                                    @click="sendPostComment(comment.new_comment as string, comment.comment_id, index)">
                                <Loading v-if="comment.sending_message" class=" absolute right-3 top-2" />
                            </div>
                        </div>

                    </div>
                </div>
                <p v-if="!done_load_comment" @click="getFbPostComments"
                    class="text-sm font-bold cursor-pointer mt-3 hover:text-orange-500">
                    {{ $t('v1.view.main.dashboard.chat.post.get_more_comments') }}
                </p>
            </div>
        </template>
    </Modal>
    <PrivateInboxModal ref="private_inbox_ref" :page_id="conversationStore?.select_conversation?.fb_page_id"
        :target_id="target_private_inbox?.target_id" :target_name="target_private_inbox?.target_name" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { eachOfLimit, waterfall } from 'async'
import formatDistanceToNow from 'date-fns/formatDistanceToNow'
import vi from 'date-fns/locale/vi'

// * Components
import Modal from '@/components/Modal.vue'
import PrivateInboxModal from './PrivateInboxModal.vue'
import ClientAvatar from '@/components/Avatar/ClientAvatar.vue'
import PageAvatar from '@/components/Avatar/PageAvatar.vue'
import Loading from '@/components/Loading.vue'

// * Store
import {
    useConversationStore,
    useChatbotUserStore,
    usePageStore
} from '@/stores'

// * Interfaces
import type { ComponentRef } from '@/service/interface/vue'
import type { FacebookCommentPost } from '@/service/interface/app/post'

interface TargetPrivateInbox {
    target_id?: string
    target_name?: string
}

// * Icon
import SendMessageIcon from "@/assets/icons/send.svg"

// * API
import {
    get_fb_post_comments,
    send_post_comment
} from '@/service/api/chatbox/n4-service';

// * Helper
import { toast, toastError } from '@/service/helper/alert';
import type { CbError } from '@/service/interface/function'

// * Props
const $props = withDefaults(defineProps<{
    page_id?: string,
    client_id?: string,
    target_id?: string
    post_title?: string
}>(), {})

// * Use store
const conversationStore = useConversationStore()
const chatbotUserStore = useChatbotUserStore()
const pageStore = usePageStore()

/**giới hạn số bản ghi */
const LIMIT_RECORD = 3

/** Ref của modal */
const modal_ref = ref<ComponentRef>()
/** Ref của modal private inbox */
const private_inbox_ref = ref<ComponentRef>()
/** Comments trong bài post */
const post_comments = ref<FacebookCommentPost[]>([])
/** gắn cờ đã load hết bình luận chính */
const done_load_comment = ref<boolean>()
/**phân trang bình luận chính */
const skip_comment = ref(0)
/**bật loading */
const is_loading = ref(false)
/** Đối tượng private_inbox */
const target_private_inbox = ref<TargetPrivateInbox>({})

/**xoá dữ liệu khi modal tắt */
function onCloseModal() {
    post_comments.value = []

    skip_comment.value = 0

    done_load_comment.value = false

    is_loading.value = false
}
/** Dùng để bật modal */
function toggleModal() {
    getFbPostComments()

    modal_ref.value?.toggleModal()
}
/** Dùng để bật tắt modal private inbox */
function openPrivateInbox(target: TargetPrivateInbox) {
    target_private_inbox.value = target
    private_inbox_ref.value?.toggleModal()
}
/** Lấy bình luận chính từ bài post của fb */
function getFbPostComments() {
    if (is_loading.value) return

    waterfall([
        // * bật loading
        (cb: CbError) => {
            is_loading.value = true

            cb()
        },
        // * gọi api lấy danh sách comment
        (cb: CbError) => get_fb_post_comments(
            {
                client_id: $props.client_id,
                page_id: $props.page_id,
                target_id: $props.target_id,
                limit: LIMIT_RECORD,
                skip: skip_comment.value
            },
            (e, r) => {
                if (e) return cb(e)

                if (!r?.length) done_load_comment.value = true

                // thêm field cho comment gốc
                if (r) post_comments.value.push(
                    ...r.map((comment: FacebookCommentPost) => {
                        comment.child_comments = []
                        comment.done_load_comment = false
                        comment.skip_comment = 0
                        comment.new_comment = ''
                        comment.sending_message = false

                        return comment
                    })
                )

                cb()
            }
        ),
        // * next
        (cb: CbError) => {
            skip_comment.value += LIMIT_RECORD

            cb()
        },
    ], e => {
        is_loading.value = false

        if (e) return toastError(e)
    })
}
/** Lấy bình luận phụ từ bình luận chính của fb */
function getFbPostChildComments(comment: FacebookCommentPost) {
    if (is_loading.value) return

    waterfall([
        // * bật loading
        (cb: CbError) => {
            is_loading.value = true

            cb()
        },
        // * đọc danh sách comment
        (cb: CbError) => get_fb_post_comments(
            {
                client_id: $props.client_id,
                page_id: $props.page_id,
                target_id: comment.comment_id,
                limit: LIMIT_RECORD,
                skip: comment.skip_comment
            },
            (e, r) => {
                if (e) return cb(e)

                if (!r?.length) comment.done_load_comment = true

                if (r) comment.child_comments?.push(...r)
                cb()
            }
        ),
        // * next
        (cb: CbError) => {
            comment.skip_comment = (comment.skip_comment || 0) + LIMIT_RECORD

            cb()
        }
    ], e => {
        is_loading.value = false

        if (e) return toastError(e)
    })
}
/** Focus vào input của bình luận */
function focusInput(comment_id: string) {
    let input = document.getElementById(`input_${comment_id}`)
    if (input) input.focus()
}
/** Tạo bình luận phụ vào 1 bình luận trong bài post */
function sendPostComment(
    comment: string,
    target_id: string,
    comment_index: number
) {
    if (post_comments.value[comment_index].sending_message) return
    post_comments.value[comment_index].sending_message = true

    send_post_comment(
        {
            page_id: conversationStore.select_conversation?.fb_page_id,
            text: comment,
            target_id
        },
        (e, r) => {
            post_comments.value[comment_index].sending_message = false
            post_comments.value[comment_index].new_comment = ''
            if (e) return toast('error', 'Gửi bình luận không thành công')
            toast('success', 'Gửi bình luận thành công')

            post_comments.value[comment_index].child_comments?.push({
                comment_id: r.id,
                from: {
                    id: conversationStore.select_conversation?.fb_page_id,
                    name: pageStore.selected_page_list_info?.[
                        conversationStore.select_conversation?.fb_page_id as string
                    ]?.page?.name
                },
                message: comment,
                createdAt: new Date().toLocaleString()
            })

        }
    )
}


defineExpose({ toggleModal })
</script>