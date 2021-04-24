<template>
  <div class=''>
    <!-- 顶部导航栏 -->
    <nav class="navbar navbar-light">
      <div class="container">
        <a class="navbar-brand" href="index.html">conduit</a>
        <ul class="nav navbar-nav pull-xs-right">
          <li class="nav-item">
            <!-- Add "active" class when you're on that page" -->
            <nuxt-link
              class="nav-link"
              to="/"
              exact
            >
              Home
            </nuxt-link>
          </li>
          <template v-if="user">
            <li class="nav-item">
              <nuxt-link
                class="nav-link"
                to="/editor"
              >
                <i class="ion-compose"></i>&nbsp;New Post
              </nuxt-link>
            </li>
            <li class="nav-item">

              <nuxt-link
                class="nav-link"
                to="/settings"
              >
                <i class="ion-gear-a"></i>&nbsp;Settings
              </nuxt-link>
            </li>
            <li class="nav-item">
              <nuxt-link
                class="nav-link"
                :to="{
                  name: 'profile',
                  params: {
                    username: user.username
                  }
                }"
              >
                <img
                  class="user-pic"
                  :src="user.image"
                >
                {{ user.username }}
              </nuxt-link>
            </li>
          </template>

          <template v-else>
          <li class="nav-item">
            <nuxt-link
              class="nav-link"
              to="/login"
            >
              Sign in
            </nuxt-link>
          </li>
          <li class="nav-item">
            <nuxt-link
              class="nav-link"
              to="/register"
            >
              Sign up
            </nuxt-link>
          </li>
          </template>
        </ul>
      </div>
    </nav>
    <!-- /顶部导航栏 -->

    <!-- 子路由 -->
    <nuxt-child/>
    <!-- /子路由 -->

    <!-- 底部 -->
    <footer>
      <div class="container">
        <a href="/" class="logo-font">conduit</a>
        <span class="attribution">
          An interactive learning project from <a href="https://thinkster.io">Thinkster</a>. Code &amp; design licensed under MIT.
        </span>
      </div>
    </footer>
    <!-- /底部 -->

  </div>
</template>

<script>
import { mapState } from 'vuex'


export default {
  name: 'LayoutIndex',
  components: {},
  props: {},
  data() {
  //这里存放数据
    return {

  };
  },
  //监听属性 类似于 data 概念
  computed: {
    ...mapState(['user'])
  },
  //监控data中的数据变化
  watch: {},
  //生命周期 - 创建完成（可以访问当前 this 实例）
  created() {

  },
  //生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {

  },
  //方法集合
  methods: {

  },
  //beforeCreate() {}, //生命周期 - 创建之前
  //beforeMount() {}, //生命周期 - 挂载之前
  //beforeUpdate() {}, //生命周期 - 更新之前
  //updated() {}, //生命周期 - 更新之后
  //beforeDestroy() {}, //生命周期 - 销毁之前
  //destroyed() {}, //生命周期 - 销毁完成
  //activated() {}, //如果页面有keep-alive缓存功能，这个函数会触发
}
</script>
<style scoped></style>