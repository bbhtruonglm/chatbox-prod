import PageAccessDenied from '@/views/403.vue'
import PageNotFound from '@/views/404.vue'
import OAuth from '@/views/OAuth.vue'
import Dashboard from '@/views/Dashboard.vue'

export const routes = [
  { path: '/', redirect: '/oauth' },
  { path: '/oauth', component: OAuth },
  { path: '/dashboard', component: Dashboard },
  { path: '/403', component: PageAccessDenied },
  { path: '/404', component: PageNotFound },
  { path: '/:pathMatch(.*)*', name: 'NotFound', component: PageNotFound },
]