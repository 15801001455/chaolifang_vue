<template>
  <div id="app">
    <!-- 我的理解 router.js默认配置路由index 组件Index.vue是首次填充在这个router-view里面 -->
      <router-view></router-view>
  </div>
</template>
<script>
  /** update jyc 这个watch主要是为了当第一个界面过长的时候跳转到第二个界面显示不正常  **/
  export default {
    name: 'App',
    watch: {
      '$route': function(to,from){
        document.body.scrollTop = 0
        document.documentElement.scrollTop = 0
      }
    }
  };
</script>
<style>

</style>
