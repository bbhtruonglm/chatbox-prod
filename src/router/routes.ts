import PageNotFound from '@/views/404.vue'

import DeleteAccount from '@/views/DeleteAccount.vue'

import OAuth from '@/views/OAuth.vue'

import ChatShort from '@/views/ChatWarper.vue'

import Dashboard from '@/views/Dashboard.vue'
import SelectPage from '@/views/Dashboard/SelectPage.vue'
import SelectPlatform from '@/views/Dashboard/SelectPlatform.vue'
import Pricing from '@/views/Dashboard/Pricing.vue'
import Widget from '@/views/Dashboard/Widget.vue'
import Noti from '@/views/Dashboard/Noti.vue'
import Download from '@/views/Dashboard/Download.vue'
import User from '@/views/Dashboard/User.vue'

import Org from '@/views/Dashboard/Org.vue'
import OrgSetting from '@/views/Dashboard/Org/Setting.vue'
import OrgApp from '@/views/Dashboard/Org/App.vue'
import OrgApi from '@/views/Dashboard/Org/Api.vue'

import OrgPay from '@/views/Dashboard/Org/Pay.vue'
import OrgPayInfo from '@/views/Dashboard/Org/Pay/Info.vue'
import OrgPayReCharge from '@/views/Dashboard/Org/Pay/ReCharge.vue'

export const routes = [
  { path: '/', component: ChatShort },
  // { path: '/', redirect: '/oauth' },

  { path: '/oauth', component: OAuth },

  // { path: '/chat', component: ChatShort },
  { path: '/chat', redirect: '/' },

  {
    path: '/dashboard',
    redirect: '/dashboard/select-page',
    component: Dashboard,
    children: [
      { path: 'select-page', component: SelectPage },
      { path: 'select-platform', component: SelectPlatform },
      { path: 'pricing', component: Pricing },
      { path: 'widget', component: Widget },
      {
        path: 'org',
        redirect: '/dashboard/org/setting',
        component: Org,
        children: [
          { path: 'setting', component: OrgSetting },
          {
            path: 'pay',
            redirect: '/dashboard/org/pay/info',
            component: OrgPay,
            children: [
              { path: 'info', component: OrgPayInfo },
              { path: 'recharge', component: OrgPayReCharge },
            ],
          },
          { path: 'app', component: OrgApp },
          { path: 'api', component: OrgApi },
        ],
      },
      { path: 'noti', component: Noti },
      { path: 'download', component: Download },
      { path: 'user', component: User },
    ],
  },
  { path: '/delete-account', component: DeleteAccount },
  { path: '/404', component: PageNotFound },
  { path: '/:pathMatch(.*)*', name: 'NotFound', component: PageNotFound },
]
