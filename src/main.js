// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import VCharts from 'v-charts'
import App from './App'
import router from './router'
import axios from 'axios';
import qs from 'qs';
import JsonExcel from 'vue-json-excel'
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
Vue.component('downloadExcel',JsonExcel)
Vue.use(VCharts);

router.beforeEach((to, from, next) => {
  iView.LoadingBar.start();
  if (to.matched.some(record => record.meta.requiresAuth)) {
    let token = window.sessionStorage.getItem('token');
    axios('http://icampaign.com.cn/customers/vrOnlinePc/backend/admin/user/getinfo', {
      params: {}
    })
      .then(function (response) {
        let temp = {};
        window.sessionStorage.setItem("UserData_name",response.data.data.name);
      })
      .catch(function (error) {
        console.log(error);
      });
    if (token) {
      next();
    } else {
      next({name:'Login'});
    }

    if(to.name == 'WeChatScan'){
      axios('http://icampaign.com.cn/customers/vrOnlinePc/backend/admin/wxbot/scanState', {
        params: {
          bot_id:window.sessionStorage.getItem("QR_id")
        }
      })
        .then(function (response) {
         if(response.data.code == 200){
           next({name:'FriendsList'});
         }else{
           next();
         }
        })
        .catch(function (error) {
          console.log(error);
        });
    }
  } else {
    next(); // 确保一定要调用 next()
  }
});

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
