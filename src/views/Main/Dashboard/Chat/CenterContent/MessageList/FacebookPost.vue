<template>
    <div v-if="get_post_success && !loading" class="w-full my-3 flex justify-end">
        <div class="w-[95%] bg-white rounded-lg p-3">
            <div class="flex text-xs justify-between items-center text-slate-600">
                <p class="md:w-full w-[50%]">
                    {{ $t('v1.view.main.dashboard.chat.post.post_by') }}
                    <span class="font-bold" v-if="post_info?.admin_creator?.name">
                        {{ post_info?.admin_creator?.name }}
                    </span>
                    <span class="font-bold" v-if="!post_info?.admin_creator?.name && post_info?.from?.name">
                        {{ post_info?.from?.name }}
                    </span>
                <div v-if="post_info?.updated_time">
                    {{ format(new Date(post_info?.updated_time as string), `dd/MM/yy HH:mm`) }}
                </div>
                </p>
                <div class="rounded-3xl p-1 bg-orange-200 text-orange-500 font-bold whitespace-nowrap cursor-pointer"
                    @click="copyToClipboard(post_info?.id as string)">
                    <p class="flex">
                    <p class="w-[80px] md:hidden xl:block truncate">{{ post_info?.id }}</p>
                    <span>(Copy)</span>
                    </p>
                </div>
            </div>
            <div class="flex items-center mt-2">
                <object v-if="post_info?.attachments?.data?.[0].media?.image?.src"
                    :data="post_info?.attachments?.data?.[0].media?.image?.src" type="image/png"
                    class="w-[60px] h-[60px] mr-3 rounded">
                    <img src="@/assets/icons/bbh-mini.svg" class="w-[60px] h-[60px]">
                </object>
                <div class="text-sm text-slate-700 font-normal h-[60px] w-full overflow-hidden">
                    {{ post_info?.message }}
                </div>
            </div>
            <div class="flex mt-2 bg-slate-100 p-3 rounded-md justify-between">
                <p class="text-sm font-semibold truncate w-[150px] md:w-[100px] xl:w-[200px]">
                    {{ post_info?.attachments?.data?.[0].title }}
                </p>
                <div class="flex">
                    <button @click="toggleModal"
                        class="bg-blue-600 p-1 rounded-md text-xs text-white mr-1 font-medium whitespace-nowrap">
                        {{ $t('v1.view.main.dashboard.chat.post.open_message') }}
                    </button>
                    <img :src="NoteIcon" alt="">
                </div>
            </div>
            <div class="flex justify-end mt-2">
                <p class="text-slate-700 text-xs underline cursor-pointer"
                    @click="openPost(post_info.permalink_url as string)">
                    {{ $t('v1.view.main.dashboard.chat.post.open_on_facebook') }}
                </p>
            </div>
        </div>
    </div>
    <div class="w-full sm:h-[180px] h-[190px] justify-end my-3 flex" v-if="!get_post_success">
        <div class="w-[95%] h-full text-white bg-slate-400 rounded-lg flex items-center justify-center">
            <p>{{ $t('v1.view.main.dashboard.chat.post.cannot_get_post') }}</p>
        </div>
    </div>
    <div class="w-full sm:h-[180px] h-[190px] justify-end my-3 flex" v-if="loading">
        <div class="w-[95%] h-full text-white bg-slate-400 rounded-lg flex items-center justify-center">
            <Loading type="FULL" />
        </div>

    </div>
    <FacebookCommentModal ref="fb_cmt_ref" :page_id="conversationStore.select_conversation?.fb_page_id"
        :client_id="conversationStore.select_conversation?.fb_client_id" :target_id="post_info?.id"
        :post_title="post_info.attachments?.data?.[0]?.title" />
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { format } from 'date-fns';

// * API
import {
    get_post_from_ad_id,
    get_post_from_post_id
} from '@/service/api/chatbox/n4-service';

// * Component
import Loading from '@/components/Loading.vue';
import FacebookCommentModal from '@/components/Main/Dashboard/FacebookCommentModal.vue';

// * Icon
import NoteIcon from "@/assets/icons/note.svg"

// * Store
import { useConversationStore } from '@/stores';

// * Helpers
import { copyToClipboard } from '@/service/helper/copyWithAlert'

// * Props
const $props = withDefaults(defineProps<{
    fb_post_id?: string
    ad_id?: string
    hidePost: Function
}>(), {})

// * Interface
import type { ComponentRef } from '@/service/interface/vue';
interface FacebookPostInfo {
    id?: string
    admin_creator?: {
        id: string
        name: string
    }
    from?: {
        id: string
        name: string
    }
    attachments?: {
        data?: [
            {
                media?: {
                    image?: {
                        src?: string
                    }
                }
                title?: string
            }
        ]
    }
    message?: string
    permalink_url?: string
    created_time?: string
    updated_time?: string
}

// * Use store
const conversationStore = useConversationStore()

/** ref của modal */
const fb_cmt_ref = ref<ComponentRef>()
/** trạng thái lấy bài post có thành công hay ko */
const get_post_success = ref<boolean>(true)
/** trạng loading bài post */
const loading = ref<boolean>(true)
/** Dữ liệu bài post */
const post_info = ref<FacebookPostInfo>({})

onMounted(() => {
    if ($props.fb_post_id) getPostFromPostId()
    if ($props.ad_id) getPostFromAdId()
})

/** Dùng để bật tắt modal */
function toggleModal() {
    fb_cmt_ref.value?.toggleModal()
}

/** Lấy dữ liệu bài post từ ad_id  */
function getPostFromAdId() {
    get_post_from_ad_id(
        {
            page_id: conversationStore.select_conversation?.fb_page_id,
            ad_id: $props.ad_id
        },
        (e, r) => {
            loading.value = false
            if (!r || !r.id) {
                get_post_success.value = false
                $props.hidePost(true)
                return
            }
            post_info.value = r
        }
    )
}

/** Lấy dữ liệu bài post từ post_id */
function getPostFromPostId() {
    get_post_from_post_id(
        {
            page_id: conversationStore.select_conversation?.fb_page_id,
            post_id: $props.fb_post_id
        },
        (e, r) => {
            loading.value = false
            if (!r || !r.id) return get_post_success.value = false
            post_info.value = r
        }
    )
}

/** Mở bài post trên fb bằng permalink_url */
function openPost(permalink_url: string) {
    window.open(permalink_url, '_blank')
}

</script>