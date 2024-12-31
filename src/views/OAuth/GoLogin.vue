<template>
  <div class="custom-description">
    <span>
      {{ $t('Bạn đã có tài khoản _', { name: commonStore.partner?.name }) }}
    </span>
    <div
      @click="$service_oauth.redirect('/oauth')"
      class="custom-link"
    >
      {{ $t('Đăng nhập') }}
      <ArrowRightIcon class="w-4 h-4 lucide lucide-arrow-right" />
    </div>
  </div>
  <small
    v-html="$t('Bằng việc tiếp tục, bạn đồng ý với _ và _ của chúng tôi')"
    class="text-xs text-slate-700"
  />
</template>
<script setup lang="ts">
import { useCommonStore } from '@/stores'
import { composableService } from './service'
import { container } from 'tsyringe'

import { ArrowRightIcon } from '@heroicons/vue/24/solid'

const commonStore = useCommonStore()

const { ServiceOAuth } = composableService()

const $service_oauth = container.resolve(ServiceOAuth)
</script>
<style scoped lang="scss">
@import './index.scss';
</style>
