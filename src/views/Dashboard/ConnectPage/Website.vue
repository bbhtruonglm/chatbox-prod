<template>
  <div class="w-full h-full grid grid-cols-2">
    <div class="flex flex-col items-center justify-center gap-5 p-2">
      <div class="w-full flex flex-col gap-1">
        <div class="text-sm font-medium">
          {{ $t('v1.view.main.dashboard.select_platform.website.name') }}
          <span class="text-red-600">*</span>
        </div>
        <input
          v-model="name"
          :placeholder="
            $t('v1.view.main.dashboard.select_platform.website.input')
          "
          type="text"
          class="py-2 px-3 rounded-md border focus:outline-orange-500 w-full"
        />
      </div>
      <button
        @click="createWebsite"
        :class="{
          'contrast-50 cursor-not-allowed': !name,
        }"
        class="flex justify-between items-center py-2 px-4 gap-2 bg-slate-100 rounded-md hover:brightness-90 w-fit"
      >
        <WebIcon class="w-4 h-4" />
        <div class="text-slate-900 text-sm font-semibold">
          {{ $t('v1.view.main.dashboard.select_platform.website.btn_title') }}
        </div>
      </button>
    </div>
    <EmptyPage
      :icon="WebIcon"
      :guild="$t('v1.view.main.dashboard.select_platform.website.guild')"
      :description="
        $t('v1.view.main.dashboard.select_platform.website.description')
      "
    />
  </div>
  <InjectScript
    ref="inject_script_ref"
    :page_id
    @done="done"
  />
</template>
<script setup lang="ts">
import { ref } from 'vue'
import { toastError } from '@/service/helper/alert'
import { create_website_page } from '@/service/api/chatbox/n4-service'
import { useCommonStore, useConnectPageStore } from '@/stores'
import { isDomain } from '@/service/helper/check'
import { useI18n } from 'vue-i18n'

import EmptyPage from '@/views/Dashboard/ConnectPage/EmptyPage.vue'
import InjectScript from '@/views/Dashboard/ConnectPage/Website/InjectScript.vue'

import WebIcon from '@/components/Icons/Web.vue'
import type { PageInfo } from '@/service/interface/app/page'

const connectPageStore = useConnectPageStore()
const commonStore = useCommonStore()
const { t: $t } = useI18n()

/**tên của trang web mới */
const name = ref<string>()
/**ref của modal hướng dẫn nhúng script */
const inject_script_ref = ref<InstanceType<typeof InjectScript>>()
/**id trang sau khi tạo */
const page_id = ref<string>()

/**tạo mới page web */
async function createWebsite() {
  try {
    // nếu chưa nhập tên thì không thực hiện
    if (!name.value) return

    // hiển thị loading
    commonStore.is_loading_full_screen = true

    // kiểm tra tên trang web có hợp lệ không
    if (!isDomain(name.value))
      throw $t('v1.view.main.dashboard.select_platform.website.wrong_name')

    // tạo mới page web
    const PAGE: PageInfo = await new Promise((resolve, reject) =>
      create_website_page(
        {
          name: name.value!,
        },
        (e, r) => {
          if (e) return reject(e)

          resolve(r)
        }
      )
    )

    // lưu lại id trang mới được tạo
    page_id.value = PAGE?.fb_page_id

    // mở modal hướng dẫn nhúng script
    inject_script_ref.value?.toggleModal()
  } catch (e) {
    toastError(e)
  } finally {
    // tắt loading
    commonStore.is_loading_full_screen = false
  }
}
/**sau khi xong */
function done() {
  // reset lại giá trị
  name.value = ''

  // reset id trang
  page_id.value = undefined

  // quay lại page danh sách trang
  connectPageStore.selectMenu('WATTING')

}
</script>
