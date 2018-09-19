import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import Login from '@/pages/login'
import Index from '@/pages/index'
import Doctor from '@/pages/doctor/doctor'
import Tag from '@/pages/tag/tag'
import demo01 from '@/pages/demo/demo01'
import demo02 from '@/pages/demo/demo02'
import demo03 from '@/pages/demo/demo03'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'HelloWorld',
      component: HelloWorld
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/index/',
      component: Index,
      children: [
        {
          path: 'doctor',
          component: Doctor,
          name:'Doctor'
        },{
          path: 'tag',
          component: Tag,
          name:'Tag'
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
