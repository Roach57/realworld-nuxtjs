
module.exports = {
  router: {
    // 自定义路由规则
    extendRoutes (routes, resolve) {
      // console.log(routes)
      // routes.push({
      //   name: 'custom',
      //   path: '*',
      //   component: resolve(__dirname, 'pages/404.vue')
      // })
      routes.splice(0)
      routes.push(...[
        {
          path: '/',
          component: resolve(__dirname, 'pages/layout/'),
          children: [{
            path: '', //默认子路由
            name: 'home',
            component: resolve(__dirname, 'pages/home/')
          }]
        }
      ])
    }
  }
}