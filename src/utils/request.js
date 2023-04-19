/* 在此处我们根据axios依赖 来书写一个自己的自定义的axios依赖
由于axios实例本省就是一个Promise对象 所以我们自己创建的也是一个Promise对象 */
// import axios from 'axios'
// const request = axios.create({
//     baseURL:process.env.VUE_APP_BASE_API,
//     timeout:5000,
// })

// export default request

import axios from 'axios'
import router from "../router"
// axios.defaults.baseURL = '/api'
axios.defaults.withCredentials = true;

const request = axios.create({
  baseURL: 'http://localhost:8003/dlu',
  timeout:5000,
  withCredentials: true, // 跨域请求时发送Cookie
  crossDomain: true
})

// // 请求拦截器：用于拦截所有的api接口调用
// request.interceptors.request.use(config => {
//   // 如果访问的是'/user/login'接口, 则直接放行
//   if (config.url === '/user/login') {
//     return config
//   } else {
//     // 如果访问的不是'/user/login'接口，则取出token放到请求头中
//     let token = window.localStorage.getItem('token')
//     config.headers.token = token
//     return config
//   }
// }, error => {
//   Promise.reject('请求异常')
// })

// // 响应拦截器
// request.interceptors.response.use(resp => {
//   // 判断是否是/user/login接口的响应
//   if (resp.config.url === '/user/login') {
//     return resp
//   } else {
//     // 如果不是/user/login接口的响应
//     // 判断返回码是不是999
//     if (resp.data.code === 999 &&
//         router.history.current.path != '/login') {
//       router.replace('/login')
//       Promise.reject(resp.data.msg)
//     } else {
//       // 重新设置token
//       localStorage.setItem('token', resp.headers.token)
//       return resp
//     }
//   }
// }, error => {
//   Promise.reject('异常')
// })


export default request