<template>
    <div class="w-full h-full bg-slate-100 md:bg-white">
        <div class="bg-white pt-[65px] md:pt-8 xl:pt-4">
            <div class="pl-14 pr-4 md:pl-4 h-[35px] flex items-center justify-end">
                <span class="text-slate-400">{{ $t('v1.view.main.dashboard.pricing.help.you_need_help') }}</span>
                <a href="https://m.me/1706801539392655" target="_blank"
                    class="hover:underline cursor-pointer text-orange-600 ml-1">{{
                        $t('v1.view.main.dashboard.pricing.help.connect_us') }}</a>
            </div>
            <PlatformTab v-model="current_selected_tab" :platform_list="ROOT_TAB" />
        </div>
        <div class="px-2 pt-2 relative h-[calc(100%_-_138px)] md:h-[calc(100%_-_114px)]">
            <div v-if="is_loading" class="absolute left-[50%] translate-x-[-50%] z-[1]">
                <Loading class="mx-auto" />
            </div>
            <AllWidget v-if="current_selected_tab === 'ALL'" @is_loading="$event => is_loading = $event" />
            <InstalledWidget v-else-if="current_selected_tab === 'INSTALLED'" @is_loading="$event => is_loading = $event" />
            <MyWidget v-else @is_loading="$event => is_loading = $event" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

import Loading from '@/components/Loading.vue'
import PlatformTab from '@/components/Main/Dashboard/PlatformTab.vue'
import AllWidget from '@/views/Main/Dashboard/Widget/AllWidget.vue'
import InstalledWidget from '@/views/Main/Dashboard/Widget/InstalledWidget.vue'
import MyWidget from '@/views/Main/Dashboard/Widget/MyWidget.vue'

const { t: $t } = useI18n()

/**các tab chính */
const ROOT_TAB = {
    ALL: {
        title: $t('v1.view.main.dashboard.widget.tab.market'),
        count: 0
    },
    INSTALLED: {
        title: $t('v1.view.main.dashboard.widget.tab.installed'),
        count: 0
    },
    CREATED: {
        title: $t('v1.view.main.dashboard.widget.tab.my_app'),
        count: 0
    },
}
/**gắn cờ loading cho danh sách pricing */
const is_loading = ref(false)
/**tab đang được chọn */
const current_selected_tab = ref<'ALL' | 'INSTALLED' | 'CREATED'>('ALL')
</script>