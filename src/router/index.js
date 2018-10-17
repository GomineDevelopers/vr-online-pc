import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/pages/login'
import Index from '@/pages/index'
import Doctor from '@/pages/doctor/doctor'
import MiniClass from '@/pages/miniclass/miniClass'
import Tag from '@/pages/tag/tag'
import DataBaseList from '@/pages/database/databaseList'
import DataBaseAdd from '@/pages/database/databaseAdd'
import ProblemList from '@/pages/problem/problemlist'
import WeChatScan from '@/pages/wechat/wechatscan'
import QRcode from '@/pages/wechat/QRcode'
import demo01 from '@/pages/demo/demo01'
import demo02 from '@/pages/demo/demo02'
import demo03 from '@/pages/demo/demo03'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Login',
      component: Login
    },
    {
      path: '/index/',
      component: Index,
      redirect: '/index/doctor',
      children: [
        {
          path: 'doctor',
          component: Doctor,
          name:'Doctor',
          meta:{
            requiresAuth:true
          }
        },
        {
          path: 'miniclass',
          component: MiniClass,
          name:'MiniClass',
          meta:{
            requiresAuth:true
          }
        },
        {
          path: 'tag',
          component: Tag,
          name:'Tag',
          meta:{
            requiresAuth:true
          }
        },
        {
          path: 'wechatscan',
          component: WeChatScan,
          name:'WeChatScan',
          meta:{
            requiresAuth:true
          }
        },
        {
          path: 'QRcode',
          component: QRcode,
          name:'QRcode',
          meta:{
            requiresAuth:true
          }
        },
        {
          path: 'databaselist',
          component: DataBaseList,
          name:'DataBaseList',
          meta:{
            requiresAuth:true
          }
        },
        {
          path: 'databaseadd',
          component: DataBaseAdd,
          name:'DataBaseAdd',
          meta:{
            requiresAuth:true
          }
        },
        {
          path: 'problemlist',
          component: ProblemList,
          name:'ProblemList',
          meta:{
            requiresAuth:true
          }
        },
        {
          path: 'demo01',
          component: demo01,
          name:'demo01'
        },
        {
          path: 'demo02',
          component: demo02,
          name:'demo02'
        },
        {
          path: 'demo03',
          component: demo03,
          name:'demo03'
        }
      ]
    }
  ]
})
