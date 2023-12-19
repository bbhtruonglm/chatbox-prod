<template>
    <div class="pt-4 w-full flex justify-center text-xs items-center">
        <p class="text-slate-400 whitespace-nowrap mr-1">
            Khách hàng đã trả lời từ quảng cáo
        </p>
        <p class=" text-blue-500 mr-2" >{{ $props.ad_id }}</p>
        <!-- <Loading v-if="loading" :size="16" />
        <img v-tooltip="$t('v1.view.main.dashboard.chat.action.reload_ad')" @click="reloadAd()" class="cursor-pointer" v-if="!loading" :src="RefreshIcon"> -->
    </div>
    <FacebookPost v-if="!hide_fb_post" :ad_id="$props.ad_id" :hide-post="hideFbPost"/>
</template>

<script setup lang="ts">
import { ref } from 'vue';

// import Loading from '@/components/Loading.vue';
import FacebookPost from './FacebookPost.vue';
// import RefreshIcon from '@/assets/icons/refresh-icon.svg'

const $props = withDefaults(defineProps<{
    ad_id: string
}>(), {})

/** Trạng thái loading */
const loading = ref<boolean>(false)
/** Trạng thái hiện bài post */
const hide_fb_post = ref<boolean>(false)

/** Tải lại dữ liệu ad */
// function reloadAd() {
//     loading.value = true
//     setTimeout(function() { loading.value = false }, 3000)

//     // TODO Cần gọi api để tải lại dữ liệu ad
// }

/** Ẩn hiện bài post */
function hideFbPost(status: boolean) {
    hide_fb_post.value = status
}

</script>