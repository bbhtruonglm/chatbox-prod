<template>
    <div class="w-full h-full bg-slate-100 md:bg-white">
        <div class="bg-white pt-[65px] md:pt-8 xl:pt-4">
            <div class="pl-14 pr-4 md:pl-4 h-[35px] flex items-center justify-end">
                <span class="text-slate-400">{{ $t('v1.view.main.dashboard.pricing.help.you_need_help') }}</span>
                <a href="https://m.me/1706801539392655" target="_blank"
                    class="hover:underline cursor-pointer text-orange-600 ml-1">{{
                        $t('v1.view.main.dashboard.pricing.help.connect_us') }}</a>
            </div>
            <PlatformTab v-model="current_selected_tab" :platform_list="list_tab_select" />
        </div>
        <div class="px-2 pt-2 relative h-[calc(100%_-_229px)] md:h-[calc(100%_-_169px)]">
            <div v-if="is_loading_pricing_list" class="absolute left-[50%] translate-x-[-50%]">
                <Loading class="mx-auto" />
            </div>
            <div v-if="!filter_pricing_list || !filter_pricing_list.length"
                class="h-[calc(100%_-_36px)] md:h-full flex justify-center pt-10">
                <div>
                    <img src="@/assets/icons/empty-page.svg" class="mx-auto w-[200px]">
                    <div class="text-center text-slate-500">
                        {{ $t('v1.view.main.dashboard.pricing.empty_pricing') }}
                    </div>
                </div>
            </div>
            <div :class="{ 'md:grid-cols-3 xl:grid-cols-4': commonStore.toggle_nav }"
                class="max-h-full overflow-hidden overflow-y-auto grid grid-cols-1 pb-5 md:max-h-full md:grid-cols-2 gap-2 md:gap-4 xl:grid-cols-3">
                <div v-for="pricing of filter_pricing_list"
                    class="bg-white rounded-md border-b-2 hover:border-orange-500 md:bg-slate-100 p-2 ">
                    <div class="flex justify-between">
                        <div class="flex">
                            <img src="@/assets/icons/pricing.svg" width="17" height="17">
                            <div class="ml-1">{{ pricing.invoice_id }}</div>
                        </div>
                        <div class="text-right">
                            <span v-if="pricing.pricing_status === 'ACTIVED'" class="text-green-600">
                                {{ $t('v1.view.main.dashboard.pricing.type_info.actived') }}
                            </span>
                            <span v-if="pricing.pricing_status === 'CREATED'" class="text-blue-500">
                                {{ $t('v1.view.main.dashboard.pricing.type_info.created') }}
                            </span>
                            <span v-if="pricing.pricing_status === 'EXPIRED'" class="text-indigo-500">
                                {{ $t('v1.view.main.dashboard.pricing.type_info.expired') }}
                            </span>
                            <span v-if="pricing.pricing_status === 'CANCELLED'" class="text-red-500">
                                {{ $t('v1.view.main.dashboard.pricing.type_info.cancelled') }}
                            </span>
                        </div>
                    </div>
                    <div class="mt-1 flex justify-between">
                        <div class="flex items-center">
                            <img src="@/assets/icons/page-white.svg" width="17" height="17">
                            <div class="ml-1 text-slate-400">
                                {{ pricing.list_pages.length }}
                                /
                                {{ pricing.package.selected_page !== 'UNLIMITED' ? pricing.package.selected_page : '∞' }}
                            </div>
                        </div>
                        <div class="flex items-center">
                            <img src="@/assets/icons/user-list.svg" width="17" height="17">
                            <div class="ml-1 text-slate-400">
                                {{ pricing.list_staffs.length }}
                                /
                                {{ pricing.package.selected_staff !== 'UNLIMITED' ? pricing.package.selected_page : '∞' }}
                            </div>
                        </div>
                        <div class="flex items-center">
                            <img src="@/assets/icons/money.svg" width="17" height="17">
                            <div class="ml-1 text-slate-400">
                                {{ currency(pricing.package.payment) }}
                            </div>
                        </div>
                        <div v-if="pricing.end_date" class="flex items-center">
                            <img src="@/assets/icons/expired.svg" width="17" height="17">
                            <div class="ml-1 text-slate-400">
                                {{ format(new Date(pricing.end_date), 'dd/MM/yy') }}
                            </div>
                        </div>
                    </div>
                    <div class="mt-1 flex justify-between">
                        <div class="text-sm text-orange-500 font-medium cursor-pointer">
                            {{ $t('v1.view.main.dashboard.pricing.pricing_detail') }}
                        </div>
                        <div>
                            <button v-if="['ACTIVED', 'EXPIRED'].includes(pricing.pricing_status)"
                                class="text-xs px-2 py-1 rounded ml-2 bg-orange-500 hover:bg-orange-600 text-white">
                                {{ $t('v1.common.setting') }}
                            </button>
                            <button v-if="pricing.pricing_status === 'CREATED'"
                                class="text-xs px-2 py-1 rounded ml-2 bg-gray-500 hover:bg-gray-600 text-white">
                                {{ $t('v1.common.cancel') }}
                            </button>
                            <button v-if="pricing.pricing_status === 'ACTIVED'"
                                class="text-xs px-2 py-1 rounded ml-2 bg-blue-500 hover:bg-blue-600 text-white">
                                {{ $t('v1.view.main.dashboard.pricing.action.upgrade') }}
                            </button>
                            <button v-if="pricing.pricing_status === 'EXPIRED'"
                                class="text-xs px-2 py-1 rounded ml-2 bg-indigo-500 hover:bg-indigo-600 text-white">
                                {{ $t('v1.view.main.dashboard.pricing.action.disconnect') }}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <FooterButton :text="$t('v1.view.main.dashboard.pricing.create_pricing')" @click_btn="createPricing" />
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useCommonStore } from '@/stores'
import { flow } from '@/service/helper/async'
import { read_me_pricing } from '@/service/api/chatbox/n4-service'
import { keyBy, mapValues } from 'lodash'
import { currency } from '@/service/helper/format'
import { format } from 'date-fns'
import { toast } from '@/service/helper/alert'

import Loading from '@/components/Loading.vue'
import PlatformTab from '@/components/Main/Dashboard/PlatformTab.vue'
import FooterButton from '@/components/Main/Dashboard/FooterButton.vue'

import type { CbError } from '@/service/interface/function'
import type { PricingInfo } from '@/service/interface/app/pricing'
import type { TabPlatform } from '@/service/interface/app/page'

const { t: $t } = useI18n()
const commonStore = useCommonStore()

/**danh sách các tab */
const list_tab_select = ref<TabPlatform>({
    ALL_STATUS: {
        title: $t(`v1.common.all`),
        count: 0
    },
    ...mapValues(keyBy([
        'ACTIVED',
        'CREATED',
        'EXPIRED',
        'CANCELLED'
    ]), n => {
        return {
            title: $t(`v1.view.main.dashboard.pricing.type.${n.toLowerCase()}`),
            count: 0
        }
    })
})

/**nền tảng hiện tại đang được chọn */
const current_selected_tab = ref('ALL_STATUS')
/**danh sách pricing sau khi được lọc */
const filter_pricing_list = ref<PricingInfo[]>()
/**gắn cờ loading cho danh sách pricing */
const is_loading_pricing_list = ref(false)
/**danh sách toan bộ các pricing của user */
const pricing_list = ref<PricingInfo[]>([])

// lọc danh sách pricing khi chọn tab
watch(() => current_selected_tab.value, () => filterListPricing())
// nạp lại danh sách pricing thì có thay đổi
watch(() => pricing_list.value, () => filterListPricing())

onMounted(() => getAllPricing())

/**lọc danh sách page để hiển thị theo các điều kiện được lựa chọn */
function filterListPricing() {
    // kích hoạt loading
    is_loading_pricing_list.value = true

    // lọc theo tab
    filter_pricing_list.value = pricing_list.value.filter(pricing => {
        if (
            current_selected_tab.value === 'ALL_STATUS' ||
            current_selected_tab.value === pricing.pricing_status
        ) return true

        return false
    })

    // tắt loading
    is_loading_pricing_list.value = false
}
/**lấy toàn bộ các page của user này */
function getAllPricing() {
    flow([
        // * kích hoạt loading
        (cb: CbError) => {
            is_loading_pricing_list.value = true

            cb()
        },
        // * call api đọc danh sách gói
        (cb: CbError) => read_me_pricing({}, (e, r) => {
            if (e) return cb(e)

            pricing_list.value = r
            cb()
        }),
        // * tính count cho từng trạng thái
        (cb: CbError) => {
            cb()

            pricing_list.value.map(pricing => {
                const PRICING_STATUS = pricing.pricing_status

                if (!PRICING_STATUS) return

                // count all
                list_tab_select.value.ALL_STATUS.count++
                // count cho từng page type
                list_tab_select.value[PRICING_STATUS].count++
            })
        }
    ], e => {
        // tắt loading
        is_loading_pricing_list.value = false
    })
}
/**kích hoạt các page được chọn */
function createPricing() {
    const DATA: {
    } = {
    }
    flow([
        // * active các page được chọn
        (cb: CbError) => {
            cb()
        },
        // * load lại danh sách page + thông báo thành công
        (cb: CbError) => {
            getAllPricing()

            // toast('success', $t('v1.view.main.dashboard.select_platform.success'))

            cb()
        },
    ], undefined, true)
}
</script>