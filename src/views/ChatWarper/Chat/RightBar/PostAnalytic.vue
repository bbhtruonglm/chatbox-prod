<template>
  <div class="bg-white rounded-lg h-full flex flex-col text-sm font-semibold">
    <div class="py-2 px-3 border-b flex-shrink-0">
      {{ $t('Tổng quan bài viết') }}
    </div>
    <div class="flex-grow min-h-0 overflow-y-auto p-3 flex flex-col gap-8">
      <ul class="list-disc list-inside">
        {{
          $t('Thống kê chung')
        }}:
        <li>{{ $t('Bình luận') }}: {{ analytic?.total_comment || 0 }}</li>
        <li>{{ $t('Chia sẻ') }}: {{ analytic?.total_share || 0 }}</li>
        <li>{{ $t('Thích') }}: {{ analytic?.total_reaction_like || 0 }}</li>
        <li>{{ $t('Yêu thích') }}: {{ analytic?.total_reaction_love || 0 }}</li>
        <li>{{ $t('Wow') }}: {{ analytic?.total_reaction_wow || 0 }}</li>
        <li>{{ $t('Haha') }}: {{ analytic?.total_reaction_haha || 0 }}</li>
        <li>{{ $t('Buồn') }}: {{ analytic?.total_reaction_sorry || 0 }}</li>
        <li>{{ $t('Giận dữ') }}: {{ analytic?.total_reaction_anger || 0 }}</li>
      </ul>
      <ol class="list-decimal list-inside">
        {{
          $t('Thống kê AI')
        }}:
        <li>
          {{ $t('Cảm xúc') }}
          <ul class="list-disc list-inside">
            <li>{{ $t('Thích') }}: {{ analytic?.total_emotion_like || 0 }}</li>
            <li>
              {{ $t('Vui vẻ') }}: {{ analytic?.total_emotion_happy || 0 }}
            </li>
            <li>{{ $t('Buồn') }}: {{ analytic?.total_emotion_sad || 0 }}</li>
            <li>
              {{ $t('Giận dữ') }}: {{ analytic?.total_emotion_angry || 0 }}
            </li>
          </ul>
        </li>
        <li>
          {{ $t('CTA') }}
          <ul class="list-disc list-inside">
            <li>
              {{ $t('Lên đơn') }}: {{ analytic?.total_cta_place_order || 0 }}
            </li>
            <li>{{ $t('Lập lịch') }}: {{ analytic?.total_cta_time || 0 }}</li>
            <li>
              {{ $t('Số điện thoại') }}: {{ analytic?.total_cta_phone || 0 }}
            </li>
            <li>{{ $t('Email') }}: {{ analytic?.total_cta_email || 0 }}</li>
            <li>{{ $t('Đường dẫn') }}: {{ analytic?.total_cta_link || 0 }}</li>
            <li>{{ $t('Địa chỉ') }}: {{ analytic?.total_cta_address || 0 }}</li>
            <li>
              {{ $t('Vận chuyển') }}: {{ analytic?.total_cta_shipping || 0 }}
            </li>
            <li>
              {{ $t('Giao dịch') }}: {{ analytic?.total_cta_transaction || 0 }}
            </li>
            <li>{{ $t('Bán hàng') }}: {{ analytic?.total_cta_sale || 0 }}</li>
            <li>
              {{ $t('Tài liệu') }}: {{ analytic?.total_cta_document || 0 }}
            </li>
          </ul>
        </li>
      </ol>
      <ul class="list-disc list-inside">
        {{
          $t('Thông tin bài viết')
        }}
        <li>
          {{ $t('ID bài viết') }}:
          {{ conversationStore.select_conversation_post?.post_id }}
        </li>
        <li>
          {{ $t('Ngày tạo') }}:
          {{
            $date_handle.format(
              conversationStore.select_conversation_post?.createdAt,
              'dd/MM/yyyy'
            )
          }}
        </li>
        <li>
          {{ $t('Người tạo') }}:
          {{ creator_name }}
        </li>
        <li>
          {{ $t('Ngày cập nhật') }}:
          {{
            $date_handle.format(
              conversationStore.select_conversation_post?.createdAt,
              'dd/MM/yyyy'
            )
          }}
        </li>
        <li>
          {{ $t('Người cập nhật') }}:
          {{ creator_name }}
        </li>
      </ul>
    </div>
  </div>
</template>
<script setup lang="ts">
import { useConversationStore } from '@/stores'
import { container } from 'tsyringe'
import { computed, onMounted, ref, watch } from 'vue'
import { composableService } from '@/views/ChatWarper/Chat/CenterContent/MessageList/PostTemplate/service'
import { DateHandle } from '@/utils/helper/DateHandle'
import { N4SerivceAppPost } from '@/utils/api/N4Service/Post'
import { error } from '@/utils/decorator/Error'
import { loadingV2 } from '@/utils/decorator/Loading'

const { PostService } = composableService()

const $post_service = container.resolve(PostService)
const $date_handle = container.resolve(DateHandle)
const conversationStore = useConversationStore()

/**trạng thái loading */
const is_loading = ref<boolean>(false)

/**tên người tạo bài viết này */
const creator_name = computed(() =>
  $post_service.getCreatorName(conversationStore.select_conversation_post)
)
/**id của page */
const page_id = computed(
  () => conversationStore.select_conversation_post?.page_id
)
/**id của bài viết */
const post_id = computed(
  () => conversationStore.select_conversation_post?.post_id
)
/**thống kê của bài viết */
const analytic = computed(
  () => conversationStore.select_conversation_post_analytic?.post_analytic_data
)

class Main {
  /**
   * @param API_POST API lấy dữ liệu bài post
   */
  constructor(
    private readonly API_POST: N4SerivceAppPost = container.resolve(
      N4SerivceAppPost
    )
  ) {}
  /**đọc thống kê của bài viết này */
  @loadingV2(is_loading, 'value')
  @error()
  async getPostAnalytic() {
    // xấc thực dữ liệu
    if (!page_id.value || !post_id.value) return

    // lấy dữ liệu
    conversationStore.select_conversation_post_analytic =
      await this.API_POST.getPostAnalytic(page_id.value, post_id.value)
  }
}
const $main = new Main()

// khi component được mount
onMounted(() => $main.getPostAnalytic())

// khi đổi bài viết
watch(
  () => post_id.value,
  () => $main.getPostAnalytic()
)
</script>
