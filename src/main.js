import Vue from 'vue';
import App from './App.vue';
import './assets/css/basic.scss';
import router from './router/router.js';
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
Vue.use(ElementUI)
Vue.prototype.$message = ElementUI.Message  //这样界面上就可以直接用 this.$message 弹出各种消息了 main.js中的都是全局设置 

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


