import { createApp } from 'vue'
import { VueFire, VueFireFirestoreOptionsAPI } from 'vuefire'
import App from './App.vue'
import router from './router'

import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

import axios from 'axios';

const vuetify = createVuetify({
    components,
    directives,
  })
  
const app = createApp(App)
app.use(vuetify)
app.use(router).mount('#app')

app.use(VueFire, {
  // ...
  modules: [
    VueFireFirestoreOptionsAPI(),
  ],
})

export default {
  data() {
    return {
      tasks: []
    }
  },
  created() {
    axios.get('http://localhost:3000/tasks')
      .then(response => {
        this.tasks = response.data;
      })
      .catch(error => {
        console.log(error);
      });
  }
}