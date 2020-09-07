<template>
  <el-container style="border: 1px solid #eee" id="login">
    <el-header>欢迎使用巢立方系统</el-header>
    <el-main>
      <el-form ref="form" :model="form" label-width="80px" >
        <el-form-item label="用户名">
          <el-input v-model="form.username"></el-input>
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="form.password"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onLogin">登录</el-button>
          <el-button type="primary" @click="onRegister">注册</el-button>
        </el-form-item>
      </el-form>
    </el-main>
    <el-footer>巢立方幼儿园提供技术支持</el-footer>
  </el-container>

</template>

<script>
  import axios from 'axios'
  export default {
    data() {
      return {
        form: {
          username: '',
          password: ''
        }
      }
    },
    methods: {
      onLogin() {
        const that = this
        axios.post("/api/user/login",that.form)
          .then(res => {
            if (res.data.result === 'ok') {
              that.$message({
                message: '登录成功',
                type: 'success'
              })
              localStorage.setItem("token",res.data.data)
              that.$router.push({ path: '/index', params: that.form.username})
            }else if(res.data.result === 'not_ok') {
              that.$message.error(res.data.message)
            }
          })
          .catch(error => console.log(error))
      },
      onRegister() {
        console.log('开发中!');
      }
    }
  }
</script>

<style scoped>
  /**让布局撑满整个屏幕**/
  #login {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }

  .el-header, .el-footer {
    background-color: #B3C0D1;
    color: #333;
    text-align: center;
    line-height: 60px;
  }

  .el-aside {
    background-color: #D3DCE6;
    color: #333;
    text-align: center;
    line-height: 200px;
  }

  .el-main {
    background-color: #E9EEF3;
    color: #333;
    text-align: center;
    line-height: 160px;
  }

  body > .el-container {
    margin-bottom: 40px;
  }

  .el-container:nth-child(5) .el-aside,
  .el-container:nth-child(6) .el-aside {
    line-height: 260px;
  }

  .el-container:nth-child(7) .el-aside {
    line-height: 320px;
  }
</style>
