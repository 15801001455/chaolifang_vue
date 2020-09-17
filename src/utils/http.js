import axios from 'axios'
import { Loading, Message } from 'element-ui'
import router from '../router/router'
let loading
function startLoading() {
  loading = Loading.service({
    lock: true,
    text: '加载中....',
    background: 'rgba(0, 0, 0, 0.7)'
  })
}

function endLoading() {
  loading.close()
}

//每次向后端请求的时候header带上token信息
axios.interceptors.request.use(
  config => {
    startLoading()
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

// 响应拦截
axios.interceptors.response.use(
  (response) => {
    endLoading()
    return response
  },
  (error) => {
    debugger
    endLoading() // 这句不知道加的有没有用
    const {status} = error.response
    if (status === 400) { // 400 应该是没进入请求的方法，被拦截器拦截住了 这样要跳到登录界面
      localStorage.removeItem("token")
      router.push({path: '/login'})
      Message.error(error.response.data)
    }
    return Promise.reject(error)
  }
)

export default axios
