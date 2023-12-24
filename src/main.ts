import { waterfall } from 'async'
import { createApp } from 'vue'
import App from '@/App.vue'
import {
    loadEnv, loadLib, loadApp, loadLanguage, loadDirective, loadRouter
} from '@/service/core'

import type { CbError } from '@/service/interface/function'
// import { CapacitorUpdater } from '@capgo/capacitor-updater';

// CapacitorUpdater.notifyAppReady();


import '@/assets/css/tailwind.css'

const APP = createApp(App)

waterfall([
    (cb: CbError) => loadEnv(cb),
    (cb: CbError) => loadLib(cb),
    (cb: CbError) => loadRouter(APP, cb),
    (cb: CbError) => loadLanguage(APP, cb),
    (cb: CbError) => loadDirective(APP, cb),
    (cb: CbError) => loadApp(APP, cb),
], e => APP.mount('#app'))