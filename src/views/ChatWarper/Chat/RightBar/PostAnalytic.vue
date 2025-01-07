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
        <li>{{ $t('Reaction') }}:</li>
        <li>{{ $t('Bình luận') }}:</li>
      </ul>
      <ol class="list-decimal list-inside">
        {{
          $t('Thống kê AI')
        }}:
        <li>
          {{ $t('Cảm xúc') }}
          <ul class="list-disc list-inside">
            <li>{{ $t('Thích') }}:</li>
            <li>{{ $t('Vui vẻ') }}:</li>
            <li>{{ $t('Buồn') }}:</li>
            <li>{{ $t('Giận dữ') }}:</li>
          </ul>
        </li>
        <li>
          {{ $t('CTA') }}
          <ul class="list-disc list-inside">
            <li>{{ $t('Lên đơn') }}:</li>
            <li>{{ $t('Lập lịch') }}:</li>
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
import { computed } from 'vue'
import { composableService } from '@/views/ChatWarper/Chat/CenterContent/MessageList/PostTemplate/service'
import { DateHandle } from '@/utils/helper/DateHandle'

const { PostService } = composableService()

const $post_service = container.resolve(PostService)
const $date_handle = container.resolve(DateHandle)
const conversationStore = useConversationStore()

/**tên người tạo bài viết này */
const creator_name = computed(() =>
  $post_service.getCreatorName(conversationStore.select_conversation_post)
)
</script>
