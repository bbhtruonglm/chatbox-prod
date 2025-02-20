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
    <template #item>
      <div
        class="rounded-md bg-gray-100 p-1 text-gray-500 text-sm font-medium w-fit"
      >
        <button
          v-for="i of 5"
          @click="$main.selectGroup(String(i))"
          :class="{ active: selected_group_id === String(i) }"
          class="group-item"
        >
          {{ $t('Nhóm') }} {{ i }}
        </button>
      </div>
      <GroupSection :title="$t('Trang')">
        <template v-for="os of 6">
          <PageItem
            :checkbox_is_visible="false"
            class="cursor-pointer"
          >
            <template #after-name>
              <div
                v-tooltip="$t('Xóa Trang khỏi Nhóm')"
                class="group/minus hidden group-hover:flex"
              >
                <MinusCircleIcon
                  class="w-4 h-4 text-slate-500 group-hover/minus:block"
                />
              </div>
            </template>
          </PageItem>
        </template>
      </GroupSection>
      <GroupSection :title="$t('Thành viên')">
        <template v-for="staff of 3">
          <ActorItem class="cursor-pointer">
            <template #avatar>
              <StaffAvatar class="w-8 h-8 rounded-oval" />
            </template>
            <template #name> xxxxx </template>
            <template #after-name>
              <div
                v-tooltip="$t('Xóa Trang khỏi Nhóm')"
                class="group/minus hidden group-hover:flex"
              >
                <MinusCircleIcon
                  class="w-4 h-4 text-slate-500 group-hover/minus:block"
                />
              </div>
            </template>
          </ActorItem>
        </template>
      </GroupSection>
      <div class="flex justify-between items-center text-sm font-medium">
        <button
          @click="$main.openModalUpsertGroup()"
          class="btn-footer bg-slate-200"
        >
          <PencilSquareIcon class="size-4" />
          {{ $t('Sửa Nhóm') }} 1
        </button>
        <button
          @click="$main.openModalDeleteGroup()"
          class="btn-footer text-red-500"
        >
          {{ $t('Xóa Nhóm') }}
        </button>
      </div>
    </template>
  </CardItem>
  <GroupUpsertModal ref="ref_group_upsert_modal" />
  <ConfirmDeleteGroupModal ref="ref_confirm_delete_group_modal" />
</template>
<script setup lang="ts">
import { ref } from 'vue'

import CardItem from '@/components/Main/Dashboard/CardItem.vue'
import GroupUpsertModal from '@/views/Dashboard/Org/Setting/Group/GroupUpsertModal.vue'
import ConfirmDeleteGroupModal from '@/views/Dashboard/Org/Setting/Group/ConfirmDeleteGroupModal.vue'
import PageItem from '@/components/Main/Dashboard/PageItem.vue'
import GroupSection from '@/views/Dashboard/Org/Setting/Group/GroupSection.vue'
import ActorItem from '@/components/Main/Dashboard/ActorItem.vue'
import StaffAvatar from '@/components/Avatar/StaffAvatar.vue'

import { UserGroupIcon, PencilSquareIcon } from '@heroicons/vue/24/solid'
import { MinusCircleIcon } from '@heroicons/vue/24/outline'

/**modal thêm/sửa Nhóm */
const ref_group_upsert_modal = ref<InstanceType<typeof GroupUpsertModal>>()
/**modal xác nhận xóa Nhóm */
const ref_confirm_delete_group_modal =
  ref<InstanceType<typeof ConfirmDeleteGroupModal>>()
/**id nhóm đang chọn */
const selected_group_id = ref<string>('1')

class Main {
  /**mở modal thêm/sửa Nhóm */
  openModalUpsertGroup() {
    ref_group_upsert_modal.value?.toggleModal?.()
  }
  /**chọn nhóm */
  selectGroup(group_id: string) {
    selected_group_id.value = group_id
  }
  /**mở modal xác nhận xóa Nhóm */
  openModalDeleteGroup() {
    ref_confirm_delete_group_modal.value?.toggleModal?.()
  }
}
const $main = new Main()
</script>
<style lang="scss" scoped>
.group-item {
  @apply rounded-md px-3 py-1;
}
.group-item.active {
  @apply bg-white shadow text-black;
}
.btn-footer {
  @apply flex gap-2 items-center py-2 px-4 rounded-md;
}
</style>
