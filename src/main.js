import { createApp } from 'vue'
import { VueFire, VueFireFirestoreOptionsAPI } from 'vuefire'
import App from './App.vue'
import router from './router'

import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

import firebase from 'firebase/app';
import 'firebase/firestore';

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

const firebaseConfig = {
  apiKey: "AIzaSyD1QN8dPkRkBO8qYEg_vVuQtqFLcC2JX2w",
  authDomain: "inzynierka-293f9.firebaseapp.com",
  projectId: "inzynierka-293f9",
  storageBucket: "inzynierka-293f9.appspot.com",
  messagingSenderId: "352226401841",
  appId: "1:352226401841:web:0b9ed6a0882ad8bd973f10",
  measurementId: "G-9Y8RZE5YQW"
};

firebase.initializeApp(firebaseConfig);
export const db = firebase.firestore();



/* 
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD1QN8dPkRkBO8qYEg_vVuQtqFLcC2JX2w",
  authDomain: "inzynierka-293f9.firebaseapp.com",
  projectId: "inzynierka-293f9",
  storageBucket: "inzynierka-293f9.appspot.com",
  messagingSenderId: "352226401841",
  appId: "1:352226401841:web:0b9ed6a0882ad8bd973f10",
  measurementId: "G-9Y8RZE5YQW"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
*/