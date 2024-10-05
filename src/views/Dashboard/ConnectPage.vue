<template>
  <Modal
    ref="modal_connect_page_ref"
    class_modal="h-3/4"
    class_body="py-2 flex gap-2"
  >
    <template #header>
      {{ $t('v1.view.main.dashboard.select_platform.add_page') }}
    </template>
    <template #body>
      <Menu />
      <div class="w-[784px] bg-white rounded-md p-2 flex flex-col relative">
        <div
          v-if="connectPageStore.is_loading"
          class="absolute top-14 left-1/2 -translate-x-1/2"
        >
          <Loading class="mx-auto" />
        </div>
        <div
          class="font-semibold p-2 border-b border-slate-200 flex-shrink-0 flex items-center justify-between"
        >
          <template v-if="connectPageStore.current_menu === 'WATTING'">
            <div>
              {{ $t('v1.view.main.dashboard.select_platform.active_page') }}
            </div>
            <Search />
          </template>
          <template v-else-if="connectPageStore.current_menu === 'WEBSITE'">
            {{ $t('v1.view.main.dashboard.select_platform.website.title') }}
          </template>
          <template v-else>
            {{
              $t('v1.view.main.dashboard.select_platform.connect_with', {
                platform: $t(
                  `v1.common.${connectPageStore.current_menu?.toLowerCase()}`
                ),
              })
            }}
          </template>
        </div>
        <ActivePage
          v-if="connectPageStore.current_menu === 'WATTING'"
          @done="$emit('done')"
        />
        <Facebook v-else-if="connectPageStore.current_menu === 'FB_MESS'" />
        <Website v-else-if="connectPageStore.current_menu === 'WEBSITE'" />
        <ZaloOA v-else-if="connectPageStore.current_menu === 'ZALO_OA'" />
        <div
          v-else
          class="p-2"
        >
          {{ $t('v1.common.upcoming_feature') }}
        </div>
      </div>
    </template>
  </Modal>
</template>
<script setup lang="ts">
import { provide, ref } from 'vue'
import { useConnectPageStore } from '@/stores'
import { KEY_TOGGLE_MODAL_FUNCT } from '@/views/Dashboard/ConnectPage/symbol'

import Loading from '@/components/Loading.vue'
import Modal from '@/components/Modal.vue'
import Menu from '@/views/Dashboard/ConnectPage/Menu.vue'
import ActivePage from '@/views/Dashboard/ConnectPage/ActivePage.vue'
import Facebook from '@/views/Dashboard/ConnectPage/Facebook.vue'
import Website from '@/views/Dashboard/ConnectPage/Website.vue'
import ZaloOA from '@/views/Dashboard/ConnectPage/ZaloOA.vue'
import Search from '@/views/Dashboard/ConnectPage/Search.vue'

const $emit = defineEmits(['done'])

const connectPageStore = useConnectPageStore()

/**ref của modal kết nối nền tảng */
const modal_connect_page_ref = ref<InstanceType<typeof Modal>>()

/**ẩn hiện modal của component */
function toggleModal() {
  modal_connect_page_ref.value?.toggleModal()
}

// cung cấp hàm toggle modal cho component cha
defineExpose({ toggleModal })

// cung cấp hàm toggle modal cho component con
provide(KEY_TOGGLE_MODAL_FUNCT, toggleModal)
</script>
