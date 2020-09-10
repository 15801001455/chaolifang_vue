import Vue from 'vue';
import App from './App.vue';

//引入公共的scss   注意：创建项目的时候必须用scss
import './assets/css/basic.scss';
import axios from 'axios'
import router from './router/router.js';
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import api from './api/api'
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

router.beforeEach(({name}, from, next) => {
  //debugger
  const token = localStorage.getItem('token')
  if (token) {
    //验证token的正确性,防止token篡改
    const params = {
      mytoken:token
    }
    api.validateToken(params)
      .then(res => {
        if (res.data.result === 'ok') {
          debugger
          if (name === 'login') {
            next('/index');
          } else {
            next()
          }
        }else {
          next({name: 'login'});
          localStorage.removeItem("token")
          that.$message.error(res.data.message)
        }
      })
      .catch(error => {
        localStorage.removeItem("token")
        console.log(error)
      })
    // 如果用户在login页面

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


