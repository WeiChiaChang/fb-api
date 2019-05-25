import axios from 'axios'

const instance = axios.create({
  baseURL: 'http://localhost:3002'
  // baseURL: 'https://my-json-server.typicode.com/WeiChiaChang/fb-post'
})

export default instance
