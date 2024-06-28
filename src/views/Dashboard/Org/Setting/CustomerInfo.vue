<template>
  <CardItem>
    <template #icon>
      <BriefCaseIcon class="w-5 h-5" />
    </template>
    <template #title>
      {{ $t('v1.view.main.dashboard.org.setting.customer_info.title') }}
    </template>
    <template #action>
      <button
        class="bg-blue-600 text-white py-1 px-4 rounded-md text-sm font-medium"
      >
        {{ $t('v1.common.change') }}
      </button>
    </template>
    <template #item>
      <div class="grid grid-cols-2 text-sm font-medium gap-2 pr-5">
        <Item
          :title="$t('v1.view.main.dashboard.org.setting.customer_info.customer_code')"
          value="BC-00017337"
        />
        <Item
          :title="$t('v1.view.main.dashboard.org.setting.customer_info.contract_code')"
          value="BBH-00017337/2009"
        />
        <Item
          :title="$t('v1.view.main.dashboard.org.setting.customer_info.company_name')"
          value="Chatbot Việt Nam"
        />
        <Item
          :title="$t('v1.view.main.dashboard.org.setting.customer_info.tax_code')"
          value="0303030303"
        />
        <Item
          :title="$t('v1.view.main.dashboard.org.setting.customer_info.representative')"
          value="Lê Văn A"
        />
        <Item
          :title="$t('v1.view.main.dashboard.org.setting.customer_info.address')"
          value="Biệt thự số 1, đường số abc, phường abc, quận abc, TP.HCM"
        />
        <Item
          :title="$t('v1.view.main.dashboard.org.setting.customer_info.phone')"
          value="0909090909"
        />
        <Item
          :title="$t('v1.view.main.dashboard.org.setting.customer_info.email')"
          value="hotro@botbanhang.vn"
        />
      </div>
      <ul class="list-disc list-inside text-xs text-slate-500">
        <li class="pl-4 -indent-4">
          {{ $t('v1.view.main.dashboard.org.setting.customer_info.guild_1') }}
        </li>
        <li class="pl-4 -indent-4">
          {{ $t('v1.view.main.dashboard.org.setting.customer_info.guild_2') }}
        </li>
      </ul>
    </template>
  </CardItem>
</template>
<script setup lang="ts">
import Item from '@/views/Dashboard/Org/Setting/CustomerInfo/Item.vue'

import CardItem from '@/components/Main/Dashboard/CardItem.vue'
import BriefCaseIcon from '@/components/Icons/BriefCase.vue'
</script>
