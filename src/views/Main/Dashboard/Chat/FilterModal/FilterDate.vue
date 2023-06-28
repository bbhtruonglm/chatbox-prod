<template>
    <ModalBottom ref="filter_modal_ref">
        <template v-slot:header>
            {{ $t('v1.view.main.dashboard.chat.filter.time.title') }}
        </template>
        <template v-slot:body>
            <div class="h-[440px]">
                <div class="grid grid-cols-2 gap-2">
                    <div @click="selectExactlyTimeRange(name)" v-for="name of EXACTLY_TIME_RANGE"
                        class="border-b cursor-pointer hover:bg-orange-100 rounded-lg p-2">
                        {{ $t(`v1.view.main.dashboard.chat.filter.time.${name}`) }}
                    </div>
                </div>
                <div class="grid grid-cols-2 gap-2 mt-4">
                    <div>
                        <div class="text-slate-500">
                            {{ $t(`v1.view.main.dashboard.chat.filter.time.from`) }}
                        </div>
                        <div @click="selectExactlyTimeRange('custom')" class="relative cursor-pointer">
                            <div class="p-1 pl-2 rounded-lg border h-[32px]">
                                {{ formatDateDiplay(conversationStore.option_filter_page_data?.time_range?.gte) }}
                            </div>
                            <img src="@/assets/icons/filter_date.svg" class="absolute top-[3px] right-[3px]" />
                        </div>
                        <DatePicker v-if="conversationStore.option_filter_page_data?.time_range?.gte"
                            v-model="conversationStore.option_filter_page_data.time_range.gte"
                            class="text-xs border rounded-xl mt-1" />
                    </div>
                    <div>
                        <div class="text-slate-500">
                            {{ $t(`v1.view.main.dashboard.chat.filter.time.to`) }}
                        </div>
                        <div @click="selectExactlyTimeRange('custom')" class="relative cursor-pointer">
                            <div class="p-1 pl-2 rounded-lg border h-[32px]">
                                {{ formatDateDiplay(conversationStore.option_filter_page_data?.time_range?.lte) }}
                            </div>
                            <img src="@/assets/icons/filter_date.svg" class="absolute top-[3px] right-[3px]" />
                        </div>
                        <DatePicker v-if="conversationStore.option_filter_page_data?.time_range?.lte"
                            v-model="conversationStore.option_filter_page_data.time_range.lte"
                            class="text-xs border rounded-xl mt-1" />
                    </div>

                </div>
            </div>
        </template>
        <template v-slot:footer>
            <div class="grid grid-cols-2 gap-2">
                <FilterButton @click="clearThisFilter" type="text-slate-500 hover:text-white hover:bg-slate-500"
                    :title="$t('v1.view.main.dashboard.chat.filter.un_filter')" />
                <FilterButton @click="toggleModal"
                    type="border-orange-500 text-orange-500 hover:text-white hover:bg-orange-500"
                    :title="$t('v1.view.main.dashboard.chat.filter.title')" />
            </div>
        </template>
    </ModalBottom>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import { useConversationStore } from '@/stores'
import {
    format, startOfDay, endOfDay, startOfYesterday, endOfYesterday, subDays
} from 'date-fns'

import ModalBottom from '@/components/ModalBottom.vue'
import FilterButton from '@/views/Main/Dashboard/Chat/FilterModal/FilterButton.vue'
import DatePicker from '@/components/DatePicker.vue'

import type { ComponentRef } from '@/service/interface/vue'

const conversationStore = useConversationStore()

/**danh sách các khoảng thời gian được chọn sẵn */
const EXACTLY_TIME_RANGE = [
    'today',
    'yesterday',
    'day_ago_7',
    'day_ago_30',
    'day_ago_90',
    'custom',
]

/**ref của modal */
const filter_modal_ref = ref<ComponentRef>()

/**format lại hiển thị thời gian */
function formatDateDiplay(value?: number) {
    if (!value) return '--/--/-- --:--'

    return format(value, 'dd/MM/yy HH:mm')
}
/**click vào tuỳ chọn thời gian */
function selectExactlyTimeRange(name: string) {
    const CURRENT_DATE = new Date()

    // today, custom
    let time_range = {
        gte: startOfDay(CURRENT_DATE).getTime(),
        lte: endOfDay(CURRENT_DATE).getTime()
    }

    // ngày hôm qua
    if (name === 'yesterday') time_range = {
        gte: startOfYesterday().getTime(),
        lte: endOfYesterday().getTime()
    }

    // 7 ngày trước
    if (name === 'day_ago_7') time_range = {
        gte: startOfDay(subDays(CURRENT_DATE, 6)).getTime(),
        lte: endOfDay(CURRENT_DATE).getTime()
    }

    // 30 ngày trước
    if (name === 'day_ago_30') time_range = {
        gte: startOfDay(subDays(CURRENT_DATE, 29)).getTime(),
        lte: endOfDay(CURRENT_DATE).getTime()
    }

    // 90 ngày trước
    if (name === 'day_ago_90') time_range = {
        gte: startOfDay(subDays(CURRENT_DATE, 89)).getTime(),
        lte: endOfDay(CURRENT_DATE).getTime()
    }

    // ghi vào store
    conversationStore.option_filter_page_data.time_range = time_range
}
/**xoá lọc này */
function clearThisFilter() {
    delete conversationStore.option_filter_page_data.time_range

    toggleModal()
}
/**ẩn hiện modal */
function toggleModal() {
    filter_modal_ref.value?.toggleModal()
}

defineExpose({ toggleModal })
</script>