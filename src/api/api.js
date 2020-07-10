import axios from 'axios'
export default {
  deleteBook (params) {
    return axios.get("/api/mongo/book/deleteBook",{params})
  },
  addBook (params) {
    return axios.post("/api/mongo/book/addBook",params)
  },
  updateBook (params) {
    return axios.post("/api/mongo/book/updateBook",params)
  },
  getBookList (params) {
    return axios.post("/api/mongo/book/getBookList",params)
  }
}
