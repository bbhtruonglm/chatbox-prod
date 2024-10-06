import basicSsl from '@vitejs/plugin-basic-ssl'
import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  /**
   * cấu hình cái này để deploy được chatbox vào một app next.js khác
   * - retion.ai -> app next.js
   * - retion.ai/chat -> chatbox
   */
  base: './chat', // path relative
  // base: '/', // path absolute 
  plugins: [
    vue(), 
    basicSsl()
  ],
  define: {
    npm_package_version: JSON.stringify(process.env.npm_package_version),
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      'vue-i18n': 'vue-i18n/dist/vue-i18n.cjs.js'
    }
  },
  server: {
    host: '0.0.0.0',
    port: 8000,
    https: true
  }
})
