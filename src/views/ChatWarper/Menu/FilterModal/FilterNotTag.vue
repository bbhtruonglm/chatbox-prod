<template>
  <Popover
    ref="filter_popover_ref"
    :is_fit="false"
    width="450px"
    height="500px"
    position="RIGHT"
    :back="300"
  >
    <MenuTitle
      :title="$t('v1.view.main.dashboard.chat.filter.exclude_label.title')"
    />
    <div
      class="py-3 grid gap-2"
      :class="{
        'grid-cols-1':
          Object.keys(pageStore.selected_page_list_info).length === 1,
        'grid-cols-2':
          Object.keys(pageStore.selected_page_list_info).length > 1,
      }"
    >
      <SelectPage
        v-if="Object.keys(pageStore.selected_page_list_info).length > 1"
        :select_page="filterLabelByPage"
      />
      <input
        ref="search_ref"
        type="text"
        :placeholder="$t('Tìm kiếm nhãn')"
        class="border px-3 py-1 rounded-lg focus:outline-none w-full text-sm"
        v-on:keyup="searchLabel"
        v-model="label_search_name"
      />
    </div>
    <div class="h-[calc(100%_-_88px)] overflow-y-auto">
      <TagItem
        :is_disable="isDisableLabel(index)"
        v-for="(item, index) of label_list"
        v-show="item.show_label"
        @click="selectLabel(index)"
        :label="item"
        :is_selected="item?.is_selected"
      />
    </div>
  </Popover>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useConversationStore, usePageStore } from '@/stores'
import { map, isString, debounce, sortBy, mapValues, size } from 'lodash'
import { copy, nonAccentVn } from '@/service/helper/format'
import { watch } from 'vue'

import SelectPage from './Tag/SelectPage.vue'
import Popover from '@/components/Popover.vue'
import TagItem from '@/views/ChatWarper/Menu/FilterModal/Tag/TagItem.vue'
import MenuTitle from '@/components/Main/Dashboard/MenuTitle.vue'

import type { ComponentRef } from '@/service/interface/vue'
import type { ILabel } from '@/service/interface/app/label'

const conversationStore = useConversationStore()
const pageStore = usePageStore()

/** Danh sách label của page đang được chọn */
const label_list = ref<ILabel[]>([])
/** Snap label của page đang được chọn */
const snap_labels = ref<{ [index: string]: ILabel }>({})
/** ID page hiện tại đang được chọn */
const label_search_name = ref<string>('')
/**ref của dropdown */
const filter_popover_ref = ref<ComponentRef>()
/**ref của dropdown search */
const search_ref = ref<ComponentRef>()

watch(
  () => pageStore.selected_page_list_info,
  () => getLabelList()
)

onMounted(() => {
  /**Trường hợp điều kiện lọc theo nhãn and là string thì ghi đè lại thành boolean  */
  if (isString(conversationStore.option_filter_page_data.label_and)) {
    conversationStore.option_filter_page_data.label_and = false
  }
})

/** Xoá lọc */
function clearThisFilter() {
  delete conversationStore.option_filter_page_data.not_label_id

  // loại bỏ gắn cờ
  label_list.value = label_list.value.map(label => {
    label.is_selected = false

    return label
  })
}
/** Lấy danh sách nhãn */
function getLabelList() {
  // lưu lại danh sách nhãn gốc dưới dạng obj
  map(pageStore.selected_page_list_info, item => {
    /**tạo ra obj mới để tránh lỗi trùng lặp lựa chọn */
    const ORIGIN_PAGE_LIST_LABEL: Record<string, ILabel> = copy(
      mapValues(item.label_list, label => {
        // gắn toàn bộ nhãn cờ chưa chọn để tránh lỗi khi sort
        label.is_selected = false

        return label
      })
    )

    // gộp vào snap label
    snap_labels.value = { ...snap_labels.value, ...ORIGIN_PAGE_LIST_LABEL }
  })

  // đánh dấu các label đã được chọn
  label_list.value = map(snap_labels.value, label => {
    // check từ store
    if (
      conversationStore.option_filter_page_data.not_label_id?.includes(
        label?._id
      )
    )
      label.is_selected = true

    // * Gắn cờ hiển thị
    label.show_label = true

    return label
  })

  // lọc đã chọn lên đầu
  label_list.value = sortLabel(label_list.value)
}
/**chặn các nhãn đã được bên đối diện lựa chọn */
function isDisableLabel(index: number) {
  /**nhãn được chọn */
  const SELECTED_LABEL = label_list.value?.[index]
  /**dữ liệu filter */
  const FILTER = conversationStore.option_filter_page_data

  // nếu bên lọc nhãn đã chọn thì bỏ qua
  return FILTER.label_id?.includes(SELECTED_LABEL._id)
}
/** Chọn nhãn */
function selectLabel(index: number) {
  /**nhãn được chọn */
  const SELECTED_LABEL = label_list.value?.[index]
  /**dữ liệu filter */
  const FILTER = conversationStore.option_filter_page_data

  // nếu không có nhãn được chọn thì dừng
  if (!SELECTED_LABEL) return

  // nếu bên lọc nhãn đã chọn thì bỏ qua
  if (isDisableLabel(index)) return

  // toggle nhãn
  SELECTED_LABEL.is_selected = !SELECTED_LABEL.is_selected

  /**danh sách id nhãn đã chọn */
  let list_id = label_list.value
    ?.filter(label => label.is_selected)
    ?.map(label => label._id)

  // lưu lại id nhãn đã chọn vào store
  FILTER.not_label_id = size(list_id) ? list_id : undefined

  // sort đã chọn lên đầu
  label_list.value = sortLabel(label_list.value)
}
/**đưa các label được chọn lên đầu */
function sortLabel(input: ILabel[]) {
  return sortBy(input, 'is_selected').reverse()
}
/** Tìm kiếm nhãn theo tên */
const searchLabel = debounce(($event: Event) => {
  // nếu không tìm kiếm thì hiển thị toàn bộ
  if (!label_search_name.value)
    return (label_list.value = sortLabel(map(snap_labels.value)))

  // lọc các nhãn thoả mãn tìm kiếm
  let temp: ILabel[] = map(snap_labels.value).filter((item: ILabel) =>
    nonAccentVn(item.title).includes(nonAccentVn(label_search_name.value))
  )

  label_list.value = sortLabel(temp)
}, 300)
/** Hiển thị nhãn theo page đã chọn */
function filterLabelByPage(page_id: string) {
  if (!page_id) {
    // * Hiển thị toàn bộ label
    label_list.value = label_list.value.map(label => {
      label.show_label = true
      return label
    })
  } else {
    // * Gắn cờ hiển thị từng label theo page đã chọn
    label_list.value = label_list.value.map(label => {
      if (label.fb_page_id === page_id) label.show_label = true
      else label.show_label = false
      return label
    })
  }

  // * Sort lại label
  label_list.value = sortLabel(label_list.value)

  // * Xóa input tìm kiếm nhãn
  label_search_name.value = ''
}

defineExpose({ filter_popover_ref, clearThisFilter })
</script>
