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
            <li>That email is already taken</li>
          </ul>
          <!-- prevent 阻止默认行为 -->
          <form @submit.prevent="onSubmit">
            <fieldset v-if="!isLogin" class="form-group">
              <input class="form-control form-control-lg" type="text" placeholder="Your Name">
            </fieldset>
            <fieldset class="form-group">
              <input v-model="user.email" class="form-control form-control-lg" type="text" placeholder="Email">
            </fieldset>
            <fieldset class="form-group">
              <input v-model="user.password" class="form-control form-control-lg" type="password" placeholder="Password">
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

import request from '@/utils/request'

export default {
  name: 'LoginIndex',
  components: {},
  props: {},
  data() {
  //这里存放数据
    return {
      user: {
        email:'',
        password:'',
      }
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
      // 提交表单请求登录
      const { data } = await request({
        method: 'POST',
        url: '/api/users/login',
        data: {
          user: this.user
        }
      })
      console.log(data)
      // TODO 保存用户的登录状态

      // 跳转到首页
      this.$router.push("/")
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