<template>
  <Modal
    ref="move_to_org_ref"
    class_modal="h-80"
    class_body="py-2 flex gap-2"
  >
    <template #header>
      {{ $t('v1.view.main.dashboard.select_platform.move_org.title') }}
    </template>
    <template #body>
      <div class="w-72 bg-white rounded-md p-2 flex flex-col gap-2 relative">
        <div
          v-if="is_loading"
          class="absolute top-14 left-1/2 -translate-x-1/2"
        >
          <Loading class="mx-auto" />
        </div>
        <div class="text-xs text-slate-500 text-center flex-shrink-0">
          {{
            $t('v1.view.main.dashboard.select_platform.move_org.move', {
              count: count_select_page,
            })
          }}
        </div>
        <div class="overflow-auto border-b flex flex-col flex-grow">
          <button
            v-for="org of list_admin_org"
            @click="selectOrg(org)"
            :class="{
              'bg-slate-100': selected_org_id === org.org_id,
              'cursor-not-allowed': isOverQuota(org),
            }"
            class="flex gap-2 p-2 hover:bg-slate-100 rounded-md items-center"
          >
            <Radio
              @click.stop
              v-model="selected_org_id"
              :value="org.org_id"
              class="flex-shrink-0"
            />
            <div class="rounded-oval p-2 bg-gray-100 w-8 h-8 flex-shrink-0">
              <BriefCaseIcon />
            </div>
            <div class="min-w-0 text-left">
              <div
                :class="{
                  'text-slate-500': isOverQuota(org),
                }"
                class="font-medium text-sm truncate"
              >
                {{ org?.org_info?.org_name }}
              </div>
              <div class="text-xs flex gap-2 items-center">
                <StackIcon class="w-3.5 h-3.5 flex-shrink-0" />
                {{ org?.org_package?.org_current_page }}
                /
                <span class="text-green-600">
                  {{ org?.org_package?.org_quota_page }}
                </span>
                →
                {{ countNewCurrentPage(org) }}
                /
                <span class="text-red-600">
                  {{ org?.org_package?.org_quota_page }}
                </span>
              </div>
            </div>
          </button>
        </div>
        <div class="flex-shrink-0 flex justify-between">
          <Button
            @click="toggleModal"
            class="bg-slate-100 text-slate-500"
          >
            {{ $t('v1.common.cancel') }}
          </Button>
          <Button
            @click="continueMove"
            :class="
              selected_org_id
                ? 'bg-blue-100 text-blue-600'
                : 'cursor-not-allowed bg-slate-200 text-slate-500'
            "
          >
            {{ $t('v1.common.continue') }}
          </Button>
        </div>
      </div>
    </template>
  </Modal>
</template>
<script setup lang="ts">
import { computed, ref } from 'vue'
import { useOrgStore } from '@/stores'
import { eachOfLimit } from 'async'
import { add_os } from '@/service/api/chatbox/billing'
import { toastError } from '@/service/helper/alert'

import Loading from '@/components/Loading.vue'
import Modal from '@/components/Modal.vue'
import Radio from '@/components/Radio.vue'
import Button from '@/views/Dashboard/ConnectPage/Button.vue'

import BriefCaseIcon from '@/components/Icons/BriefCase.vue'
import StackIcon from '@/components/Icons/Stack.vue'

import type { OrgInfo } from '@/service/interface/app/billing'

const $emit = defineEmits(['done'])

const $props = withDefaults(
  defineProps<{
    /**các trang đang chọn ngoài tổ chức */
    list_another_org_page_id?: string[]
  }>(),
  {}
)

const orgStore = useOrgStore()

/**ref của modal kết nối nền tảng */
const move_to_org_ref = ref<InstanceType<typeof Modal>>()
/**có loading không */
const is_loading = ref(false)
/**id tổ chức */
const selected_org_id = ref<string>()

/**danh sách các tổ chức có quyền quản trị */
const list_admin_org = computed(() =>
  orgStore.list_org?.filter(org => org?.current_ms?.ms_role === 'ADMIN')
)
/**số lượng trang đang chọn */
const count_select_page = computed(
  () => $props.list_another_org_page_id?.length || 0
)

/**ẩn hiện modal của component */
function toggleModal() {
  move_to_org_ref.value?.toggleModal()
}
/**đếm xem nếu thêm page thì tổng số page mới là bao nhiêu */
function countNewCurrentPage(org: OrgInfo) {
  return (org?.org_package?.org_current_page || 0) + count_select_page.value
}
/**kiểm tra xem có bị quá giới hạn không */
function isOverQuota(org: OrgInfo) {
  return countNewCurrentPage(org) > (org?.org_package?.org_quota_page || 0)
}
/**chọn tổ chức sẽ chuyển */
function selectOrg(org: OrgInfo) {
  // nếu tổng số trang mới lớn hơn số trang tối đa thì không chọn
  if (isOverQuota(org)) return

  // chọn tổ chức
  selected_org_id.value = org.org_id
}
/**di chuyển page vào tổ chức -> đi tiếp */
async function continueMove() {
  // nếu không chọn tổ chức thì không thể tiếp tục
  if (!selected_org_id.value) return

  // hiển thị loading
  is_loading.value = true

  try {
    // thêm trang các vào tổ chức
    await eachOfLimit(
      $props.list_another_org_page_id,
      1,
      async (page_id, i) =>
        await add_os(selected_org_id.value!, page_id as string)
    )

    // đóng modal
    toggleModal()

    // thông báo thành công ra ngoài
    $emit('done')
  } catch (e) {
    // thông báo lỗi
    toastError(e)
  }

  // ẩn loading
  is_loading.value = false
}

// cung cấp hàm toggle modal cho component cha
defineExpose({ toggleModal })
</script>
