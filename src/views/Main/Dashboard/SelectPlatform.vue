<template>
    <div class="w-full h-full bg-slate-100 md:bg-white">
        <div class="bg-white pt-[65px] md:pt-8 xl:pt-4">
            <div class="pl-14 pr-4 md:pl-4">
                <Search class="md:w-[300px]" v-model="search" :placeholder="$t('v1.common.page_search_placeholder')" />
            </div>
            <PlatformTab v-model="current_selected_tab" :platform_list="LIST_TAB_SELECT" />
        </div>
        <div class="px-2 pt-2 relative h-[calc(100%_-_229px)] md:h-[calc(100%_-_169px)]">
            <div class="flex items-center justify-between mb-2 md:absolute md:top-[-40px] md:right-[9px]">
                <div class="text-slate-500 mr-1">
                    {{ $t('v1.view.main.dashboard.select_platform.empty_page') }}
                </div>
                <Facebook @access_token="syncFacebookPage" class="w-[130px] h-[40px]" border_radius="5px"
                    :text="$t('v1.view.main.dashboard.select_platform.add_page')" />
            </div>
            <div v-if="is_loading_active_page_list" class="absolute left-[50%] translate-x-[-50%]">
                <Loading class="mx-auto" />
            </div>
            <div v-if="!active_page_list || !active_page_list.length"
                class="h-[calc(100%_-_36px)] md:h-full flex justify-center pt-10">
                <div>
                    <img src="@/assets/icons/empty-page.svg" class="mx-auto w-[200px]">
                    <div class="text-center text-slate-500">
                        {{ $t('v1.view.main.dashboard.select_platform.click_add_page') }}
                    </div>
                </div>
            </div>
            <div :class="{ 'md:grid-cols-3 xl:grid-cols-4': commonStore.toggle_nav }"
                class="max-h-[calc(100%_-_36px)] overflow-hidden overflow-y-auto grid grid-cols-1 pb-5 md:max-h-full md:grid-cols-2 gap-2 md:gap-4 xl:grid-cols-3">
                <PageItem v-for="page of active_page_list" :page_info="page.page">
                    <div class="flex justify-end">
                        <input @click="toggleSelectThisPage(page.page?.fb_page_id)"
                            :checked="isSelectedThisPage(page.page?.fb_page_id)" type="checkbox"
                            class="w-[15px] h-[15px] mr-2 accent-orange-600">
                    </div>
                </PageItem>
            </div>
        </div>
        <FooterButton :text="$t('v1.view.main.dashboard.select_platform.active')" @click_btn="goToChat()"
            :disabled="!size(pageStore.selected_page_id_list)" :count="size(pageStore.selected_page_id_list)" />
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useCommonStore, usePageStore, useStaffStore } from '@/stores'
import { flow } from '@/service/helper/async'
import {
    get_current_active_page, sync_facebook_page
} from '@/service/api/chatbox/n4-service'
import { debounce, map, size } from 'lodash'
import { nonAccentVn } from '@/service/helper/format'
import { useRouter } from 'vue-router'

import Loading from '@/components/Loading.vue'
import Search from '@/components/Main/Dashboard/Search.vue'
import PlatformTab from '@/components/Main/Dashboard/PlatformTab.vue'
import PageItem from '@/components/Main/Dashboard/PageItem.vue'
import FooterButton from '@/components/Main/Dashboard/FooterButton.vue'
import Facebook from '@/components/OAuth/Facebook.vue'

import type { CbError } from '@/service/interface/function'
import type { PageData } from '@/service/interface/app/page'

const { t: $t } = useI18n()
const $router = useRouter()
const commonStore = useCommonStore()
const pageStore = usePageStore()
const staffStore = useStaffStore()

const LIST_TAB_SELECT = $env.platform.map(n => {
    return {
        title: $t(`v1.view.main.dashboard.select_page.${n.toLowerCase()}`),
        key: n
    }
})

/**nền tảng hiện tại đang được chọn */
const current_selected_tab = ref('FB_MESS')

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

/**đồng bộ dữ liệu page mới nhất từ fb */
function syncFacebookPage(access_token: string) {
    flow([
        // * call api đồng bộ page từ fb
        (cb: CbError) => sync_facebook_page(access_token, (e, r) => {
            if (e) return cb(e)

            cb()
        }),
        // * load lại danh sách page mới nhất
        (cb: CbError) => {
            getCurrentActivePage()

            cb()
        }
    ], undefined, true)
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
        (cb: CbError) => get_current_active_page({}, (e, r) => {
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
/**đi đến trang chat */
function goToChat() {
    if (!size(pageStore.selected_page_id_list)) return

    $router.push('/main/chat')
}
</script>