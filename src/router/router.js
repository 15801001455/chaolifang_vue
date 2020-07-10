import Vue from 'vue';

//配置路由
import VueRouter from 'vue-router';

Vue.use(VueRouter);


//1.创建组件
import Index from "../components/Index";
import Login from "../components/Login";
import Book from "../components/Book";


//2.配置路由   注意：名字

const routes = [
  {
    path: '/index', component: Index, children: [
      {
        path: '/book', component: Book
      }
    ]
  },
  {path: '/login', component: Login},
  {path: '*', redirect: '/login'}   /*默认跳转路由*/
]


//3.实例化VueRouter  注意：名字

const router = new VueRouter({
  mode: 'history',   /*hash模式改为history*/
  routes // （缩写）相当于 routes: routes
})


//5 <router-view></router-view> 放在 App.vue

export default router;

