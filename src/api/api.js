import axios from 'axios'
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
  validateToken (params) {
    return axios.get("/api/user/validateToken",{params})
  }
}
