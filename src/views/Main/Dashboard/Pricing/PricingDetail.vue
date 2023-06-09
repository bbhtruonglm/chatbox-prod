<template>
    <div @click="openPricingDetailModal(pricing._id)" class="text-xs text-orange-500 font-medium cursor-pointer">
        {{ $t('v1.view.main.dashboard.pricing.pricing_detail') }}
    </div>
    <Modal :ref="el => assignPricingDetailRefModal(el, pricing._id)">
        <template v-slot:header>
            <div class="flex items-center">
                {{ $t('v1.view.main.dashboard.pricing.detail.title') }}
                <span @click="($parent as any)?.getAllPricing()" class="ml-2 cursor-pointer">
                    <img src="@/assets/icons/reload.svg" width="17" height="17">
                </span>
            </div>
        </template>
        <template v-slot:body>
            <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 text-sm">
                <div class="grid grid-cols-3 mb-1">
                    <div class="text-slate-500">
                        {{ $t('v1.view.main.dashboard.pricing.detail.invoice_id') }}
                    </div>
                    <div class="col-span-2 font-medium">
                        {{ pricing.invoice_id }}
                    </div>
                </div>
                <div class="grid grid-cols-3 mb-1">
                    <div class="text-slate-500">{{
                        $t('v1.view.main.dashboard.pricing.detail.created_at') }}</div>
                    <div class="col-span-2">
                        {{ format_date(new Date(pricing.createdAt), 'hh:mm:ss dd/MM/yyyy') }}
                    </div>
                </div>
                <div class="grid grid-cols-3 mb-1">
                    <div class="text-slate-500">{{ $t('v1.view.main.dashboard.pricing.detail.payment')
                    }}</div>
                    <div class="col-span-2 font-bold text-red-500">
                        {{ currency(pricing.package.payment) }}
                        {{ pricing.package.currency }}
                    </div>
                </div>
            </div>
            <hr class="mb-1" />
            <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 text-sm">
                <div class="grid grid-cols-3 mb-1">
                    <div class="text-slate-500">{{
                        $t('v1.view.main.dashboard.pricing.detail.payment_method') }}</div>
                    <div class="col-span-2">
                        {{
                            $t(`v1.view.main.dashboard.pricing.detail.payment_method_detail.${pricing.payment_method.toLowerCase()}`)
                        }}
                    </div>
                </div>
                <div class="grid grid-cols-3 mb-1">
                    <div class="text-slate-500">{{
                        $t('v1.view.main.dashboard.pricing.detail.selected_month') }}</div>
                    <div class="col-span-2 font-bold text-blue-500">
                        {{ pricing.package.selected_month }}
                    </div>
                </div>
                <div class="grid grid-cols-3 mb-1">
                    <div class="text-slate-500">{{
                        $t('v1.view.main.dashboard.pricing.detail.selected_page') }}</div>
                    <div class="col-span-2 font-bold text-blue-500">
                        {{ pricing.package.selected_page === 'UNLIMITED' ?
                            $t('v1.view.main.dashboard.pricing.detail.unlimited') :
                            pricing.package.selected_page }}
                    </div>
                </div>
                <div class="grid grid-cols-3 mb-1">
                    <div class="text-slate-500">{{
                        $t('v1.view.main.dashboard.pricing.detail.selected_staff') }}</div>
                    <div class="col-span-2 font-bold text-blue-500">
                        {{ pricing.package.selected_staff === 'UNLIMITED' ?
                            $t('v1.view.main.dashboard.pricing.detail.unlimited') :
                            pricing.package.selected_staff }}
                    </div>
                </div>
                <div v-if="pricing.package.cost_staff" class="grid grid-cols-3 mb-1">
                    <div class="text-slate-500">{{
                        $t('v1.view.main.dashboard.pricing.detail.cost_staff') }}</div>
                    <div class="col-span-2">
                        {{ currency(pricing.package.cost_staff) }}
                        {{ pricing.package.currency }}
                    </div>
                </div>
                <div v-if="pricing.package.discount" class="grid grid-cols-3 mb-1">
                    <div class="text-slate-500">{{ $t('v1.view.main.dashboard.pricing.detail.discount')
                    }}</div>
                    <div class="col-span-2 font-bold text-green-500">
                        {{ currency(pricing.package.discount) }}
                        {{ pricing.package.currency }}
                    </div>
                </div>
                <div class="grid grid-cols-3 mb-1">
                    <div class="text-slate-500">{{ $t('v1.view.main.dashboard.pricing.detail.price')
                    }}</div>
                    <div class="col-span-2">
                        {{ currency(pricing.package.price) }}
                        {{ pricing.package.currency }}
                    </div>
                </div>
                <div class="grid grid-cols-3 mb-1">
                    <div class="text-slate-500">{{ $t('v1.common.status')
                    }}</div>
                    <div class="col-span-2 font-bold">
                        <span v-if="pricing.pricing_status === 'ACTIVED'" class="text-green-600">
                            {{ $t('v1.view.main.dashboard.pricing.type_info.actived') }}
                        </span>
                        <span v-if="pricing.pricing_status === 'CREATED'" class="text-blue-600">
                            {{ $t('v1.view.main.dashboard.pricing.type_info.created') }}
                        </span>
                        <span v-if="pricing.pricing_status === 'EXPIRED'" class="text-violet-500">
                            {{ $t('v1.view.main.dashboard.pricing.type_info.expired') }}
                        </span>
                        <span v-if="pricing.pricing_status === 'CANCELLED'" class="text-red-500">
                            {{ $t('v1.view.main.dashboard.pricing.type_info.cancelled') }}
                        </span>
                    </div>
                </div>
            </div>
        </template>
    </Modal>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import { format as format_date } from 'date-fns'
import { currency } from '@/service/helper/format'

import Modal from '@/components/Modal.vue'

import type { ComponentPublicInstance } from 'vue'
import type { PricingInfo } from '@/service/interface/app/pricing'

withDefaults(defineProps<{
    /**v-model được truyền vào */
    pricing: PricingInfo
}>(), {

})

/**danh sách ref của các modal */
const pricing_detail_list_ref = ref<{
    [index: string]: ComponentPublicInstance<any>
}>({})

/**mở modal của pricing detail */
function openPricingDetailModal(pricing_id: string) {
    pricing_detail_list_ref.value?.[pricing_id]?.toggleModal()
}
/**lưu ref của modal vào biến */
function assignPricingDetailRefModal(
    element: ComponentPublicInstance<any>,
    pricing_id: string
) {
    pricing_detail_list_ref.value[pricing_id] = element
}
</script>