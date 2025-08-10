import { createApp } from 'vue'
import App from './App.vue'
// 新增Element UI引入
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

createApp(App)
  .use(ElementPlus)  // 使用Element UI
  .mount('#app')