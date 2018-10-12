import Vue from 'vue'
import vuex from 'vuex'
import axios from 'axios';
Vue.use(vuex);

/*import user from '../modules/user.js';*///引入某个store对象
export default new vuex.Store({
  state:{
    userData:{}
  },
  mutations:{
    getUserData(state){
      axios('http://icampaign.com.cn/customers/vrOnlinePc/backend/admin/user/getinfo', {
        params: {}
      })
        .then(function (response) {
           state.userData = response.data.data;
        })
        .catch(function (error) {
          console.log(error);
        });
    }
  }
})

/*export default new vuex.Store({
  modules: {
    user: user
  }
})*/
