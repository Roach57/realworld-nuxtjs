// 基于 axios 封装的请求模块

import axios from 'axios'

const reqeust = axios.create({
  baseURL: 'https://conduit.productionready.io'
})

// 请求拦截器

// 响应拦截器

export default request