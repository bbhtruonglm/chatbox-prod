<template>
  <CardItem>
    <template #icon>
      <CogIcon class="w-5 h-5" />
    </template>
    <template #title>
      {{ $t('v1.view.main.dashboard.org.setting.title') }}
    </template>
    <template #item>
      <Toggle class_toggle="peer-checked:bg-black">
        {{ $t('v1.view.main.dashboard.org.setting.require_two_factor') }}
      </Toggle>
    </template>
  </CardItem>
</template>
<script setup lang="ts">
import CardItem from '@/components/Main/Dashboard/CardItem.vue'
import Toggle from '@/components/Toggle.vue'

import CogIcon from '@/components/Icons/Cog.vue'
</script>
