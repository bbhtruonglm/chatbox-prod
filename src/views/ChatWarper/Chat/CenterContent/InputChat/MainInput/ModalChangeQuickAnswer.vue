<template>
  <Modal
    ref="modal_change_quick_answer_ref"
    class_modal="w-[369px] h-fit"
  >
    <template #header>
      {{ $t('Chọn trang lấy câu trả lời nhanh') }}
    </template>
    <template #body>
      <div
        class="border py-2 px-3 flex justify-between items-center w-full rounded-md bg-white cursor-pointer"
        @click="dropdown_ref?.toggleDropdown"
      >
        {{
          index_page !== undefined &&
          orgStore.list_os?.[index_page]?.page_info?.name
        }}
        <ChevronDownIcon class="w-5 h-5" />
      </div>
      <button
        v-if="page_id !== conversationStore.select_conversation?.fb_page_id"
        class="py-2 px-3 rounded-md bg-blue-100 text-blue-700 font-medium w-full mt-2 border border-blue-700"
        @click="page_id = conversationStore.select_conversation?.fb_page_id || ''"
      >
        {{ $t('Khôi phục trang mặc định') }}
      </button>

      <Dropdown
        ref="dropdown_ref"
        position="BOTTOM"
        :is_fit="false"
        width="349px"
        height="auto"
        class_content="p-3 max-h-[40dvh] flex flex-col gap-2 overflow-hidden"
      >
        <input
          v-model="search"
          type="text"
          :placeholder="$t('Tìm kiếm')"
          class="w-full outline-none border py-2 px-3 rounded-md h-full"
        />
        <ul class="flex flex-col gap-2 overflow-auto">
          <li
            v-for="item in orgStore.list_os"
            class="py-2 px-2 rounded-md hover:bg-slate-100 cursor-pointer flex gap-2 items-center"
            v-show="showPage(item?.page_info)"
            @click="
              () => {
                page_id = item?.page_id || ''
                dropdown_ref?.toggleDropdown()
              }
            "
          >
            <PageAvatar
              :page_info="item?.page_info"
              class="w-8 h-8"
            />
            <div>
              <p>
                {{ item?.page_info?.name }}
              </p>
              <p class="text-slate-400 text-xs">
                {{ item?.page_id }}
              </p>
            </div>
          </li>
        </ul>
      </Dropdown>
    </template>
  </Modal>
</template>

<script setup lang="ts">
import { nonAccentVn } from '@/service/helper/format'
import { useConversationStore, useOrgStore } from '@/stores'
import { isEmpty } from 'lodash'
import { computed, ref } from 'vue'

import PageAvatar from '@/components/Avatar/PageAvatar.vue'
import Dropdown from '@/components/Dropdown.vue'
import Modal from '@/components/Modal.vue'

import { ChevronDownIcon } from '@heroicons/vue/24/solid'

import type { IPage } from '@/service/interface/app/page'

// store
const orgStore = useOrgStore()
const conversationStore = useConversationStore()

/** id trang */
const page_id = defineModel('page_id', {
  type: String,
  default: '',
})
/** modal thay đổi danh sách các câu trả lời nhanh */
const modal_change_quick_answer_ref = ref<InstanceType<typeof Modal> | null>(
  null
)
/** modal chọn page */
const dropdown_ref = ref<InstanceType<typeof Dropdown> | null>(null)
/** từ khóa tìm kiếm trang */
const search = ref('')
/** index page được chọn */
const index_page = computed(() =>
  orgStore.list_os?.findIndex(item => item?.page_id === page_id.value) || 0
)

/** có hiển thị trang không */
function showPage(page_info: IPage = {}) {
  // nếu không có dữ liệu thì không hiển thị
  if (isEmpty(page_info)) return false

  /** tên trang không đấu và không có khoảng trắng */
  const PAGE_NAME = nonAccentVn(page_info?.name || '')?.replace(/ /g, '')
  /** từ khóa tìm kiếm không đấu và khoảng trắng */
  const KEY_WORD = nonAccentVn(search.value)?.replace(/ /g, '')
  /** id page */
  const PAGE_ID = nonAccentVn(page_info?.fb_page_id || '')?.replace(/ /g, '')

  return PAGE_NAME.includes(KEY_WORD) || PAGE_ID.includes(KEY_WORD)
}

defineExpose({
  toggleModal() {
    modal_change_quick_answer_ref.value?.toggleModal()
  },
})
</script>
