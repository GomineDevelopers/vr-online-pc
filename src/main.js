// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import axios from 'axios';
import {commonTools} from '../static/js/common';
import iView from 'iview'
import 'iview/dist/styles/iview.css'
import '../static/css/common.css'
// 引入图标样式
import '../static/icons/iconfont.css'

Vue.config.productionTip = false;
Vue.prototype.$http = axios;
Vue.prototype.$commonTools = commonTools;
Vue.use(iView);

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
