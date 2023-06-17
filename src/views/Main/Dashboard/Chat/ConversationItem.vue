<template>
    <div class="border-b py-2 px-4 flex">
        <div class="w-fit h-fit relative">
            <img src="@/assets/icons/user-list.svg" width="45" height="45" class="bg-slate-200 rounded-full">
            <div class="w-fit h-fit absolute bottom-[-4px] right-[-4px]">
                <img src="@/assets/icons/user-list.svg" width="22" height="22"
                    class="bg-slate-200 rounded-full border-2 border-white">
            </div>
        </div>
        <div class="w-[calc(100vw_-_126px)] pl-2">
            <div class="flex">
                <img src="@/assets/icons/user-list.svg" width="24" height="24" class="bg-slate-200 rounded-full">
                <img src="@/assets/icons/arrow-right.svg" width="8" height="8" class="mx-2">
                <div class="w-[calc(100%_-_33px)] truncate">
                    Trang vũ Trang vũ Trang vũ Trang vũ
                    Trang vũ Trang vũ Trang vũ Trang vũ
                    Trang vũ Trang vũ Trang vũ Trang vũ
                    Trang vũ Trang vũ Trang vũ Trang vũ
                    Trang vũ Trang vũ Trang vũ Trang vũ
                </div>
            </div>
            <div class="text-slate-400 text-sm truncate">
                Bạn: alo 123 alo 123 alo 123 alo 123
                alo 123 alo 123 alo 123 alo 123 alo 123 alo
                alo 123 alo 123 alo 123 alo 123 alo 123 alo
                alo 123 alo 123 alo 123 alo 123 alo 123 alo
                alo 123 alo 123 alo 123 alo 123 alo 123 alo
            </div>
            <div class="flex">
                <div class="mr-1">
                    <img src="@/assets/icons/reply.svg">
                </div>
                <div v-for="i of 3" class="text-white bg-green-500 rounded-full text-xs px-2 mr-1">
                    alo
                </div>
                <div class="text-xs rounded border-2 text-slate-500">
                    +10
                </div>
            </div>
        </div>
        <div class="w-[49px] flex flex-col items-end">
            <div>
                <span class="text-xs text-white bg-red-500 px-1 rounded-full">2+</span>
            </div>
            <div class="text-slate-400 text-sm">11.11</div>
            <div>
                <div>
                    <img src="@/assets/icons/phone.svg" width="13" height="13">
                </div>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
withDefaults(defineProps<{
    source: {}
}>(), {})
</script>