import axios from '../utils/http'
export default {
  deleteBook (params) {
    return axios.get("/api/book/deleteBook",{params})
  },
  addBook (params) {
    return axios.post("/api/book/addBook",params)
  },
  updateBook (params) {
    return axios.post("/api/book/updateBook",params)
  },
  getBookList (params) {
    return axios.post("/api/book/getBookList",params)
  },
  logout (params) {
    return axios.get("/api/user/logout",{params})
  },
  login (params) {
    return axios.post("/api/user/login",params)
  }
}
