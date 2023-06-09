<template>
    <FooterButton :text="$t('v1.view.main.dashboard.pricing.create_pricing')"
        @click_btn="create_pricing_ref.toggleModal()" />
    <Modal ref="create_pricing_ref">
        <template v-slot:header>
            {{ $t('v1.view.main.dashboard.pricing.create_pricing') }}
        </template>
        <template v-slot:body>
            <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-x-2">
                <div class="grid grid-cols-3 mb-2 gap-x-2">
                    <div class="text-slate-500 md:text-right">
                        {{ $t('v1.view.main.dashboard.pricing.create.page') }}
                    </div>
                    <Select class="col-span-2" v-model="create_pricing_data.selected_page"
                        :placeholder="$t('v1.view.main.dashboard.pricing.create.page_description')">
                        <option v-for="i of 30" :value="i">
                            {{ i }} {{ $t('v1.common.page') }}
                        </option>
                        <option value="UNLIMITED">
                            {{ $t('v1.view.main.dashboard.pricing.detail.unlimited') }}
                        </option>
                    </Select>
                </div>
                <div class="grid grid-cols-3 mb-2 gap-x-2">
                    <div class="text-slate-500 md:text-right">
                        {{ $t('v1.view.main.dashboard.pricing.create.month') }}
                    </div>
                    <Select class="col-span-2" v-model="create_pricing_data.selected_month"
                        :placeholder="$t('v1.view.main.dashboard.pricing.create.month_description')">
                        <option value="6">
                            6 {{ $t('v1.common.month') }}
                        </option>
                        <option value="12">
                            12 {{ $t('v1.common.month') }}
                        </option>
                        <option value="24">
                            24 {{ $t('v1.common.month') }}
                        </option>
                    </Select>
                </div>
                <div class="grid grid-cols-3 mb-2 gap-x-2">
                    <div class="text-slate-500 md:text-right">
                        {{ $t('v1.view.main.dashboard.pricing.create.staff') }}
                    </div>
                    <Select class="col-span-2" v-model="create_pricing_data.selected_staff"
                        :placeholder="$t('v1.view.main.dashboard.pricing.create.staff_description')">
                        <option v-for="i of 60" :value="i">
                            {{ i }} {{ $t('v1.common.staff') }}
                        </option>
                        <option value="UNLIMITED">
                            {{ $t('v1.view.main.dashboard.pricing.detail.unlimited') }}
                        </option>
                    </Select>
                </div>
            </div>
            <hr class="mb-2" />
            <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-x-2">
                <div class="grid grid-cols-3 mb-2 gap-x-2">
                    <div class="text-slate-500 md:text-right">
                        {{ $t('v1.view.main.dashboard.pricing.detail.price') }}
                    </div>
                    <div>{{ currency() }}</div>
                </div>
                <div class="grid grid-cols-3 mb-2 gap-x-2">
                    <div class="text-slate-500 md:text-right">
                        {{ $t('v1.view.main.dashboard.pricing.detail.cost_staff') }}
                    </div>
                    <div>{{ currency() }}</div>
                </div>
                <div class="grid grid-cols-3 mb-2 gap-x-2">
                    <div class="text-slate-500 md:text-right">
                        {{ $t('v1.view.main.dashboard.pricing.detail.discount') }}
                    </div>
                    <div>{{ currency() }}</div>
                </div>
                <div class="grid grid-cols-3 mb-2 gap-x-2">
                    <div class="text-slate-500 md:text-right">
                        {{ $t('v1.view.main.dashboard.pricing.detail.payment') }}
                    </div>
                    <div>{{ currency() }}</div>
                </div>
            </div>
            <hr class="mb-2" />
        </template>
        <template v-slot:footer>
            <div class="flex justify-center">
                <button class="bg-orange-500 text-white px-5 rounded-full py-1">
                    {{ $t('v1.view.main.dashboard.pricing.create_pricing') }}
                </button>
            </div>
        </template>
    </Modal>
</template>
<script setup lang="ts">
import { currency } from '@/service/helper/format'
import { ref, watch } from 'vue'
import { flow } from '@/service/helper/async'

import FooterButton from '@/components/Main/Dashboard/FooterButton.vue'
import Select from '@/components/Select.vue'
import Modal from '@/components/Modal.vue'

import type { ComponentPublicInstance } from 'vue'
import type { CbError } from '@/service/interface/function'

/**data để tạo mới gói */
const create_pricing_data = ref({
    selected_page: "",
    selected_month: "",
    selected_staff: "",
})
/**ref của modal tạo gói */
const create_pricing_ref = ref<ComponentPublicInstance<any>>()

/**theo dõi sự thay đổi của các tuỳ chọn, để từ đó tính toán số tiền */
watch(() => create_pricing_data, () => calcPriceOfPricing(), { deep: true })

/**tính toán trước số tiền phải trả của gói được chọn */
function calcPriceOfPricing() {

}
/**tạo mới gói */
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

            cb()
        },
    ], undefined, true)
}
</script>