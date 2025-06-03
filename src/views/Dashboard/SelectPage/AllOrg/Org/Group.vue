<template>
  <select
    v-if="org?.current_ms?.ms_role === 'ADMIN'"
    v-model="selected_group_id"
    class="bg-slate-100 rounded px-2 py-1 font-medium text-xxs max-w-40 truncate"
  >
    <option value="ALL">{{ $t('Tất cả Nhóm') }}</option>
    <option
      v-for="group of groups"
      :value="group?.group_id"
    >
      {{ group?.group_name }}
    </option>
  </select>
  <div
    v-else
    class="group-hover/org-item:flex items-center gap-1 flex-grow min-w-0 overflow-hidden overflow-x-auto hidden"
  >
    <div
      v-for="group of access_groups"
      class="py-1 px-3 rounded bg-gray-100 text-xs font-normal"
    >
      {{ group?.group_name }}
    </div>
  </div>
</template>
<script setup lang="ts">
import { useChatbotUserStore, useOrgStore } from '@/stores'
import { BillingAppGroup } from '@/utils/api/Billing'
import { computed, inject, onMounted, provide, ref, watch } from 'vue'
import {
  KEY_GET_ALL_ORG_AND_PAGE_FN,
  KEY_GET_ORG_PAGES_FN,
} from '@/views/Dashboard/symbol'

const $props = withDefaults(
  defineProps<{
    /** id tổ chức */
    org_id: string
  }>(),
  {}
)

const orgStore = useOrgStore()
const chatbotUserStore = useChatbotUserStore()
/**lấy danh sách trang đã kích hoạt */
const getOrgPages = inject(KEY_GET_ORG_PAGES_FN)
const getALlOrgAndPage = inject(KEY_GET_ALL_ORG_AND_PAGE_FN)

/**danh sách nhóm của tổ chức này */
const groups = ref<IGroup[]>()
/**dữ liệu của tổ chức */
const org = computed(() => orgStore.findOrg($props.org_id))

class Main {
  /**hủy chọn nhóm */
  cancelGroup(): void {
    // nếu không có id tổ chức được chọn thì thôi
    if (!$props.org_id) return

    // xóa id nhóm được chọn của tổ chức này
    delete orgStore.selected_org_group[$props.org_id]

    // lấy lại danh sách trang
    getALlOrgAndPage?.({
      org_group: orgStore.selected_org_group,
    })
  }
  /**đọc danh sách nhóm */
  async readGroup(): Promise<void> {
    // đọc toàn bộ nhóm từ server
    groups.value = await new BillingAppGroup().readGroup($props.org_id)
  }
  /**chọn nhóm */
  selectGroup(group_id?: string): void {
    // nếu không có id nhóm thì thôi
    if (!group_id) return
    // nếu không có id tổ chức được chọn thì thôi
    if (!$props.org_id) return

    // chọn id nhóm cho tổ chức này
    orgStore.selected_org_group[$props.org_id] = group_id

    // lấy lại danh sách trang
    getALlOrgAndPage?.({
      org_group: orgStore.selected_org_group,
    })
  }
}
const $main = new Main()

// lấy danh sách nhóm khi thành phần được khởi tạo
onMounted(() => $main.readGroup())

watch(
  () => $props.org_id,
  () => $main.readGroup()
)

/**id của nhóm đang được chọn */
const selected_group_id = computed({
  get: () => {
    /**id nhóm */
    const GROUP_ID = orgStore.selected_org_group[$props.org_id]

    // nếu không có id nhóm thì trả về 'ALL'
    if (!GROUP_ID) return 'ALL'

    // trả về id nhóm
    return GROUP_ID
  },
  set: val => {
    // nếu lây 'ALL' thì hủy chọn nhóm
    if (val === 'ALL') $main.cancelGroup()
    // nếu lấy id nhóm thì chọn nhóm
    else $main.selectGroup(val)
  },
})

/**id người dùng hiện tại */
const user_id = computed(() => chatbotUserStore.chatbot_user?.user_id)

/**các nhóm người dùng hiện tại được phép truy cập */
const access_groups = computed(() => {
  return groups.value?.filter(group =>
    group?.group_staffs?.includes(user_id.value || '')
  )
})
</script>
<style lang="scss" scoped>
.group__btn--base {
  @apply py-1 px-3 rounded text-sm font-medium;
}
</style>
