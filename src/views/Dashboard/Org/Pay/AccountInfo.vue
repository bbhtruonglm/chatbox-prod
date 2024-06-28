<template>
  <CardItem>
    <template #icon>
      <WalletIcon class="w-5 h-5" />
    </template>
    <template #title>
      {{ $t('v1.view.main.dashboard.org.pay.account') }}
    </template>
    <template #action>
      <span class="text-sm font-medium">
        {{ $t('v1.view.main.dashboard.org.pay.balance') }}
      </span>
    </template>
    <template #item>
      <div class="flex justify-between">
        <div class="text-xl font-semibold">CTCP Công nghệ Chatbot Việt Nam</div>
        <div class="text-2xl font-bold">
          {{ currency(40000000) }}
        </div>
      </div>
    </template>
  </CardItem>
</template>
<script setup lang="ts">
import CardItem from '@/components/Main/Dashboard/CardItem.vue'

import WalletIcon from '@/components/Icons/Wallet.vue'
import { currency } from '@/service/helper/format'
</script>
