<template>
  <el-container style="border: 1px solid #eee" id="index">
    <el-aside width="200px" style="background-color: rgb(238, 241, 246)">
      <el-menu :default-openeds="['1']" :router="true">
        <el-submenu index="1">
          <template slot="title"><i class="el-icon-message"></i>常用功能</template>
          <el-menu-item-group>
            <el-menu-item index="/book" key="1">书籍管理</el-menu-item>
          </el-menu-item-group>
        </el-submenu>
        <el-submenu index="1">
          <template slot="title"><i class="el-icon-message"></i>常用功能</template>
          <el-menu-item-group>
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
        <span>{{username}}</span>
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
        username: ''
      }
    },
    mounted() {
      debugger
      this.username = this.$route.params.username
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
