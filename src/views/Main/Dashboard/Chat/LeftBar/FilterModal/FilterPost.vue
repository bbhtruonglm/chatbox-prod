<template>
    <Dropdown ref="filter_dropdown_ref" :is_fit="false" width="540px" height="640px" position="RIGHT" :back="300">
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
                            class="w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-700 peer-focus:ring-4 peer-focus:ring-orange-300 dark:peer-focus:ring-orange-800 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-orange-500">
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
            <div class="overflow-hidden overflow-y-scroll"
                :class="{ 'h-[300px]': !filter_post, 'h-[490px]': filter_post }">
                <div class="w-full flex items-center justify-between py-2.5 border-b cursor-pointer hover:bg-orange-100 px-2"
                    v-for="post, index in fb_post" @click="selectPost(index)">
                    <div class="flex justify-between items-center w-full">
                        <div class="mr-3">
                            <img class="min-w-[64px] w-[64px] h-[68px] rounded-lg"
                                :src="post.attachments.data[0].media.image.src" alt="">
                        </div>
                        <div class="w-full">
                            <div class="flex justify-between w-full mb-2">
                                <div class="text-orange-500 text-xs">{{ post.content.id }}</div>
                                <div class="text-xs text-gray-500">
                                    {{ format(new Date(post.content.updated_time), 'HH:mm dd/MM/yyyy') }}
                                </div>
                            </div>
                            <div class="flex justify-between items-center">
                                <div class="w-[350px] h-[43px] overflow-hidden text-gray-700">
                                    {{ post.message }}
                                </div>
                                <img v-if="post.is_selected" class="w-5 h-5 mt-[-14px]"
                                    src="@/assets/icons/check-circle.svg">
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="w-full mt-5" v-if="!filter_post">
                <div class="w-full flex items-center justify-between mb-3">
                    <div class="text-sm text-black">Trang đã trả lời</div>
                    <label class="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" class="sr-only peer">
                        <div
                            class="w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-700 peer-focus:ring-4 peer-focus:ring-orange-300 dark:peer-focus:ring-orange-800 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-orange-500">
                        </div>
                    </label>
                </div>
                <div class="w-full flex items-center justify-between mb-3">
                    <div class="text-sm text-black">Trang đã inbox</div>
                    <label class="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" class="sr-only peer">
                        <div
                            class="w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-700 peer-focus:ring-4 peer-focus:ring-orange-300 dark:peer-focus:ring-orange-800 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-orange-500">
                        </div>
                    </label>
                </div>
                <div class="w-full flex items-center justify-between mb-3">
                    <div class="text-sm text-black">Bình luận có số điện thoại</div>
                    <label class="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" class="sr-only peer">
                        <div
                            class="w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-700 peer-focus:ring-4 peer-focus:ring-orange-300 dark:peer-focus:ring-orange-800 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-orange-500">
                        </div>
                    </label>
                </div>
                <div class="w-full flex items-center justify-between mb-3">
                    <div class="text-sm text-black">Bình luận có email</div>
                    <label class="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" class="sr-only peer">
                        <div
                            class="w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-700 peer-focus:ring-4 peer-focus:ring-orange-300 dark:peer-focus:ring-orange-800 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-orange-500">
                        </div>
                    </label>
                </div>
                <div class="w-full flex items-center justify-between mb-3">
                    <div class="text-sm text-black">Chọn thời gian</div>
                    <div>
                        <img :src="ArrowRightIcon" alt="">
                    </div>
                </div>
            </div>
            <div class="w-full flex justify-end mt-3">
                <button class="text-white bg-gray-500 px-3 py-1 rounded-lg mr-3">Hủy lọc</button>
                <button class="text-white bg-orange-500 px-5 py-1 rounded-lg">Lọc</button>
            </div>
        </div>
    </Dropdown>
</template>
<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { isMobile } from '@/service/function'
import { nonAccentVn } from '@/service/helper/format'
import { map, debounce, sortBy, mapValues, size } from 'lodash'
import { get_post_list } from '@/service/api/chatbox/n4-service'
import { useConversationStore, usePageStore, useCommonStore } from '@/stores'
import { format } from 'date-fns'

import Dropdown from '@/components/Dropdown.vue'
import ModalBottom from '@/components/ModalBottom.vue'
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
/** Danh sách bài post */
const fb_post = ref<FacebookPost[]>([])
/** Trạng thái lọc theo comment */
const filter_post = ref<boolean>(false)
/** Biến tạm lưu id bài đăng cần tìm kiếm */
const search_post_id = ref<string>('')

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
            sort: '-created_time'
        },
        (e, r) => {
            fb_post.value = r?.fb_post || []
        }
    )
}
/** Tìm kiếm bài post */
function searchPost() {

}
/** Lựa chọn bài post */
function selectPost(index: number) {
    fb_post.value[index].is_selected = !fb_post.value[index].is_selected
}


defineExpose({ toggle, toggleModal, filter_modal_ref, filter_dropdown_ref, clearThisFilter })
</script>