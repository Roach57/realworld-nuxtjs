// 验证是否登陆的中间件

export default function ({ store, redirect }) {
  // authenticated
  // 如果用户没有登录就跳转到登录页
  if (store.state.user) {
    return redirect('/')
  }
}