<!--  -->
<template>
  <div class="auth-page">
    <div class="container page">
      <div class="row">

        <div class="col-md-6 offset-md-3 col-xs-12">
          <h1 class="text-xs-center"> {{ isLogin ? 'Sign in' : 'Sign up' }} </h1>
          <p class="text-xs-center">
            <nuxt-link v-if="isLogin" to="/register">Need an account?</nuxt-link>
            <nuxt-link v-else to="/login">Have an account?</nuxt-link>
            <!-- <a href=""></a> -->
          </p>

          <ul class="error-messages">
            <template
              v-for="(messages, field) in errors"
            >
              <li
                v-for="(message, index) in messages"
                :key="index"
              >
                {{ field }} {{ message }}
              </li>
            </template>
          </ul>
          <!-- prevent 阻止默认行为 -->
          <form @submit.prevent="onSubmit">
            <fieldset v-if="!isLogin" class="form-group">
              <input v-model="user.username" class="form-control form-control-lg" type="text" placeholder="Your Name" required>
            </fieldset>
            <fieldset class="form-group">
              <input v-model="user.email" class="form-control form-control-lg" type="email" placeholder="Email" required>
            </fieldset>
            <fieldset class="form-group">
              <input v-model="user.password" class="form-control form-control-lg" type="password" placeholder="Password" required minlength="8">
            </fieldset>
            <button class="btn btn-lg btn-primary pull-xs-right">
              {{ isLogin ? 'Sign in' : 'Sign up' }}
            </button>
          </form>
        </div>

      </div>
    </div>
  </div>
</template>

<script>

import { login, register } from '@/api/user'

// 仅在客户端加载 js-cookie 包
const Cookie = process.client ? require('js-cookie') : undefined

export default {
  name: 'LoginIndex',
  middleware: 'notAuthenticated',
  components: {},
  props: {},
  data() {
  //这里存放数据
    return {
      user: {
        username: '',
        email:'roach57@163.com',
        password:'1234567890',
      },
      errors: {}, //错误信息
    };
  },
  //监听属性 类似于 data 概念
  computed: {
    isLogin () {
      return this.$route.name === 'login'
    }
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
    async onSubmit() {
      try {
        // 提交表单请求登录
        const { data } = this.isLogin
        ? await login({
            user: this.user
          })
        : await register({
            user: this.user
          })

        // 存储的用户信息
        // console.log(data)
        // TODO: 保存用户的登录状态
        this.$store.commit('setUser', data.user)
        Cookie.set('user', data.user)

        // 跳转到首页
        this.$router.push("/")
      } catch (err) {
        // console.dir(err)
        this.errors = err.response.data.errors
      }
    }
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