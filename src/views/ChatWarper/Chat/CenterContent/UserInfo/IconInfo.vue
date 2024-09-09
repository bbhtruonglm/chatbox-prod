<template>
  <div class="flex items-center gap-2 flex-shrink-0 cursor-pointer">
    <PhoneIcon
      v-if="last_client_phone"
      v-tooltip="last_client_phone"
      class="w-3 h-3 -rotate-90 text-green-600"
    />
    <LocationIcon
      v-if="location"
      v-tooltip="location"
      class="w-3 h-3 text-purple-500"
    />
    <BirthDayCakeIcon
      v-if="birth_day"
      v-tooltip="birth_day"
      class="w-3 h-3 text-blue-500"
    />
    <EmailIcon
      v-if="last_client_email"
      v-tooltip="last_client_email"
      class="w-3 h-3 text-lime-500"
    />
    <div
      v-if="last_emotion && Emotion.isHighlight(last_emotion)"
      class="text-xs"
    >
      {{ Emotion.getIcon(last_emotion) }}
    </div>
  </div>
</template>
<script setup lang="ts">
import { useConversationStore } from '@/stores'
import { Emotion } from '@/utils/helper/emotion'
import { computed } from 'vue'

import PhoneIcon from '@/components/Icons/Phone.vue'
import LocationIcon from '@/components/Icons/Location.vue'
import BirthDayCakeIcon from '@/components/Icons/BirthDayCake.vue'
import EmailIcon from '@/components/Icons/Mail.vue'

const conversationStore = useConversationStore()

/**sdt cuối của khách */
const last_client_phone = computed(
  () => conversationStore.select_conversation?.client_phone
)
/**email cuối của khách */
const last_client_email = computed(
  () => conversationStore.select_conversation?.client_email
)
/**nơi ở hiện tại */
const location = computed(
  () => conversationStore.select_conversation?.client_bio?.fb_info?.current_city
)
/**ngày sinh */
const birth_day = computed(
  () => conversationStore.select_conversation?.client_bio?.fb_info?.birthday
)
/**cảm xúc cuối cùng */
const last_emotion = computed(
  () => conversationStore.select_conversation?.emotion
)
</script>
