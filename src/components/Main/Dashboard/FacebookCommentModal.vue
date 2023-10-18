<template>
    <Modal ref="modal_ref" :fit_content="true" >
        <template v-slot:header>
            {{ $props.post_title || 'Bình luận trong bài viết' }}
        </template>
        <template v-slot:body>
            <div class="sm:w-[888px] h-[75vh] overflow-y-auto">
                <div 
                    v-for="(comment, index) in post_comments"
                    class="flex justify-between mb-3" 
                    :class="{
                        'hidden': !more_comments && index >= 3
                    }"
                >
                    <div>
                        <ClientAvatar 
                            :client_name="conversationStore.select_conversation?.client_name"
                            :client_id="conversationStore.select_conversation?.fb_client_id"
                            :page_id="conversationStore.select_conversation?.fb_page_id"
                            :staff_id="chatbotUserStore.chatbot_user?.fb_staff_id"
                            :platform_type="conversationStore.select_conversation?.platform_type" size="40"
                            class="rounded-full"
                        />
                    </div>
                    <div class="ml-3 w-full">

                        <div class="rounded-lg bg-slate-100 p-2 text-sm w-fit">
                            <p class="font-bold">{{ comment.from?.name }}</p>
                            <p>{{ comment.message }}</p>
                            <img v-if="comment.photo" class="w-[60px] mt-3" :src="comment.photo" alt="">
                        </div>

                        <div class="flex text-xs text-slate-400 mt-1.5">
                            <p 
                                class="font-bold mr-3 cursor-pointer hover:text-orange-500"
                                @click="focusInput(comment.comment_id)"
                            >
                                Trả lời bình luận
                            </p>
                            <p @click="openPrivateInbox" class="font-bold mr-3 cursor-pointer hover:text-orange-500">Nhắn tin inbox</p>
                            <p>33 phút</p>
                        </div>

                        <div 
                            class="flex mt-3" 
                            v-for="chil_comment, index_child in comment.child_comments"
                            :class="{
                                'hidden': !comment.more_comments && index_child >= 3
                            }"
                        >
                            <div>
                                <ClientAvatar
                                    v-if="chil_comment.from?.id === conversationStore.select_conversation?.fb_client_id"
                                    :client_name="conversationStore.select_conversation?.client_name"
                                    :client_id="conversationStore.select_conversation?.fb_client_id"
                                    :page_id="conversationStore.select_conversation?.fb_page_id"
                                    :staff_id="chatbotUserStore.chatbot_user?.fb_staff_id"
                                    :platform_type="conversationStore.select_conversation?.platform_type" size="40"
                                    class="rounded-full"
                                />
                                <PageAvatar
                                    v-if="chil_comment.from?.id === conversationStore.select_conversation?.fb_page_id"
                                    class="rounded-full" 
                                    :page_id="conversationStore.select_conversation?.fb_page_id"
                                    page_type="FB_MESS"
                                />
                            </div>

                            <div class="ml-3">
                                <div class="rounded-lg bg-slate-100 p-2 text-sm w-fit">
                                    <p class="font-bold">Tên trang</p>
                                    <p>{{ chil_comment.message }}</p>
                                    <img v-if="chil_comment.photo" class="w-[60px] mt-3" :src="chil_comment.photo" alt="">
                                </div>
                                <div class="flex text-xs text-slate-400 mt-1.5">
                                    <p 
                                        class="font-bold mr-3 cursor-pointer hover:text-orange-500"
                                        @click="focusInput(comment.comment_id)"
                                    >
                                        Trả lời bình luận
                                    </p>
                                    <p @click="openPrivateInbox" class="font-bold mr-3 cursor-pointer hover:text-orange-500">Nhắn tin inbox</p>
                                    <p>33 phút</p>
                                </div>
                            </div>
                        </div>

                        <p 
                            class="text-sm font-bold cursor-pointer mt-3 hover:text-orange-500"
                            v-if="comment?.child_comments && comment?.child_comments?.length>3 && !comment?.more_comments"
                            @click="comment.more_comments = true"
                        >
                            Xem thêm phản hồi...
                        </p>

                        <div class="flex mt-3 w-full">
                            <!-- <img src="https://merchant-dev-static.s3.ap-southeast-1.amazonaws.com/files/business_642655457c339f9194288da9/1695532605955.jpeg" alt="" class="w-[40px] h-[40px] rounded-full"> -->
                            <div>
                                <PageAvatar 
                                    class="rounded-full" 
                                    :page_id="conversationStore.select_conversation?.fb_page_id"
                                    page_type="FB_MESS"
                                />
                            </div>
                            <div class="ml-3 w-full flex relative">
                                <input
                                    v-model="comment.new_comment"
                                    :id="`input_${comment.comment_id}`"
                                    class="w-full px-4 py-1.5 bg-slate-100 rounded-2xl text-sm focus:outline-none"
                                    type="text" 
                                    :placeholder="`Bình luận với vai trò ${pageStore.selected_page_list_info?.[conversationStore.select_conversation?.fb_page_id as string]?.page?.name}`"
                                    v-on:keyup.enter="sendPostComment(comment.new_comment as string, comment.comment_id, index)"
                                >
                                <img 
                                    v-if="!comment.sending_message"
                                    class=" absolute right-3 top-3" 
                                    :src="SendMessageIcon" alt="" 
                                    @click="sendPostComment(comment.new_comment as string, comment.comment_id, index)"
                                >
                                <Loading v-if="comment.sending_message" class=" absolute right-3 top-2" />
                            </div>
                        </div>

                    </div>
                </div>
                <p 
                    v-if="post_comments.length > 3" class="text-sm font-bold cursor-pointer mt-3"
                    @click="more_comments = true"
                >
                    Xem thêm phản hồi...
                </p>
            </div>
        </template>
    </Modal>
    <PrivateInboxModal ref="private_inbox_ref" />
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { eachOfLimit } from 'async';

// * Components
import Modal from '@/components/Modal.vue';
import PrivateInboxModal from './PrivateInboxModal.vue';
import ClientAvatar from '@/components/Avatar/ClientAvatar.vue'
import PageAvatar from '@/components/Avatar/PageAvatar.vue';
import Loading from '@/components/Loading.vue';

// * Store
import { 
    useConversationStore, 
    useChatbotUserStore, 
    usePageStore 
} from '@/stores';

// * Interfaces
import type { ComponentRef } from '@/service/interface/vue';
interface FacebookCommentPost {
    comment_id: string
    from?: {
        id?: string
        name?: string
    }
    message: string
    photo?: string
    more_comments?: boolean
    child_comments?: FacebookCommentPost[]

    // * Flag
    new_comment?: string
    sending_message?: boolean
}

// * Icon
import SendMessageIcon from "@/assets/icons/send.svg"

// * API
import { 
    get_fb_post_comments,
    send_post_comment
} from '@/service/api/chatbox/n4-service';

// * Helper
import { toast } from '@/service/helper/alert';

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

/** Ref của modal */
const modal_ref = ref<ComponentRef>()
/** Ref của modal private inbox */
const private_inbox_ref = ref<ComponentRef>()
/** Comments trong bài post */
const post_comments = ref<FacebookCommentPost[]>([])
/** Hiển thị thêm comments */
const more_comments = ref<boolean>(false)


/** Dùng để bật tắt modal */
function toggleModal() {
    modal_ref.value?.toggleModal()
    getFbPostComments()
}
/** Dùng để bật tắt modal private inbox */
function openPrivateInbox() {
    private_inbox_ref.value?.toggleModal()
}
/** Lấy bình luận chính từ bài post của fb */
function getFbPostComments() {
    get_fb_post_comments(
        {
            client_id: $props.client_id,
            page_id: $props.page_id,
            target_id: $props.target_id
        },
        (e, r) => {
            post_comments.value = r
            getFbPostChildComments()
        }
    )
}
/** Lấy bình luận phụ từ bình luận chính của fb */
function getFbPostChildComments() {

    eachOfLimit(
        post_comments.value,
        1,
        (comment: FacebookCommentPost, index, next) => {

            comment.child_comments = []
            comment.more_comments = false
            comment.new_comment = ''
            comment.sending_message = false

            get_fb_post_comments(
                {
                    client_id: $props.client_id,
                    page_id: $props.page_id,
                    target_id: comment.comment_id
                },
                (e, r) => {
                    comment.child_comments = r

                    next()
                }
            )
        },
        (e) => e ?  console.log(e) : console.log('DONE', post_comments.value)
    )
}
/** Focus vào input của bình luận */
function focusInput(comment_id: string) {
    let input = document.getElementById(`input_${comment_id}`)
    if(input) input.focus()
}
/** Tạo bình luận phụ vào 1 bình luận trong bài post */
function sendPostComment(
    comment: string, 
    target_id: string, 
    comment_index: number
) {
    if(post_comments.value[comment_index].sending_message) return
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
            if(e) return toast('error', 'Gửi bình luận không thành công')
            toast('success', 'Gửi bình luận thành công')
        
            post_comments.value[comment_index].child_comments?.push({
                comment_id: r.id,
                from: {
                    id: conversationStore.select_conversation?.fb_page_id,
                    name: pageStore.selected_page_list_info?.[
                        conversationStore.select_conversation?.fb_page_id as string
                    ]?.page?.name
                },
                message: comment
            })

        }
    )
}


defineExpose({ toggleModal })
</script>