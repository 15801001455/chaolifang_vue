<template>
  <el-container style="border: 1px solid #eee" id="index">
    <el-aside width="200px" style="background-color: rgb(238, 241, 246)">
      <!-- default-active 只是默认先展示哪个菜单 跟router-link无关-->
      <el-menu default-active="12">
        <el-submenu index="1">
          <template slot="title"><i class="el-icon-message"></i>常用功能</template>
          <el-menu-item-group>
            <router-link :to="{path:'/bookManager'}"><el-menu-item index="12">书籍管理</el-menu-item></router-link>
          </el-menu-item-group>
        </el-submenu>
      </el-menu>
    </el-aside>

    <el-container>
      <el-header style="text-align: right; font-size: 25px">
        <el-dropdown>
          <i class="el-icon-setting" style="margin-right: 15px"></i>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>查看个人信息(敬请期待)</el-dropdown-item>
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
    height:100vh;
    color: #B3C0D1;
  }
</style>

<script>
  export default {
    data () {
      return {
        msg:'你好vue'
      }
    }
  }
</script>
