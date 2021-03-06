import Vue from 'vue';
import App from './App.vue';

//引入公共的scss   注意：创建项目的时候必须用scss
import './assets/css/basic.scss';

import router from './router/router.js';
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
Vue.use(ElementUI)
//4、挂载路由

new Vue({
  el: '#app',
  router,
  render: h => h(App)
})


