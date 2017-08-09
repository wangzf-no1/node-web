import Vue from 'vue'
import VueResource from 'vue-resource'
import VueRouter from 'vue-router'

import Login from './component/Login.vue'
import InitSite from './component/InitSite.vue'
import Admin from './component/Admin.vue'

import Setting from './component/Setting'

import Content from './component/Content'
import Home from './component/Home'
import Common from './component/Common'


Vue.use(VueResource)
Vue.use(VueRouter)


const router = new VueRouter({
  base: '/admin',
  mode: 'history',
  routes: [{
    path: '/login',
    component: Login,
  }, {
    path: '/init',
    component: InitSite,
  }, {
    path: '/',
    component: Admin,
    children: [
      
      //内容管理
			{ path: '/content', name: 'content', component: Content },
      //首页管理
			{ path: '/home', name: 'home', component: Home },
      //公共信息
			{ path: '/common', name: 'common', component: Common },
      

			{ path: '/setting', name: 'setting', component: Setting },
      { path: '', name: 'setting', component: Setting }
    ]
  }]
})

new Vue({
	router
}).$mount('#root')
