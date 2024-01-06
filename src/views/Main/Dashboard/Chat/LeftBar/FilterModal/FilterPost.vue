<template>
    <ModalBottom ref="filter_modal_ref" :left="commonStore.conversation_filter_modal_left"
        :width="commonStore.conversation_filter_modal_width">
        <template v-slot:header>
            <!-- <span v-if="!filter_post">{{ $t('v1.view.main.dashboard.chat.filter.post.filter_by_comment') }}</span> -->
            <span>{{ $t('v1.view.main.dashboard.chat.filter.post.filter_by_post') }}</span>
        </template>
        <template v-slot:body>
            <div class="max-h-[50vh] overflow-hidden overflow-y-scroll">
                <div v-for="post, index in fb_post" @click="selectPost(index)"
                    class="flex p-2 border-b justify-between items-center">
                    <div class="mr-2">
                        <object :data="post?.attachments?.data[0]?.media?.image?.src" type="image/png"
                            class="min-w-[35px] w-[35px] h-[35px] rounded-lg object-cover">
                            <img src="@/assets/imgs/chatbox.svg" class="w-[35px] h-[35px]" />
                        </object>
                    </div>
                    <div class="w-[90%]">
                        <div class="flex justify-between mb-1">
                            <div class="text-xs text-orange-600">{{ post.content.id }}</div>
                            <div class="text-xs text-gray-500">
                                {{ format(new Date(post.content.updated_time), 'HH:mm dd/MM/yyyy') }}
                            </div>
                        </div>
                        <div class="text-xs w-[80%] truncate">{{ post.message }}</div>
                    </div>
                    <img v-show="post.is_selected" class="w-5 h-5 absolute right-4 mt-3.5"
                        src="@/assets/icons/check-circle.svg">
                </div>
            </div>
        </template>
        <template v-slot:footer>
            <div class="grid grid-cols-2 gap-4">
                <FilterButton @click="clearThisFilter" type="text-slate-500 hover:text-white hover:bg-slate-500"
                    :title="$t('v1.view.main.dashboard.chat.filter.un_filter')" />
                <FilterButton @click="filterPost()"
                    type="border-orange-500 text-orange-500 hover:text-white hover:bg-orange-500"
                    :title="$t('v1.view.main.dashboard.chat.filter.title')" />
            </div>
        </template>
    </ModalBottom>
    <Dropdown ref="filter_dropdown_ref" :is_fit="false" width="450px" height="570px" position="RIGHT" :back="350">
        <div class="text-sm  h-full w-full">
            <div class="border-b font-semibold pb-1 flex items-center justify-between">
                <div>
                    <span v-if="!filter_post">{{ $t('v1.view.main.dashboard.chat.filter.post.filter_by_comment') }}</span>
                    <span v-if="filter_post">{{ $t('v1.view.main.dashboard.chat.filter.post.filter_by_post') }}</span>
                </div>
                <div>
                    <label class="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" v-model="filter_post" class="sr-only peer">
                        <div
                            class="w-11 h-6 bg-gray-200 rounded-full dark:bg-gray-700 peer-focus:ring-0 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-orange-500">
                        </div>
                    </label>
                </div>
            </div>
            <div class="py-3">
                <input ref="search_ref" type="text"
                    :placeholder="$t('v1.view.main.dashboard.chat.filter.post.find_id_post')"
                    class="border px-3 py-1 w-full rounded-lg focus:outline-none" v-on:keyup="searchPost"
                    v-model="search_post_id">
            </div>
            <div class="overflow-hidden overflow-y-scroll" :class="{ 'h-[250px]': !filter_post, 'h-[420px]': filter_post }">
                <div class="w-full flex items-center justify-between py-2.5 border-b cursor-pointer hover:bg-orange-100 px-2"
                    v-for="post, index in fb_post" @click="selectPost(index)">
                    <div class="flex justify-between items-center w-full">
                        <div class="mr-3">
                            <object :data="post?.attachments?.data[0]?.media?.image?.src" type="image/png"
                                class="min-w-[64px] w-[64px] h-[64px] rounded-lg object-cover">
                                <img src="@/assets/imgs/chatbox.svg" class="w-[64px] h-[64px]" />
                            </object>
                        </div>
                        <div class="w-full">
                            <div class="flex justify-between w-full mb-2">
                                <div class="text-orange-600 text-xs">{{ post.content.id }}</div>
                                <div class="text-xs text-gray-500">
                                    {{ format(new Date(post.content.updated_time), 'HH:mm dd/MM/yyyy') }}
                                </div>
                            </div>
                            <div class="flex justify-between items-center">
                                <div class="w-[250px] text-gray-700 post-truncate">
                                    {{ post.message }}
                                </div>
                                <img v-if="post.is_selected" class="w-5 h-5 mt-[-14px]"
                                    src="@/assets/icons/check-circle.svg">
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="w-full mt-5 mb-5" v-if="!filter_post">
                <div class="grid grid-cols-3 mb-3 gap-3">
                    <div class="text-sm text-black">{{ $t('v1.view.main.dashboard.chat.filter.post.page_reply') }}</div>
                    <div>
                        <label class="text-sm cursor-pointer flex items-center">
                            <input type="radio" value="YES" v-model="filter_keys.is_reply"
                                class=" ml-5 w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-0 custom-radio mr-1.5">
                            <span>{{ $t('v1.view.main.dashboard.chat.filter.post.replied') }}</span>
                        </label>
                    </div>
                    <div>
                        <label class="text-sm cursor-pointer flex items-center">
                            <input type="radio" value="NO" v-model="filter_keys.is_reply"
                                class=" ml-5 w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-0 custom-radio mr-1.5">
                            <span>{{ $t('v1.view.main.dashboard.chat.filter.post.unreplied') }}</span>
                        </label>
                    </div>
                </div>
                <div class="grid grid-cols-3 mb-3 gap-3">
                    <div class="text-sm text-black">{{ $t('v1.view.main.dashboard.chat.filter.post.page_inbox') }}</div>
                    <div>
                        <label class="text-sm cursor-pointer flex items-center">
                            <input type="radio" value="YES" v-model="filter_keys.is_private_reply"
                                class=" ml-5 w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-0 custom-radio mr-1.5">
                            <span>{{ $t('v1.view.main.dashboard.chat.filter.post.replied') }}</span>
                        </label>
                    </div>
                    <div>
                        <label class="text-sm cursor-pointer flex items-center">
                            <input type="radio" value="NO" v-model="filter_keys.is_private_reply"
                                class=" ml-5 w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-0 custom-radio mr-1.5">
                            <span>{{ $t('v1.view.main.dashboard.chat.filter.post.unreplied') }}</span>
                        </label>
                    </div>
                </div>
                <div class="grid grid-cols-3 mb-3 gap-3">
                    <div class="text-sm text-black">{{ $t('v1.view.main.dashboard.chat.filter.post.have_phone') }}</div>
                    <div>
                        <label class="text-sm cursor-pointer flex items-center">
                            <input type="radio" value="YES" v-model="filter_keys.have_phone"
                                class=" ml-5 w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-0 custom-radio mr-1.5">
                            <span>{{ $t('v1.view.main.dashboard.chat.filter.post.yes') }}</span>
                        </label>
                    </div>
                    <div>
                        <label class="text-sm cursor-pointer flex items-center">
                            <input type="radio" value="NO" v-model="filter_keys.have_phone"
                                class=" ml-5 w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-0 custom-radio mr-1.5">
                            <span>{{ $t('v1.view.main.dashboard.chat.filter.post.no') }}</span>
                        </label>
                    </div>
                </div>
                <div class="grid grid-cols-3 mb-3 gap-3">
                    <div class="text-sm text-black">{{ $t('v1.view.main.dashboard.chat.filter.post.have_email') }}</div>
                    <div>
                        <label class="text-sm cursor-pointer flex items-center">
                            <input type="radio" value="YES" v-model="filter_keys.have_email"
                                class=" ml-5 w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-0 custom-radio mr-1.5">
                            <span>{{ $t('v1.view.main.dashboard.chat.filter.post.yes') }}</span>
                        </label>
                    </div>
                    <div>
                        <label class="text-sm cursor-pointer flex items-center">
                            <input type="radio" value="NO" v-model="filter_keys.have_email"
                                class=" ml-5 w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-0 custom-radio mr-1.5">
                            <span>{{ $t('v1.view.main.dashboard.chat.filter.post.no') }}</span>
                        </label>
                    </div>
                </div>
                <div class="flex items-center justify-between cursor-pointer" @click="date_picket_ref?.toggle">
                    <div class="text-sm text-black">Chọn thời gian</div>
                    <div class=" cursor-pointer">
                        <img :src="ArrowRightIcon" alt="" class="mr-3">
                    </div>
                </div>
            </div>
            <div class="w-full flex justify-end absolute bottom-3 right-3">
                <button @click="cancelFilter" class="text-white bg-gray-500 px-3 py-1 rounded-lg mr-3">
                    {{ $t('v1.view.main.dashboard.chat.filter.post.cancel_filter') }}
                </button>
                <button @click="filterPost" class="text-white bg-orange-500 px-5 py-1 rounded-lg">
                    {{ $t('v1.view.main.dashboard.chat.filter.post.filter') }}
                </button>
            </div>
        </div>
    </Dropdown>
    <FilterDateOfPost ref="date_picket_ref" :time_picked="updateFilterTime"
        :time_range="{ start_time: Date.now(), end_time: Date.now() }" />
</template>
<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { isMobile } from '@/service/function'
import { map, debounce, keys } from 'lodash'
import { get_post_list } from '@/service/api/chatbox/n4-service'
import { useConversationStore, usePageStore, useCommonStore } from '@/stores'
import { format } from 'date-fns'

import Dropdown from '@/components/Dropdown.vue'
import ModalBottom from '@/components/ModalBottom.vue'
import FilterDateOfPost from '@/components/Main/Dashboard/FilterDateOfPost.vue'
import FilterButton from '@/views/Main/Dashboard/Chat/LeftBar/FilterModal/FilterButton.vue'

import ArrowRightIcon from '@/assets/icons/arrow-right.svg'

import type { ComponentRef } from '@/service/interface/vue'
import type { FacebookPost } from '@/service/interface/app/post'



const pageStore = usePageStore()
const commonStore = useCommonStore()
const conversationStore = useConversationStore()

/** ref của modal */
const filter_modal_ref = ref<ComponentRef>()
/**ref của dropdown */
const filter_dropdown_ref = ref<ComponentRef>()
/** ref của date picker */
const date_picket_ref = ref<ComponentRef>()
/** Danh sách bài post */
const fb_post = ref<FacebookPost[]>([])
/** Trạng thái lọc theo comment */
const filter_post = ref<boolean>(false)
/** Biến tạm lưu id bài đăng cần tìm kiếm */
const search_post_id = ref<string>('')
/** Biến tạm lưu giá trị bộ lọc */
const filter_keys = ref<{ [index: string]: string }>({
    is_reply: conversationStore.option_filter_page_data.is_reply || '',
    have_email: conversationStore.option_filter_page_data.have_email || '',
    have_phone: conversationStore.option_filter_page_data.have_phone || '',
    is_private_reply: conversationStore.option_filter_page_data.is_private_reply || ''
})
/** Thời gian lọc */
const filter_times = ref<{
    start_time: number
    end_time: number
}>({
    start_time: 0,
    end_time: 0
})
// * Trạng thái có lọc theo bài post hay không
const filter_timerange = ref<boolean>(false)


onMounted(() => {
    getPostList()
})

/** Ẩn hiện modal */
function toggleModal() {
    filter_modal_ref.value?.toggleModal()
}
/** Hiển thị */
function toggle($event: MouseEvent) {
    // nếu mobile thì mở bottom modal
    if (isMobile()) toggleModal()
    // nếu là pc thỉ mở dropdown
    else filter_dropdown_ref.value?.toggleDropdown($event)
}
/** Xoá lọc */
function clearThisFilter() {
    cancelFilter()
}
/** Lấy danh sách bài post */
function getPostList() {
    let page_ids: string[] = []
    // * Tạo mảng danh sách id page đã chọn
    map(pageStore.selected_page_id_list, (value, key) => { page_ids.push(key) })

    // * Gọi api lấy danh sách post
    get_post_list(
        {
            fb_page_id: { $in: page_ids },
            sort: '-created_time',
            search: search_post_id.value
        },
        (e, r) => {
            // * Lưu thông tin bài post
            fb_post.value = r?.fb_post || []

            // * Lấy thông tin bài post đã chọn và lưu vào store
            let post_selected = conversationStore.option_filter_page_data.post_id

            // * Check từng bài post xem đã đươc đánh dấu hay chưa?
            fb_post.value = fb_post.value.map(item => {

                /** Nếu bài post được chọn thì đánh dấu là active */
                if (post_selected?.includes(item.content.id)) {
                    item.is_selected = true
                }

                return item
            })
        }
    )
}
/** Tìm kiếm bài post */
const searchPost = debounce(() => { getPostList() }, 100)
/** Lựa chọn bài post */
function selectPost(index: number) {
    fb_post.value[index].is_selected = !fb_post.value[index].is_selected
}
/** Cập nhật lại thời gian filter */
function updateFilterTime(start_time: number, end_time: number) {
    filter_times.value = { start_time, end_time }
    // * Gắn cờ là có filter theo thời gian
    filter_timerange.value = true
}
/** Hủy lọc */
function cancelFilter() {
    filter_keys.value = {
        is_reply: "",
        have_email: "",
        have_phone: "",
        is_private_reply: ""
    }
    conversationStore.option_filter_page_data = {
        ...conversationStore.option_filter_page_data,
        ...filter_keys.value,
        ...{ post_id: '', time_range: {} }
    }
    fb_post.value = fb_post.value.map(item => {
        item.is_selected = false
        return item
    })
}
/** Lọc bài post */
function filterPost() {

    // Chỉ lọc theo bài post
    if (filter_post.value) {
        const keys: { [index: string]: string } = {
            is_reply: "",
            have_email: "",
            have_phone: "",
            is_private_reply: ""
        }
        conversationStore.option_filter_page_data = {
            ...conversationStore.option_filter_page_data,
            ...keys,
            ...{
                post_id: mergePostSelect(),
                time_range: {}
            }
        }
        return
    }

    // * Lọc theo toàn bộ lựa chọn đang có
    conversationStore.option_filter_page_data = {
        ...conversationStore.option_filter_page_data,
        ...filter_keys.value,
        ...{
            post_id: mergePostSelect(),
            time_range: filter_timerange.value ? {
                gte: filter_times.value.start_time,
                lte: filter_times.value.end_time
            } : {}
        }
    }
    toggleModal()
}
/** Gom bài post đã chọn thành 1 string để filter */
function mergePostSelect(): string {
    let post_selected: string[] = []
    fb_post.value.map(item => {
        if (item.is_selected) post_selected.push(item.content.id)
    })
    return post_selected.join(' ')
}

defineExpose({ toggle, toggleModal, filter_modal_ref, filter_dropdown_ref, clearThisFilter })
</script>

<style>
.post-truncate {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    font-size: 12px;
}

.custom-radio:checked {
    accent-color: orangered;
}
</style>