import PageNotFound from '@/views/404.vue'
import OAuth from '@/views/OAuth.vue'

import Dashboard from '@/views/Dashboard.vue'
import Page from '@/views/Dashboard/Page.vue'

import Chat from '@/views/Chat.vue'

export const routes = [
  { path: '/', redirect: '/oauth' },
  { path: '/oauth', component: OAuth },
  { 
    path: '/dashboard', 
    redirect: '/dashboard/page',
    component: Dashboard,
    children: [
      { path: 'page', component: Page }
    ] 
  },
  { path: '/chat', component: Chat },
  { path: '/404', component: PageNotFound },
  { path: '/:pathMatch(.*)*', name: 'NotFound', component: PageNotFound },
]