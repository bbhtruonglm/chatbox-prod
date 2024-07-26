<template>
  <div class="bg-[#FFF8E1] bg-[#D8F6CB] !bg-white border border-red-500 rounded-lg p-2 gap-2.5 flex flex-col max-w-80">
    <div class="flex justify-between gap-2">
      <div class="gap-2.5 flex flex-col">
        <img
          src="https://scontent.fmaa10-1.fna.fbcdn.net/v/t1.15752-9/449457830_1822209494934843_1793037365231243235_n.png?_nc_cat=102&ccb=1-7&_nc_sid=fc17b8&_nc_ohc=RUWuFz4eIjAQ7kNvgFbTOZW&_nc_ht=scontent.fmaa10-1.fna&edm=AKVc4UAEAAAA&oh=03_Q7cD1QG3aiQjKhZ_-Ab9a0_9mp1c0mTuHhvWbHjzcteXctt-Tg&oe=66CA850E"
          class="attachment-size"
        />

        <img
          src="https://scontent.fmaa10-1.fna.fbcdn.net/v/t1.15752-9/451794217_458670163713086_3773441309376921976_n.png?_nc_cat=111&ccb=1-7&_nc_sid=fc17b8&_nc_ohc=6oY9dnXM15AQ7kNvgEZcnfm&_nc_ht=scontent.fmaa10-1.fna&edm=AKVc4UAEAAAA&oh=03_Q7cD1QFjWszdNa-jHDFMMjwPCX0JYE5tqX9-B5sPq7DOx4e6Bw&oe=66C98615"
          class="attachment-size"
        />

        <video
          class="attachment-size"
          controls
          preload="metadata"
        >
          <source
            src="https://scontent.fmaa10-1.fna.fbcdn.net/v/t42.3356-2/408981581_25271697805754864_7901027721007800365_n.mp4?_nc_cat=110&amp;ccb=1-7&amp;_nc_sid=4f86bc&amp;_nc_ohc=eT0QccSKggIQ7kNvgET1sme&amp;_nc_ht=scontent.fmaa10-1.fna&amp;edm=AKVc4UAEAAAA&amp;oh=03_Q7cD1QEooxP4WFOpMsMh1oAto89mGB2bwHjj88YzAoASzYVupA&amp;oe=66A4F507&amp;dl=1"
            type="video/mp4"
          />
        </video>

        <audio
          class="w-full"
          controls
          preload="metadata"
        >
          <source
            src="https://cdn.fbsbx.com/v/t59.3654-21/357459481_3655858284649883_5075327584949069079_n.mp4/audioclip-1721966486000-42057.mp4?_nc_cat=103&amp;ccb=1-7&amp;_nc_sid=d61c36&amp;_nc_ohc=mSJHXuyjo8EQ7kNvgEcaTyX&amp;_nc_ht=cdn.fbsbx.com&amp;edm=AKVc4UAEAAAA&amp;oh=03_Q7cD1QEHoFPoyHxjkCeiwJqscs7Tz8ckoSYF5vUXVIjcZMtWgg&amp;oe=66A50E3E&amp;dl=1"
            type="audio/mpeg"
          />
        </audio>
      </div>
      <button
        class="flex-shrink-0 bg-slate-200 rounded-lg w-7 h-7 flex items-center justify-center"
      >
        <template v-if="true">
          <ArrowRightIcon class="w-3 h-3 flex-shrink-0" />
          <span class="font-medium text-sm">A</span>
        </template>
        <ArrowDownIcon
          v-else
          class="w-4 h-4"
        />
      </button>
    </div>

    <div class="text-sm font-semibold enter-line">Tiêu đề</div>

    <div class="text-sm enter-line">
      Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quae blanditiis
      sapiente voluptas perferendis voluptates esse consequatur velit debitis
      aliquam non! Asperiores enim facilis deserunt dolor accusantium nemo
      assumenda illum dolorem!
    </div>

    <div class="flex flex-col gap-1">
      <button
        class="py-2 flex justify-center items-center gap-1 rounded-lg bg-slate-800 text-yellow-200"
      >
        Lập lịch
        <NewTabIcon class="w-4 h-4" />
      </button>
      <button
        class="py-2 flex justify-center items-center gap-1 rounded-lg bg-slate-600 text-slate-100"
      >
        Nút số 1
      </button>
      <button
        class="py-2 flex justify-center items-center gap-1 rounded-lg bg-slate-600 text-slate-100"
      >
        Nút số 2
      </button>
    </div>
  </div>
</template>
<script setup lang="ts">
import NewTabIcon from '@/components/Icons/NewTab.vue'
import ArrowDownIcon from '@/components/Icons/ArrowDown.vue'
import ArrowRightIcon from '@/components/Icons/ArrowRight.vue'
</script>
<style lang="scss" scoped>
.attachment-size {
  @apply max-h-40 w-fit;
}
.enter-line {
  @apply break-words whitespace-pre-line;
}
</style>
