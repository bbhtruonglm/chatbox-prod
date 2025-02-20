<template>
  <BaseModal
    ref="ref_group_upsert_modal"
    class_modal="w-[1296px] h-[716px]"
    class_header="text-lg font-semibold px-6 py-3"
    class_close="right-3"
    class_body="border-y border-slate-300 bg-slate-100 py-4 px-5 gap-4 flex flex-col relative"
    class_footer="px-6 py-3 flex justify-between"
  >
    <template v-slot:header>
      <template v-if="is_update">
        {{ $t('Chỉnh sửa') }}
      </template>
      <template v-else>
        {{ $t('Tạo nhóm trang') }}
      </template>
    </template>
    <template v-slot:body>
      <div
        v-if="is_loading"
        class="absolute left-1/2 -translate-y-1/2"
      >
        <Loading />
      </div>
      <div class="flex flex-col gap-1">
        <label class="text-sm font-medium">
          {{ $t('Tên nhóm') }}
          <span class="text-red-500">*</span>
        </label>
        <input
          v-model="group_name"
          :placeholder="$t('Nhập tên nhóm')"
          class="py-2 px-3 rounded-md border border-gray-200 shadow-sm tex-sm"
        />
      </div>
      <div class="grid grid-cols-2 gap-4 min-h-0">
        <GroupSection
          :title="$t('Trang')"
          :total_item_selected="total_page_selected"
        >
          <GroupItem
            v-for="i of 10"
            :name="`xxxxxx`"
          >
            <template #avatar>
              <PageAvatar class="item-avatar" />
            </template>
            <template #type>
              <PageTypeIcon class="size-3.5" />
            </template>
            <template #info> xxxxxxx </template>
          </GroupItem>
        </GroupSection>
        <GroupSection
          :title="$t('Thành viên')"
          :total_item_selected="total_staff_selected"
        >
          <GroupItem
            v-for="i of 3"
            :name="`xxxxxx`"
          >
            <template #avatar>
              <PageAvatar class="item-avatar" />
            </template>
            <template #info> xxxxxxx - yyyyyyy </template>
          </GroupItem>
        </GroupSection>
      </div>
    </template>
    <template v-slot:footer>
      <button
        @click="$main.toggleModal"
        class="custom-btn bg-slate-200"
      >
        {{ $t('Đóng') }}
      </button>
      <button
        @click="$main.upsertGroup()"
        class="custom-btn bg-blue-700 text-white"
      >
        <template v-if="is_update">
          {{ $t('Cập nhật') }}
        </template>
        <template v-else>
          {{ $t('Tạo nhóm') }}
        </template>
      </button>
    </template>
  </BaseModal>
</template>
<script setup lang="ts">
import { ref } from 'vue'

import PageAvatar from '@/components/Avatar/PageAvatar.vue'
import BaseModal from '@/components/Base/BaseModal.vue'
import GroupItem from '@/views/Dashboard/Org/Setting/Group/GroupUpsertModal/GroupItem.vue'
import GroupSection from '@/views/Dashboard/Org/Setting/Group/GroupUpsertModal/GroupSection.vue'
import Loading from '@/components/Loading.vue'
import PageTypeIcon from '@/components/Avatar/PageTypeIcon.vue'

/**ref của modal hướng dẫn cài đặt */
const ref_group_upsert_modal = ref<InstanceType<typeof BaseModal>>()
/**tên nhóm */
const group_name = ref<string>()
/**tổng số trang đã chọn */
const total_page_selected = ref<number>(2)
/**tổng số nhân viên đã chọn */
const total_staff_selected = ref<number>(1)
/**cờ xác định đang thêm hay sửa */
const is_update = ref<boolean>()
/**cờ xác định đang tải dữ liệu */
const is_loading = ref<boolean>()

class Main {
  /**ẩn hiện modal */
  toggleModal() {
    // ẩn hiện modal
    ref_group_upsert_modal.value?.toggleModal?.()
  }
  /**thêm/sửa Nhóm */
  upsertGroup() {}
}
const $main = new Main()

defineExpose({ toggleModal: $main.toggleModal.bind($main) })
</script>
<style lang="scss" scoped>
.custom-btn {
  @apply py-2 px-4 rounded-md font-medium text-sm;
}
.item-avatar {
  @apply size-8 rounded-full;
}
</style>
