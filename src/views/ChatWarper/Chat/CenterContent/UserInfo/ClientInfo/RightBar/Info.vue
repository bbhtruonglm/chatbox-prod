<template>
  <div class="flex-grow min-h-0 overflow-y-auto flex flex-col gap-2.5">
    <InfoItem
      :title="$t('v1.view.main.dashboard.chat.client.full_name')"
      :placeholder="$t('v1.view.main.dashboard.chat.client.full_name_require')"
      v-model="client_name"
    />

    <InfoItemGroup
      v-if="list_phone?.length"
      :source="list_phone"
      :title="$t('v1.view.main.dashboard.chat.client.phone')"
      :placeholder="$t('v1.view.main.dashboard.chat.client.full_name_require')"
      is_allow_remove
    />
    <InfoItemGroup
      v-if="list_email?.length"
      :source="list_email"
      :title="$t('v1.view.main.dashboard.chat.client.email')"
      :placeholder="$t('v1.view.main.dashboard.chat.client.full_name_require')"
      is_allow_remove
    />
    <InfoItemGroup
      v-if="list_address?.length"
      :source="list_address"
      :title="$t('v1.view.main.dashboard.chat.client.address')"
      :placeholder="$t('v1.view.main.dashboard.chat.client.full_name_require')"
      is_allow_remove
    />

    <div
      v-for="(value, key) of conversationStore.select_conversation?.client_bio
        ?.fb_info"
      class="flex items-start text-sm"
    >
      <div class="w-28 font-semibold ml-5 flex-shrink-0">
        {{ getClientFieldName(key) }}
      </div>
      <div>
        {{ value }}
      </div>
    </div>
  </div>
  <div class="flex-shrink-0 flex items-center gap-2.5">
    <button
      class="flex items-center text-slate-700 bg-slate-100 rounded-md text-sm py-2 px-4 gap-2 justify-center w-fit hover:brightness-90"
    >
      <ReloadContentIcon class="text-slate-700 w-4 h-4" />
      {{ $t('v1.view.main.dashboard.chat.client.reload_info') }}
    </button>
    <InfoIcon
      v-tooltip="$t('v1.view.main.dashboard.chat.client.require_ext')"
      class="w-4 h-4 text-slate-500 cursor-pointer"
    />
  </div>
</template>
<script setup lang="ts">
import { useConversationStore } from '@/stores'
import { useI18n } from 'vue-i18n'
import { computed, onMounted, ref } from 'vue'
import { get, set } from 'lodash'
import { toastError } from '@/service/helper/alert'

import InfoItem from '@/views/ChatWarper/Chat/CenterContent/UserInfo/ClientInfo/RightBar/InfoItem.vue'
import InfoItemGroup from '@/views/ChatWarper/Chat/CenterContent/UserInfo/ClientInfo/RightBar/InfoItemGroup.vue'

import InfoIcon from '@/components/Icons/Info.vue'
import ReloadContentIcon from '@/components/Icons/ReloadContent.vue'

import { AiAppContact, type ContactInfo } from '@/utils/api/Ai'

const conversationStore = useConversationStore()
const { t: $t } = useI18n()

/**danh sách số điện thoại */
const list_phone = ref<ContactInfo[]>([])
/**danh sách email */
const list_email = ref<ContactInfo[]>([])
/**danh sách địa chỉ */
const list_address = ref<ContactInfo[]>([])

/**id của trang */
const page_id = computed(
  () => conversationStore.select_conversation?.fb_page_id
)
/**id của khách hàng */
const client_id = computed(
  () => conversationStore.select_conversation?.fb_client_id
)
/**tên khách hàng */
const client_name = autoComputed(
  conversationStore.select_conversation,
  'client_name'
)

// lấy danh sách liên lạc của khách hàng khi component được mount
onMounted(getContact)

/**tự động bindding 2 chiều cho computed của hội thoại */
function autoComputed(source: any, target: string) {
  // sử dụng computed để bindding 2 chiều
  return computed({
    // lấy giá trị từ dữ liệu gốc
    get: () => get(source, target),
    // set lại giá trị vào dữ liệu gốc khi thay đổi
    set: val => set(source, target, val),
  })
}
/**tạo ra tên của field */
function getClientFieldName(key: string) {
  /**đường dẫn i18n */
  const I18N_PATH = 'v1.view.main.dashboard.chat.client.field'

  /**tạo ra title */
  const TITLE = $t(`${I18N_PATH}.${key}`)

  // nếu chưa có i18n thì trả về key gốc
  if (TITLE?.includes(I18N_PATH)) return key

  // trả về title
  return TITLE
}
/**đọc danh sách liên lạc của khách hàng */
async function getContact() {
  try {
    // nếu chưa có id của trang hoặc khách hàng thì bỏ qua
    if (!page_id.value || !client_id.value) return

    /**danh sách liên lạc */
    const CONTACT = await new AiAppContact(
      page_id.value,
      client_id.value
    ).getContact()

    // chia nhỏ danh sách liên lạc ra thành từng loại
    CONTACT?.map((item: ContactInfo) => {
      // nếu là số điện thoại thì thêm vào danh sách số điện thoại
      if (item.contact_type === 'PHONE') list_phone.value?.push(item)

      // nếu là email thì thêm vào danh sách email
      if (item.contact_type === 'EMAIL') list_email.value?.push(item)

      // nếu là địa chỉ thì thêm vào danh sách địa chỉ
      if (item.contact_type === 'ADDRESS') list_address.value?.push(item)
    })
  } catch (e) {
    // bắn lỗi ra thông báo
    toastError(e)
  }
}
</script>
