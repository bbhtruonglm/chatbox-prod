<template>
    <div class="w-full h-full bg-slate-100 md:bg-white">
        <div class="bg-white pt-[65px] md:pt-8 xl:pt-4">
            <div class="pl-14 pr-4 md:pl-4">
                <div class="relative md:w-[300px]">
                    <img width="23" height="23" class="absolute top-[6px] left-[10px]" src="@/assets/icons/search.svg">
                    <input v-model="search" class="w-full border-2 rounded-full py-1 pl-10 pr-2 " type="text"
                        :placeholder="$t('v1.view.main.dashboard.select_page.search_placeholder')">
                </div>
            </div>
            <div class="overflow-hidden overflow-x-auto px-4 mt-1">
                <div class="flex w-max">
                    <div @click="current_selected_tab = tab.key"
                        class="font-semibold px-4 py-1 cursor-pointer border-b-2 border-white text-slate-400 hover:border-orange-500 hover:font-semibold hover:text-black"
                        :class="{ '!text-black !border-orange-500': current_selected_tab === tab.key }"
                        v-for="tab of  LIST_TAB_SELECT">{{ tab.title }}
                    </div>
                </div>
            </div>
        </div>
        <div class="px-2 relative h-[calc(100%_-_229px)] md:h-[calc(100%_-_169px)]">
            <div class="flex justify-end py-2 top-[-39px] right-[8px] pr-[8px] md:absolute">
                <div @click="toggleSelectAllPage()" class="flex items-center cursor-pointer">
                    <div class="text-sm font-semibold">{{
                        $t('v1.view.main.dashboard.select_page.select_all_page') }}</div>
                    <input :checked="size(pageStore.selected_page_id_list) === size(pageStore.active_page_list)"
                        type="checkbox" class="w-[15px] h-[15px] ml-1 accent-orange-600">
                </div>
            </div>
            <div v-if="is_loading_active_page_list">
                <Loading class="mx-auto" />
            </div>
            <div :class="{ 'md:grid-cols-3 xl:grid-cols-4': commonStore.toggle_nav }"
                class="max-h-[calc(100%_-_36px)] overflow-hidden overflow-y-auto grid grid-cols-1 pb-5 md:max-h-full md:grid-cols-2 gap-2 md:gap-4 xl:grid-cols-3">
                <div v-for="page of active_page_list"
                    class="cursor-pointer bg-white rounded-md flex py-3 border-b-2 hover:border-orange-500 md:bg-slate-100">
                    <div class="w-[60px] flex justify-center items-center">
                        <div class="relative">
                            <img v-if="isPagePremium(page.page)" src="@/assets/icons/crown.svg" width="15" height="15"
                                class="absolute top-[-10px] left-[50%] translate-x-[-50%]">
                            <PageAvatar :page_avatar="page.page?.avatar" :page_type="page.page?.type"
                                :page_id="page.page?.fb_page_id" class="rounded-full" />
                        </div>
                    </div>
                    <div class="w-[calc(100%_-_150px)]">
                        <div class="text-base truncate">{{ page.page?.name }}</div>
                        <div class="flex items-center">
                            <PageTypeIcon :page_type="page.page?.type" />
                            <div class="text-sm text-slate-500 ml-1 truncate">
                                {{ page.page?.fb_page_id }}
                            </div>
                        </div>
                    </div>
                    <div class="w-[90px]">
                        <div class="flex justify-end">
                            <div @click="togglePagePriority(page.page?.fb_page_id, !page.page?.is_priority)">
                                <img v-if="page.page?.is_priority" src="@/assets/icons/star-active.svg" width="15"
                                    height="15" class="mr-4 cursor-pointer" />
                                <img v-else src="@/assets/icons/star-inactive.svg" width="15" height="15"
                                    class="mr-4 cursor-pointer" />
                            </div>
                            <img @click="inactivePage(page.page?.fb_page_id)" src="@/assets/icons/hide.svg" width="15"
                                height="15" class="mr-4 cursor-pointer" />
                            <input @click="toggleSelectThisPage(page.page?.fb_page_id)"
                                :checked="isSelectedThisPage(page.page?.fb_page_id)" type="checkbox"
                                class="w-[15px] h-[15px] mr-2 accent-orange-600">
                        </div>
                        <div class="text-center pt-[13px]">
                            <button @click="selectOnlyThisPage(page.page?.fb_page_id)"
                                class="bg-slate-600 text-white text-xs px-3 rounded-full h-[28px] hover:bg-slate-400">{{
                                    $t('v1.view.main.dashboard.select_page.chat_now') }}</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="h-[90px] md:h-[64px] bg-white rounded-t-[35px] md:rounded-none pt-4 md:pt-[10px] xl:pt-4 px-[40px]">
            <div>
                <button @click="goToChat()" :disabled="!size(pageStore.selected_page_id_list)"
                    :class="size(pageStore.selected_page_id_list) ? 'bg-orange-600 hover:bg-orange-500' : 'bg-slate-600 hover:bg-slate-500'"
                    class="w-full rounded-full py-1 text-white flex justify-center items-center  mx-auto md:w-[300px]">
                    {{ $t('v1.view.main.dashboard.select_page.munti_chat_page') }}
                    <div v-if="size(pageStore.selected_page_id_list)"
                        class="text-xs text-orange-600 bg-white rounded-full w-[19px] h-[19px] flex justify-center items-center ml-2">
                        {{ size(pageStore.selected_page_id_list) }}
                    </div>
                </button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { saveLocal, getLocal } from '@/service/helper/store'
import { useCommonStore, usePageStore, useStaffStore } from '@/stores'
import { flow } from '@/service/helper/async'
import { get_current_active_page, update_page } from '@/service/api/chatbox/n4-service'
import { debounce, map, mapValues, set, size } from 'lodash'
import { nonAccentVn } from '@/service/helper/format'
import { confirm } from '@/service/helper/alert'

import PageAvatar from '@/components/Avatar/PageAvatar.vue'
import PageTypeIcon from '@/components/Avatar/PageTypeIcon.vue'
import Loading from '@/components/Loading.vue'

import type { CbError } from '@/service/interface/function'
import type { PageInfo } from '@/service/interface/app/page'
import type { PageData } from '@/service/interface/app/page'
import { useRouter } from 'vue-router'

const { t: $t } = useI18n()
const $router = useRouter()
const commonStore = useCommonStore()
const pageStore = usePageStore()
const staffStore = useStaffStore()

const LIST_TAB_SELECT = [
    {
        title: $t(`v1.view.main.dashboard.select_page.all_platform`),
        key: 'ALL_PLATFORM'
    },
    ...$env.platform.map(n => {
        return {
            title: $t(`v1.view.main.dashboard.select_page.${n.toLowerCase()}`),
            key: n
        }
    })
]

// đọc data từ local
const current_selected_tab = ref(getLocal('current_selected_tab', 'ALL_PLATFORM'))
// lưu lại data vào local để khi f5 không bị reset
saveLocal(current_selected_tab, 'current_selected_tab')

/**danh sách page sau khi được lọc */
const active_page_list = ref<PageData[]>()
/**tìm kiếm danh sách page theo tên hoặc id */
const search = ref('')
/**gắn cờ loading cho danh sách page */
const is_loading_active_page_list = ref(false)

// lọc danh sách page khi được tìm kiếm
watch(() => search.value, () => {
    // kích hoạt loading
    is_loading_active_page_list.value = true

    delayFilterCurrentActivePage()
})
// lọc danh sách page khi chọn tab
watch(() => current_selected_tab.value, () => filterCurrentActivePage())
// nạp lại danh sách page thì có thay đổi
watch(() => pageStore.active_page_list, () => filterCurrentActivePage())

onMounted(() => getCurrentActivePage())

/**chọn | huỷ toàn bộ các page */
function toggleSelectAllPage() {
    // nếu tất cả các page được chọn -> huỷ chọn tất cả các page
    if (
        size(pageStore.selected_page_id_list) === size(pageStore.active_page_list)
    ) pageStore.selected_page_id_list = {}

    // nếu có một vài page đang được chọn -> chọn tất cả các page
    // nếu không có page nào được chọn -> chọn tất cả các page
    else
        pageStore.selected_page_id_list = mapValues(
            pageStore.active_page_list,
            () => true
        )
}
/**thay đổi giá trị lựa chọn page để chat */
function toggleSelectThisPage(page_id?: string) {
    if (!page_id) return

    // xoá flag khi page không được chọn
    if (isSelectedThisPage(page_id))
        delete pageStore.selected_page_id_list[page_id]
    // set flag khi page được chọn
    else
        pageStore.selected_page_id_list[page_id] = true
}
/**kiểm tra xem page có được chọn để chat hay không */
function isSelectedThisPage(page_id?: string) {
    if (!page_id) return false

    // format boolean
    return !!pageStore.selected_page_id_list?.[page_id]
}
/**delay khi tìm kiếm page */
const delayFilterCurrentActivePage = debounce(
    () => filterCurrentActivePage(),
    300
)
/**lọc danh sách page để hiển thị theo các điều kiện được lựa chọn */
function filterCurrentActivePage() {
    // kích hoạt loading
    is_loading_active_page_list.value = true

    // object -> array
    let array_page_list = map(pageStore.active_page_list)

    /**
     * lọc các page phù hợp điều kiện tìm kiếm
     * - tìm kiếm theo tên hoặc id
     * - lọc theo tab
     */
    array_page_list = array_page_list.filter(page_data => {
        // chuyển dữ liệu tìm kiếm về tiếng việt không dấu
        let formated_page_name = nonAccentVn(page_data.page?.name || '')
        let page_id = page_data.page?.fb_page_id || ''
        let formated_search_value = nonAccentVn(search.value)
        let page_type = page_data.page?.type

        if (
            // lọc theo tab
            (
                current_selected_tab.value === 'ALL_PLATFORM' ||
                current_selected_tab.value === page_type
            ) &&
            // tìm kiếm theo tên hoặc id
            (
                formated_page_name.includes(formated_search_value) ||
                page_id.includes(formated_search_value)
            )
        ) return true

        return false
    })

    /**
     * sắp xếp lại mảng theo quy tắc:
     * - ưu tiên sắp xếp các page được chọn trước
     * - sau đó sắp xếp theo các page được đánh dấu sao
     */
    let sort_priority_page_list = array_page_list.sort((page_a, page_b) => {
        /**sắp xếp các page có gắn dấu sao */
        const sortPriority = () => {
            const priority_a = page_a.page?.is_priority
            const priority_b = page_b.page?.is_priority

            // nếu cả 2 page đều gắn dấu sao thì giữ nguyên vị trí
            if (priority_a && priority_b) return 0

            // nếu chỉ page 1 gắn dấu sao thì ưu tiên page 1
            if (priority_a) return 1

            // nếu chỉ page 2 gắn dấu sao thì ưu tiên page 2
            if (priority_b) return -1

            // nếu không có page nào gắn sao thì giữ nguyên vị trí
            return 0
        }

        /**sắp xếp các page được chọn */
        const sortPageIsSelected = () => {
            const selected_a = pageStore.selected_page_id_list?.[page_a.page?.fb_page_id || '']
            const selected_b = pageStore.selected_page_id_list?.[page_b.page?.fb_page_id || '']

            // nếu cả 2 page được chọn thì tính dấu sao
            if (selected_a && selected_b) return sortPriority()

            // nếu chỉ page 1 được chọn thì chọn page 1
            if (selected_a) return 1

            // nếu chỉ page 2 được chọn thì chọn page 2
            if (selected_b) return -1

            // nếu không có page nào được chọn thì tính độ ưu tiên
            return sortPriority()
        }

        return sortPageIsSelected()
    })

    // đảo chiều mảng, vì hàm sort chạy theo ASC
    let reverse_page_list = sort_priority_page_list.reverse()

    active_page_list.value = reverse_page_list

    // tắt loading
    is_loading_active_page_list.value = false
}
/**lấy toàn bộ các page được kích hoạt của user này */
function getCurrentActivePage() {
    flow([
        (cb: CbError) => { // * kích hoạt loading
            is_loading_active_page_list.value = true

            cb()
        },
        (cb: CbError) => get_current_active_page((e, r) => {
            if (e) return cb(e)

            pageStore.active_page_list = r.page_list
            staffStore.staff_list_of_active_page = r.all_staff_list
            cb()
        })
    ], e => {
        // tắt loading
        is_loading_active_page_list.value = false
    })
}
/**kiểm tra xem page này đã được kích hoạt gói | kích hoạt dùng thử hay chưa */
function isPagePremium(page?: PageInfo) {
    const CURRENT_DATE = new Date().getTime()

    if (page?.end_date_trial && page?.end_date_trial > CURRENT_DATE) return true

    if (page?.pricing_id && page?.end_date && page?.end_date > CURRENT_DATE) return true

    return false
}
/**đánh dấu sao page ưu tiên lên đầu */
function togglePagePriority(page_id?: string, is_priority?: boolean) {
    flow([
        // * call api update page
        (cb: CbError) => update_page({ page_id, is_priority }, (e, r) => {
            if (e) return cb(e)

            cb()
        }),
        // * sort lại danh sách page
        (cb: CbError) => {
            if (!page_id) return cb()

            cb()

            set(
                pageStore.active_page_list,
                [page_id, 'page', 'is_priority'],
                is_priority
            )

            filterCurrentActivePage()
        }
    ], undefined, true)
}
/**huỷ kích hoạt page này */
function inactivePage(page_id?: string) {
    flow([
        // * hỏi trước khi thực hiện hành động
        (cb: CbError) => confirm(
            'question',
            $t('v1.view.main.dashboard.select_page.inactive_page.title'),
            '',
            (e, r) => {
                if (e) return

                cb()
            }
        ),
        // * kích hoạt loading
        (cb: CbError) => {
            commonStore.is_loading_full_screen = true

            cb()
        },
        // * call api update page
        (cb: CbError) => update_page({ page_id, is_active: false }, (e, r) => {
            if (e) return cb(e)

            cb()
        }),
        // * xoá page bị ẩn khỏi danh sách page
        (cb: CbError) => {
            if (!page_id) return cb()

            delete pageStore.active_page_list[page_id]

            filterCurrentActivePage()

            cb()
        }
    ], e => {
        // tắt loading
        commonStore.is_loading_full_screen = false
    })
}
/**chỉ chọn 1 page này để chat */
function selectOnlyThisPage(page_id?: string) {
    if (!page_id) return

    let temp: {
        [index: string]: boolean
    } = {}

    temp[page_id] = true

    pageStore.selected_page_id_list = temp

    goToChat()
}
/**đi đến trang chat */
function goToChat() {
    if (!size(pageStore.selected_page_id_list)) return

    $router.push('/main/chat')
}
</script>