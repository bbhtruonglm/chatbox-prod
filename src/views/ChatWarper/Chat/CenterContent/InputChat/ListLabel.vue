<template>
  <div
    id="chat__select-label"
    :class="is_expand_label ? 'max-h-40 min-h-6' : 'h-6'"
    class="flex gap-1 group"
  >
    <div
      v-if="is_loading_label"
      class="absolute z-10 left-1/2 -translate-x-1/2"
    >
      <Loading />
    </div>

    <div class="flex items-start flex-grow gap-1">
      <div
        ref="ref_labels"
        :class="is_expand_label ? 'overflow-y-auto' : 'overflow-hidden'"
        class="w-full flex flex-wrap justify-start gap-1 h-full"
      >
        <LabelItem
          v-for="label of labels"
          :label
          @click="$main.toggleLabel(label._id)"
        />
      </div>
      <button
        v-tooltip="
          is_expand_label ? $t('v1.common.contract') : $t('v1.common.expand')
        "
        v-if="total_over_label"
        @click="$main.expandList"
        class="rounded border border-slate-500 text-slate-700 w-6 h-6 flex-shrink-0 justify-center items-center flex text-xs font-semibold"
      >
        +{{ total_over_label }}
      </button>
    </div>

    <button
      v-tooltip="$t('v1.common.setting')"
      @click="$main.openSettingLabel"
      class="rounded border border-slate-700 w-6 h-6 flex-shrink-0 justify-center items-center hidden group-hover:flex"
    >
      <CogBoldIcon class="w-4 h-4 text-slate-700" />
    </button>
  </div>
</template>
<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { map, sortBy } from 'lodash'
import { useConversationStore, useOrgStore } from '@/stores'

import Loading from '@/components/Loading.vue'
import LabelItem from '@/views/ChatWarper/Chat/CenterContent/InputChat/ListLabel/LabelItem.vue'

import CogBoldIcon from '@/components/Icons/CogBold.vue'

import type { ICustomLabel } from './ListLabel/type'
import { loading } from '@/utils/decorator/loading'
import { error } from '@/utils/decorator/error'
import { container } from 'tsyringe'
import { Toast } from '@/utils/helper/Alert/Toast'
import { N4SerivceAppOneConversation } from '@/utils/api/N4Service/Conversation'
import { nextTick } from 'async'
import {
  Navigation,
  WindowAction,
  type IWindowAction,
} from '@/utils/helper/Navigation'
import { Locale, LocaleSingleton, type ILocale } from '@/utils/helper/Locale'
import { Parser } from '@/utils/helper/Parser'
import { LocalStorage, type ILocalStorage } from '@/utils/helper/LocalStorage'

const conversationStore = useConversationStore()
const $toast = container.resolve(Toast)
const locale = LocaleSingleton.getInst().get()
const orgStore = useOrgStore()

/**tham chiếu đến div danh sách nhãn */
const ref_labels = ref<HTMLDivElement>()
/**gắn cờ hiển thị nhiều nhãn */
const is_expand_label = ref(false)
/**gắn cờ đang loading label */
const is_loading_label = ref(false)
/**danh sách nhãn của trang của hội thoại này */
const labels = ref<ICustomLabel[]>()
/**tổng số nhãn bị ẩn */
const total_over_label = ref<number>(0)

class Main {
  /**
   * @param SERVICE_LOCALSTORAGE service lưu trữ local
   * @param SERVICE_LOCALE service ngôn ngữ
   * @param SERVICE_WINDOW_ACTION service thao tác cửa sổ
   */
  constructor(
    private readonly SERVICE_LOCALSTORAGE: ILocalStorage = container.resolve(
      LocalStorage
    ),
    private readonly SERVICE_LOCALE: ILocale = container.resolve(Locale),
    private readonly SERVICE_WINDOW_ACTION: IWindowAction = container.resolve(
      WindowAction
    )
  ) {}

  /**kiểm tra label có được chọn hay không */
  private isActiveLabel(label_id?: string) {
    // nếu không có nhãn thì trả về false
    if (!label_id) return false

    // trả về trạng thái nhãn có được chọn hay không
    return conversationStore.getActiveLabelIds()?.includes(label_id)
  }
  /**đếm số nhãn bị ẩn bởi css flex overflow-hidden  */
  private countHiddenLabel(): void {
    /**số px của gap */
    const GAP = 4
    /**độ rộng của div bao ngoài danh sách nhãn */
    const CONTAINER_WIDTH = ref_labels.value?.clientWidth || 0

    // chờ render xong mới thực hiện
    nextTick(() => {
      // lấy toàn bộ các div nhãn bên trong div bao ngoài
      const DIV_LABELS = ref_labels.value?.querySelectorAll('button')

      /**tổng độ rộng của các div nhãn */
      let total_width = 0

      // lặp qua từng div nhãn, lấy width của nó
      map(DIV_LABELS, div => {
        /**độ rộng của div tính cả gap */
        const LABEL_WIDTH = div.clientWidth + GAP

        // cộng dồn vào tổng độ rộng
        total_width += LABEL_WIDTH

        // nếu vượt thì tăng số nhãn bị ẩn
        if (total_width > CONTAINER_WIDTH) total_over_label.value++
      })
    })
  }

  /**khởi tạo danh sách nhãn của trang của hội thoại đang chọn */
  getLabels(): void {
    /**dữ liệu nhãn gốc của trang */
    const MAP_LABELS = conversationStore.getLabels()

    // mảng các nhãn
    labels.value = map(MAP_LABELS)?.map((label: ICustomLabel) => {
      // tiêm trạng thái nhãn được chọn
      label.is_active = this.isActiveLabel(label._id)

      // trả về nhãn đã được tiêm trạng thái
      return label
    })

    // sắp xếp các nhãn được chọn lên trên, và sắp xếp theo thời gian tạo
    labels.value = sortBy(labels.value, ['is_active', 'createdAt'])?.reverse()

    // đếm số nhãn bị ẩn
    this.countHiddenLabel()
  }
  /**xem toàn bộ, chỉ xem 1 dòng của nhãn */
  expandList() {
    // nếu về chế độ 1 dòng, thì scroll về đầu
    if (is_expand_label.value && ref_labels.value)
      ref_labels.value.scrollTop = 0

    // thay đổi trạng thái hiển thị
    is_expand_label.value = !is_expand_label.value
  }
  /**
   * thay đổi gắn nhãn của khách hàng này
   * @param label_id id của nhãn
   */
  @loading(is_loading_label)
  @error($toast)
  async toggleLabel(label_id: string) {
    // nếu không có trang hoặc khách hàng nào được chọn thì không thực hiện
    if (
      !conversationStore.select_conversation?.fb_page_id ||
      !conversationStore.select_conversation?.fb_client_id
    )
      return

    // thực hiện thay đổi nhãn
    await new N4SerivceAppOneConversation(
      conversationStore.select_conversation?.fb_page_id as string,
      conversationStore.select_conversation?.fb_client_id as string
    ).toggleLabel(label_id)
  }
  openSettingLabel() {
    /**id trang */
    const PAGE_ID = conversationStore.select_conversation?.fb_page_id

    /**đường dẫn ui thiết lập trang */
    const URI = $env.host.page_setting_view

    /**dữ liệu đính kèm url */
    const QS = Parser.toQueryString({
      token: this.SERVICE_LOCALSTORAGE.getItem('access_token'),
      fb_page_id: PAGE_ID,
      page_id: PAGE_ID,
      locale: this.SERVICE_LOCALE.get(),
      org_id: orgStore.selected_org_id,
    })

    // mở tab mới
    this.SERVICE_WINDOW_ACTION.openNewTab(`${URI}/dialogue-tag?${QS}`)
  }
}
const $main = new Main()

onMounted(() => $main.getLabels())
</script>
