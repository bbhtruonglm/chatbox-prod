<template>
  <Modal
    ref="inc_quota_ref"
    class_modal=""
    class_body="py-2 flex gap-2"
  >
    <template #header>
      {{
        $t(
          `v1.view.main.dashboard.org.pay.inc_quota.${inc_quota_type?.toLowerCase()}`
        )
      }}
    </template>
    <template #body>
      <div class="bg-white rounded-md p-2 flex flex-col relative">
        <div
          v-if="is_loading"
          class="absolute top-0 left-1/2 -translate-x-1/2 flex justify-center items-center"
        >
          <Loading />
        </div>
        <input
          v-model="amount"
          type="number"
          class="focus:outline-orange-500 py-2 px-3 rounded-md border"
        />
        <button
          @click="incQuota"
          class="py-2 px-4 rounded-md bg-blue-600 text-white hover:brightness-90"
        >
          mua
        </button>
      </div>
    </template>
  </Modal>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import { toast, toastError } from '@/service/helper/alert'

import Loading from '@/components/Loading.vue'
import Modal from '@/components/Modal.vue'

import type { QuotaType } from '@/service/interface/app/ai'
import { inc_quota, read_wallet } from '@/service/api/chatbox/billing'
import { useOrgStore } from '@/stores'
import { useI18n } from 'vue-i18n'

const $emit = defineEmits(['done'])

const $props = withDefaults(
  defineProps<{
    /**class cho modal */
    inc_quota_type?: QuotaType
  }>(),
  {}
)

const orgStore = useOrgStore()
const { t: $t } = useI18n()

/**có đang loading không */
const is_loading = ref<boolean>(false)
/**ref của modal kết nối nền tảng */
const inc_quota_ref = ref<InstanceType<typeof Modal>>()
/**số quota muốn thêm */
const amount = ref<number>(0)

/**ẩn hiện modal của component */
function toggleModal() {
  inc_quota_ref.value?.toggleModal()
}
/**mua thêm quota */
async function incQuota() {
  // nếu đang loading thì không làm gì
  if (!orgStore.selected_org_id || is_loading.value || !$props.inc_quota_type)
    return

  // mở loading
  is_loading.value = true

  try {
    // TODO check amount trước khi thêm

    /**dữ liệu của ví */
    const WALLET = await read_wallet(orgStore.selected_org_id)

    // nếu không có ví thì thông báo lỗi
    if (!WALLET?.wallet_id)
      throw $t('v1.view.main.dashboard.org.pay.recharge.wrong_wallet_id')

    // thêm quota
    await inc_quota(
      orgStore.selected_org_id,
      WALLET?.wallet_id,
      $props.inc_quota_type,
      amount.value
    )

    // thông báo mua gói thành công
    toast('success', $t(`v1.view.main.dashboard.org.pay.inc_quota.success`))

    // chờ 1s
    await new Promise(cb => setTimeout(cb, 1000))

    // reload lại trang
    window.location.reload()
  } catch (e) {
    // thông báo lỗi
    toastError(e)
  }

  // tắt loading
  is_loading.value = false
}

// cung cấp hàm toggle modal cho component cha
defineExpose({ toggleModal })
</script>
