import PageNotFound from '@/views/404.vue'

import OAuth from '@/views/OAuth.vue'

import Main from '@/views/Main.vue'

import Dashboard from '@/views/Main/Dashboard.vue'
import SelectPage from '@/views/Main/Dashboard/SelectPage.vue'
import SelectPlatform from '@/views/Main/Dashboard/SelectPlatform.vue'
import Pricing from '@/views/Main/Dashboard/Pricing.vue'
import Noti from '@/views/Main/Dashboard/Noti.vue'
import User from '@/views/Main/Dashboard/User.vue'

import Chat from '@/views/Main/Chat.vue'

export const routes = [
  { path: '/', redirect: '/oauth' },
  { path: '/oauth', component: OAuth },
  {
    path: '/main',
    redirect: '/main/dashboard',
    component: Main,
    children: [
      {
        path: 'dashboard',
        redirect: '/main/dashboard/select-page',
        component: Dashboard,
        children: [
          { path: 'select-page', component: SelectPage },
          { path: 'select-platform', component: SelectPlatform },
          { path: 'pricing', component: Pricing },
          { path: 'noti', component: Noti },
          { path: 'user', component: User },
        ]
      },
      { path: 'chat', component: Chat },
    ]
  },
  { path: '/404', component: PageNotFound },
  { path: '/:pathMatch(.*)*', name: 'NotFound', component: PageNotFound },
]