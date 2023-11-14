<template>
    <Modal ref="album_ref">
        <template v-slot:header>
            {{ $t('v1.view.main.dashboard.chat.album.title') }}
        </template>
        <template v-slot:body>
            <div class="text-sm">
                <div class="flex border-b mb-2">
                    <div @click="selected_category = 'NEW'"
                        :class="selected_category === 'NEW' ? 'font-medium border-b-2 border-orange-500' : 'font-light'"
                        class="mr-2 cursor-pointer">
                        {{ $t('v1.view.main.dashboard.chat.album.category.new') }}
                    </div>
                    <div @click="selected_category = 'FOLDER'"
                        :class="selected_category === 'FOLDER' ? 'font-medium border-b-2 border-orange-500' : 'font-light'"
                        class="cursor-pointer">
                        {{ $t('v1.view.main.dashboard.chat.album.category.folder') }}
                    </div>
                </div>
                <div class="grid grid-cols-2">
                    <div>
                        <button class="rounded-full bg-orange-500 text-white font-medium px-2 flex items-center py-1">
                            <img src="@/assets/icons/upload.svg" />
                            {{ $t('v1.common.upload') }}
                        </button>
                    </div>
                    <div class="font-medium flex justify-end">
                        <!-- <div class="flex items-center justify-end cursor-pointer">
                            {{ $t('v1.common.select_all') }}
                            <input type="checkbox" class="w-[15px] h-[15px] ml-1 accent-orange-600">
                        </div> -->
                        <div class="cursor-pointer">
                            <img src="@/assets/icons/new-folder.svg" />
                        </div>
                    </div>
                </div>
                <div class="h-[calc(100vh_-_300px)] overflow-hidden overflow-y-auto flex justify-center flex-wrap mt-2 content-start">
                    <div v-for="i of 5"
                        class="relative w-[110px] h-[100px] m-1 cursor-pointer group border-2 border-white hover:border-orange-500">
                        <div @click="item_setting_ref?.toggleModal()" class="absolute top-1 right-1 hidden group-hover:block">
                            <img src="@/assets/icons/more.svg" />
                        </div>
                        <div class="w-full h-[80px]">
                            <img src="@/assets/icons/folder.svg" class="w-full h-full" />
                            <!-- <img v-if="i%2" src="@/assets/icons/picture.svg" class="w-full h-full" />
                            <img v-else-if="i%3" src="@/assets/icons/play.svg" class="w-full h-full" />
                            <img v-else-if="i%4" src="@/assets/icons/audio.svg" class="w-full h-full" />
                            <img v-else src="@/assets/icons/file.svg" class="w-full h-full" /> -->
                        </div>
                        <div class="truncate text-center">
                            tên ảnh tên ảnh tên ảnh
                        </div>
                    </div>
                </div>
            </div>
        </template>
        <template v-slot:footer>
            <div class="grid grid-cols-2 gap-2 border-t pt-2">
                <FilterButton type="text-slate-500 hover:text-white hover:bg-slate-500" :title="$t('v1.common.cancel')" />
                <FilterButton type="border-orange-500 text-orange-500 hover:text-white hover:bg-orange-500"
                    :title="$t('v1.view.main.dashboard.chat.album.select')" />
            </div>
        </template>
    </Modal>
    <Modal ref="item_setting_ref">
        <template v-slot:header>
            {{ $t('v1.common.setting') }}
        </template>
        <template v-slot:body>
            <div>
                <input type="text" class="border-2 rounded-md w-full h-[40px] px-2 focus:outline-none" :placeholder="$t('v1.view.main.dashboard.chat.album.name')">
            </div>
        </template>
        <template v-slot:footer>
            <div class="grid grid-cols-2 gap-2">
                <FilterButton type="text-slate-500 hover:text-white hover:bg-slate-500" :title="$t('v1.common.delete')" />
                <FilterButton type="border-orange-500 text-orange-500 hover:text-white hover:bg-orange-500"
                    :title="$t('v1.common.update')" />
            </div>
        </template>
    </Modal>
</template>
<script setup lang="ts">
import { ref } from 'vue'

import Modal from '@/components/Modal.vue'
import FilterButton from '@/views/Main/Dashboard/Chat/LeftBar/FilterModal/FilterButton.vue'

import type { ComponentRef } from '@/service/interface/vue'

/**ref của quản lý album */
const album_ref = ref<ComponentRef>()
/**ref của cài đặt item */
const item_setting_ref = ref<ComponentRef>()
/**chọn danh mục nào */
const selected_category = ref<'NEW' | 'FOLDER'>('NEW')

/**mở album */
function toggleAlbum() {
    album_ref.value?.toggleModal()
}

defineExpose({ toggleAlbum })
</script>