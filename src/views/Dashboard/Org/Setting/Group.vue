<template>
  <CardItem>
    <template #icon>
      <UserGroupIcon class="w-5 h-5" />
    </template>
    <template #title>
      {{ $t('Nhóm') }}
      <div class="text-xs text-slate-500">
        {{
          $t(
            'Mặc định sau khi Đăng nhập, Thành viên sẽ xem được toàn bộ Trang của Tổ chức.'
          )
        }}
      </div>
      <div class="text-xs text-slate-500">
        {{
          $t(
            'Chức năng Nhóm sẽ chỉ định Thành viên chỉ xem được Trang trong Nhóm sau khi đăng nhập. Lưu ý: Quản trị viên vẫn xem được toàn bộ Trang.'
          )
        }}
      </div>
    </template>
    <template #action>
      <button
        @click="$main.openModalUpsertGroup()"
        class="py-1 px-4 rounded-md text-sm font-medium bg-blue-600 text-white h-fit"
      >
        {{ $t('Thêm') }}
      </button>
    </template>
    <template #item> </template>
  </CardItem>
  <GroupUpsertModal ref="ref_group_upsert_modal" />
</template>
<script setup lang="ts">
import CardItem from '@/components/Main/Dashboard/CardItem.vue'
import GroupUpsertModal from '@/views/Dashboard/Org/Setting/Group/GroupUpsertModal.vue'

import { UserGroupIcon } from '@heroicons/vue/24/solid'
import { ref } from 'vue'

/**modal thêm/sửa Nhóm */
const ref_group_upsert_modal = ref<InstanceType<typeof GroupUpsertModal>>()

class Main {
  openModalUpsertGroup() {
    ref_group_upsert_modal.value?.toggleModal?.()
  }
}
const $main = new Main()
</script>
