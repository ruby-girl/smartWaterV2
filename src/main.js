import Vue from 'vue'

import Cookies from 'js-cookie'

import 'normalize.css/normalize.css' // a modern alternative to CSS resets

import Element from 'element-ui'
import './styles/element-variables.scss'

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'
import commonJS from "./utils/common.js"
import './icons' // icon
import './assets/icons/iconfont.css' //
import './permission' // permission control
import './utils/error-log' // error log
import VDistpicker from 'v-distpicker'
Vue.component('v-distpicker', VDistpicker)
import $ from 'jquery'

import * as filters from './filters' // global filters
import VueDND from 'awe-dnd'//拖动
//Vue.prototype.baseUrl='http://192.168.2.216:10002'
Vue.prototype.baseUrl='http://182.151.3.0:8090'
import axios from 'axios'
Vue.prototype.$http = axios

Vue.prototype.common = commonJS;
Vue.use(Element, {
  size: Cookies.get('size') || 'medium' // set element-ui default size
})
Vue.use(VueDND)

// register global utility filters
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
