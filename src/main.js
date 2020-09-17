import Vue from 'vue';
import App from './App.vue';

//引入公共的scss   注意：创建项目的时候必须用scss
import './assets/css/basic.scss';
import axios from 'axios'
import router from './router/router.js';
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
Vue.use(ElementUI)
//每次向后端请求的时候header带上token信息
axios.interceptors.request.use(
  config => {
    if(localStorage.getItem("token")){//判断是否存在token，如果存在的话，则每个http header都加上token
      //config.headers.Authorization = `token ${localStorage.getItem("token")}`
      config.headers.token = `${localStorage.getItem("token")}`
    }
    return config;
  },
  err => {
    return Promise.reject(err)
  }
)

// 响应拦截
axios.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    debugger
    const {status} = error.response
    if (status === 400) { // 400 应该是没进入请求的方法，被拦截器拦截住了 这样要跳到登录界面
      localStorage.removeItem("token")
      router.push({path: '/login'})
      ElementUI.Message.error(error.response.data)
    }
  }
)

router.beforeEach(({name}, from, next) => {
  //debugger
  const token = localStorage.getItem('token')
  debugger
  if (token) {
    // 如果用户在login页面
    if (name === 'login') {
      next('/index');
    } else {
      next();
    }
  } else {
    if (name === 'login') {
      next();
    } else {
      next({name: 'login'});
    }
  }
});

new Vue({
  el: '#app',
  router,
  render: h => h(App)
})


