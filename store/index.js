const cookieparser = process.server ? require('cookieparser') : undefined

// 在啊服务端渲染期间运行的都是同一个实例
// 为了防止数据冲突, 务必要把 state 定义成一个函数, 返回数据对象
export const state = () => {
  return {
    // 当前登录用户的登录状态
    user: null
  }
}

export const mutations = {
  setUser (state, data) {
    state.user = data
  },
  getUser (state) {
    return state.user
  },
  delUser (state) {
    state.user = null
    // state.user = {
    //   bio: '',
    //   createdAt: '',
    //   email: '',
    //   id: '',
    //   image: '',
    //   token: '',
    //   updateAt: '',
    //   username: '',
    // }
  }
}


export const actions = {
  // nuxtServerInit 是一个特殊的 action 方法
  // 这个 action 会在服务端渲染期间自动弄个调用
  // 作用: 初始化容器数据, 传递数据给客户端使用
  nuxtServerInit ({ commit }, { req }) {
    // console.log("nuxtServerInit")
    let user = null

    // 如果请求头中有 cookie
    if (req.headers.cookie) {
      // 使用 cookieparser 把 cookie 字符串转为 JavaScript 对象
      const parsed = cookieparser.parse(req.headers.cookie)
      try {
        user = JSON.parse(parsed.user)
      } catch (err) {
        // No valid cookie found
      }
    }

    // 提交 mutation 修改 state 状态
    commit('setUser', user)
  }
}