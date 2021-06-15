import Vue from 'vue'
import './plugins/axios'
import App from './App.vue'
import router from './router'
import './assets/minireset.css'
import './assets/animate4.1.min.css'

Vue.config.productionTip = false

import { Swipe, SwipeItem  } from 'vant';

import "./assets/font/iconfont.css"

Vue.use(Swipe).use(SwipeItem);

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
