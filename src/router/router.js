import Vue from 'vue';

//配置路由
import VueRouter from 'vue-router';
Vue.use(VueRouter);


//1.创建组件
import Home from '../components/Home.vue';
import News from '../components/News.vue';
import User from '../components/User.vue';
import Index from "../components/Index";
import BookManager from "../components/BookManager";


//2.配置路由   注意：名字

const routes = [
    { path: '/index', component: Index /*,children:[
        {
          path: '/bookManager',component: BookManager
        }
      ]*/},
    { path: '/bookManager', component: BookManager },
    { path: '/home', component: Home },
    { path: '*', redirect: '/index' }   /*默认跳转路由*/
]


//3.实例化VueRouter  注意：名字

const router = new VueRouter({
    mode: 'history',   /*hash模式改为history*/
    routes // （缩写）相当于 routes: routes
})


//5 <router-view></router-view> 放在 App.vue

export default router;

