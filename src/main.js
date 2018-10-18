// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import axios from 'axios';
import qs from 'qs';
import {commonTools} from '../static/js/common';
import iView from 'iview'
import 'iview/dist/styles/iview.css'
import '../static/css/common.css'
// 引入图标样式
import '../static/icons/iconfont.css'

Vue.config.productionTip = false;
Vue.prototype.$http = axios;
Vue.prototype.$commonTools = commonTools;
Vue.prototype.$qs = qs;
Vue.use(iView);

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    let token = window.localStorage.getItem('token');
    axios('http://icampaign.com.cn/customers/vrOnlinePc/backend/admin/user/getinfo', {
      params: {}
    })
      .then(function (response) {
        let temp = {};
        window.localStorage.setItem("UserData_name",response.data.data.name);
      })
      .catch(function (error) {
        console.log(error);
      });
    if (token) {
      next();
    } else {
      next({name:'Login'});
    }
  } else {
    next(); // 确保一定要调用 next()
  }
})

require('promise.prototype.finally').shim();

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
