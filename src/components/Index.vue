<template>
  <el-container style="border: 1px solid #eee" id="index">
    <el-aside width="200px" style="background-color: rgb(238, 241, 246)">
      <!-- default-active 只是默认先展示哪个菜单 跟router-link无关-->
      <el-menu default-active="12" :router="true">
        <el-submenu index="1">
          <template slot="title"><i class="el-icon-message"></i>常用功能</template>
          <el-menu-item-group>
            <!-- 这种方式先废弃了
            <router-link :to="{path:'/book'}"><el-menu-item index="12">书籍管理</el-menu-item></router-link>
            -->
            <!--这种写法可以不用写router-link了 但是el-menu上要加上router=true配置 现在的问题是点击数据管理后页面直接跳转，左侧啥菜单都没有了，可能要在路由表中配置
            子路由方式能解决 先试试 应该是解决了这个问题通过子路由 在router.js中配置的
            {
              path: '/index', component: Index, children: [
                {
                  path: '/book', component: Book
                }
              ]
            }
            -->
            <el-menu-item index="/book" key="1">书籍管理</el-menu-item>
          </el-menu-item-group>
        </el-submenu>
      </el-menu>
    </el-aside>

    <el-container>
      <el-header style="text-align: right; font-size: 25px">
        <el-dropdown>
          <i class="el-icon-setting" style="margin-right: 15px"></i>
          <el-dropdown-menu slot="dropdown">
            <!--el-dropdown-item的点击事件必须加@click.native 否则无效-->
            <el-dropdown-item @click.native="logout">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <span>李翠翠</span>
      </el-header>

      <el-main>
        <!-- 我的理解 router.js默认配置路由index 组件Index.vue是首次填充在这个router-view里面 -->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>


<style>
  #index {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }

  .el-header {
    background-color: #B3C0D1;
    color: #333;
    line-height: 30px;
  }

  .el-aside {
    height: 100vh;
    color: #B3C0D1;
  }
</style>

<script>
  import axios from 'axios'
  export default {
    data() {
      return {
        msg: '你好vue'
      }
    },
    methods: {
      logout() {
        const that = this
        console.log("退出系统")
        axios.get("/api/user/logout")
          .then(res => {
            if (res.data.result === 'ok') {
              that.$router.push({path: '/login'})
            } else if (res.data.result === 'not_ok') {
              that.$message.error(res.data.message)
            }
            localStorage.removeItem("token")
          }).catch(error => {
            localStorage.removeItem("token")
            console.log(error)
        })

      }
    }
  }
</script>
