import { waterfall } from 'async'
import { createApp } from 'vue'
import App from '@/App.vue'
import {
    loadEnv, loadLib, loadApp, loadLanguage, loadDirective, loadRouter
} from '@/service/core'

import type { CbError } from '@/service/interface/function'
import type { Env } from '@/service/interface/env'
import type { IndexedDB } from '@/service/helper/indexedDB'

import '@/assets/css/tailwind.css'

declare global {
    var $env: Env
    var $node_env: string
    var $indexed_db: IndexedDB
    var Vue: any
    var check_ad_blocker: boolean
    var detect_ad_blocker: boolean
}

const APP = createApp(App)

waterfall([
    (cb: CbError) => loadEnv(cb),
    (cb: CbError) => loadLib(cb),
    (cb: CbError) => loadRouter(APP, cb),
    (cb: CbError) => loadLanguage(APP, cb),
    (cb: CbError) => loadDirective(APP, cb),
    (cb: CbError) => loadApp(APP, cb),
], e => APP.mount('#app'))