import { waterfall } from 'async'
import { createApp } from 'vue'
import App from '@/App.vue'

import { loadEnv } from '@/service/core/env'
import { loadApp } from '@/service/core/app'
import { loadLanguage } from '@/service/core/langugage'
import { loadDirective } from '@/service/core/directive'
import { loadRouter } from '@/service/core/router'

import type { CbError } from '@/service/interface/function'
import type { Env } from '@/service/interface/env'

import '@/assets/css/tailwind.css'

declare global {
    var $env: Env
    var $node_env: string
}

const APP = createApp(App)

waterfall([
    (cb: CbError) => loadEnv(cb),
    (cb: CbError) => loadRouter(APP, cb),
    (cb: CbError) => loadLanguage(APP, cb),
    (cb: CbError) => loadDirective(APP, cb),
    (cb: CbError) => loadApp(APP, cb),
], e => APP.mount('#app'))