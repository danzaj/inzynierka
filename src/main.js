import { createApp } from 'vue'
import { VueFire, VueFireFirestoreOptionsAPI } from 'vuefire'
import App from './App.vue'
import router from './router'

createApp(App).use(router).mount('#app')

const app = createApp(App)
app.use(VueFire, {
  // ...
  modules: [
    VueFireFirestoreOptionsAPI(),
  ],
})