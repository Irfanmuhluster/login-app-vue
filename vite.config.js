import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'
import laravel from 'laravel-vite-plugin'

export default defineConfig({
  plugins: [
    laravel({
      input: ['resources/js/app.js'],
      refresh: true,
    }),
    vue({
      template: {
        transformAssetUrls: {
          base: null,
          includeAbsolute: false,
        },
      },
    }),
  ],
  server: {
    proxy: {
      '/api': 'http://localhost:8000',
    },
    historyApiFallback: true,
  },
  resolve: {
    alias: {
      '@': '/resources/js',
    },
  },
})
