<template>
    <div
        class="bg-white rounded-md border-b-2 hover:border-orange-500 md:bg-slate-100 p-3 flex items-center cursor-pointer relative">
        <div v-if="is_control && !disable_delete" @click="$emit('delete')" class="text-red-500 absolute top-0 right-[5px]">
            ✕
        </div>
        <div>
            <object :data="widget.icon" type="image/png" class="w-[50px] h-[50px]">
                <img src="@/assets/imgs/chatbox.svg" class="w-[50px] h-[50px]" />
            </object>
        </div>
        <div class="w-[calc(100%_-_60px)] ml-[10px]">
            <div class="font-semibold truncate mb-2">
                {{ widget.name }}
            </div>
            <div class="flex items-center">
                <div class="text-slate-500 text-sm truncate w-[-webkit-fill-available]">
                    {{ widget.description }}
                </div>
                <div v-if="is_control" class="flex">
                    <template v-if="!is_owner_control">
                        <div @click="$emit('toggle')" class="w-[20px] h-[20px] ml-2">
                            <img v-if="app?.active_widget" src="@/assets/icons/hide.svg" class="w-full h-full" />
                            <img v-else src="@/assets/icons/show.svg" class="w-full h-full" />
                        </div>
                        <div @click="$emit('link')" class="w-[20px] h-[20px] ml-2">
                            <img src="@/assets/icons/link.svg" class="w-full h-full" />
                        </div>
                    </template>
                    <template v-else>
                        <div @click="$emit('tranfer')" class="w-[20px] h-[20px] ml-2">
                            <img src="@/assets/icons/tranfer.svg" class="w-full h-full" />
                        </div>
                        <div @click="$emit('key')" class="w-[20px] h-[20px] ml-2">
                            <img src="@/assets/icons/key.svg" class="w-full h-full" />
                        </div>
                        <div @click="$emit('install')" class="w-[20px] h-[20px] ml-2">
                            <img src="@/assets/icons/install.svg" class="w-full h-full" />
                        </div>
                    </template>
                    <div @click="$emit('setting')" class="w-[20px] h-[20px] ml-2">
                        <img src="@/assets/icons/setting.svg" class="w-full h-full" />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
import type { AppInfo, AppInstalledInfo } from '@/service/interface/app/widget'

const $emit = defineEmits(['delete', 'setting', 'toggle', 'link', 'tranfer', 'install', 'key'])

const $props = withDefaults(defineProps<{
    /**giá trị widget đang chọn */
    widget: AppInfo
    /**dữ liệu widget được cài đặt */
    app?: AppInstalledInfo
    /**hiển thị các button điều khiển */
    is_control?: boolean
    /**hiển thị các button điều khiển của người tạo */
    is_owner_control?: boolean 
    /**ẩn nút xoá */
    disable_delete?: boolean
}>(), {})


</script>