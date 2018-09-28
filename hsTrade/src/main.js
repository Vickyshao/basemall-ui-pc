import 'babel-polyfill'
import Vue from 'vue'
import App from './App'
import router from './router/'
import store from './store'
import './ui'

import 'jquery'

import "../src/components/chat/js/init.js"
import filter from './filter'
import directive from './directive'
import tools from './tools'
import $ajax from './ajax'
Vue.prototype.$ajax = new $ajax()

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App),
  created(){
    window._that=this
    this.$ajax.V=this
  }
}).$mount('#app')
