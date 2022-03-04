import { createApp } from 'vue'
// axios / VueAxios
import axios from 'axios'
import VueAxios from 'vue-axios'

// material-icons
import 'material-icons/iconfont/material-icons.css'

// Bootstrap
import 'bootstrap'

import App from './App.vue'
import router from './router'

const app = createApp(App)
app.use(VueAxios, axios)
app.use(router)
app.mount('#app')
