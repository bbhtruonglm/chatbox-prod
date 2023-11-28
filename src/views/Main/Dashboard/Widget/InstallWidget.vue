<template>
    <Modal ref="install_widget_ref">
        <template v-slot:header>
            <div class="flex items-center">
                <img :src="widget?.icon" class="w-[20px] h-[20px]" />
                <div class="ml-1">
                    {{ widget?.name }}
                </div>
            </div>
        </template>
        <template v-slot:body>
            <div class="max-h-[calc(100vh_-_217px)] scrollbar-vertical overflow-hidden overflow-y-auto">
                <div class="text-sm text-slate-500 whitespace-break-spaces">
                    {{ widget?.description }}
                </div>
                <div class="font-semibold mt-3 text-sm">
                    {{ $t('v1.view.main.dashboard.nav.info') }}
                </div>
                <div v-html="widget?.document" class="border-2 p-1 rounded-lg" />
                <!-- <div class="font-semibold mt-3 text-sm">
                    {{ $t('v1.common.config') }}
                </div> -->
                <!-- <div class="mt-3 text-sm">
                    {{ $t('v1.view.main.dashboard.nav.select_page') }}
                </div>
                <div class="rounded-full h-[50px] border">
                    123
                </div> -->

            </div>
        </template>
        <template v-slot:footer>
            <div class="grid grid-cols-2 gap-2">
                <FilterButton @click="toggleModal" type="text-slate-500 hover:text-white hover:bg-slate-500" :title="$t('v1.common.cancel')" />
                <FilterButton type="border-orange-500 text-orange-500 hover:text-white hover:bg-orange-500"
                    :title="$t('v1.common.setting')" />
            </div>
        </template>
    </Modal>
</template>
<script setup lang="ts">
import { ref } from 'vue'

import Modal from '@/components/Modal.vue'
import FilterButton from '@/views/Main/Dashboard/Chat/LeftBar/FilterModal/FilterButton.vue'

import type { ComponentRef } from '@/service/interface/vue'
import type { AppInfo } from '@/service/interface/app/widget'

const $emit = defineEmits(['update_this_pricing'])

const $props = withDefaults(defineProps<{
    /**giá trị widget đang chọn */
    widget?: AppInfo
}>(), {})

/**ref của modal */
const install_widget_ref = ref<ComponentRef>()

/**mở modal của pricing detail */
function toggleModal() {
    install_widget_ref.value.toggleModal()
}

defineExpose({ toggleModal })
</script>