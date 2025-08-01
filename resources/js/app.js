import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import '../css/style.css' // tailwind

createApp(App).use(router).mount('#app')
