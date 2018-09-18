import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import Index from '@/pages/index'
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
      path: '/index/',
      component: Index,
      children: [
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
