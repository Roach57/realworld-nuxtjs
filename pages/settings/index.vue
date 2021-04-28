<!--  -->
<template>
  <div class="settings-page">
    <div class="container page">
      <div class="row">

        <div class="col-md-6 offset-md-3 col-xs-12">
          <h1 class="text-xs-center">Your Settings</h1>

          <form @submit.prevent="updateUserInfo">
            <fieldset>
              <fieldset class="form-group">
                <input v-model="userinfo.image" class="form-control" type="text" placeholder="URL of profile picture">
              </fieldset>
              <fieldset class="form-group">
                <input v-model="userinfo.username" class="form-control form-control-lg" type="text" placeholder="Your Name">
              </fieldset>
              <fieldset class="form-group">
                <textarea v-model="userinfo.bio" class="form-control form-control-lg" rows="8" placeholder="Short bio about you"></textarea>
              </fieldset>
              <fieldset class="form-group">
                <input v-model="userinfo.email" class="form-control form-control-lg" type="text" placeholder="Email">
              </fieldset>
              <fieldset class="form-group">
                <input v-model="userinfo.password" class="form-control form-control-lg" type="password" placeholder="New Password">
              </fieldset>
              <template>{{ msg }}</template>
              <button class="btn btn-lg btn-primary pull-xs-right">Update Settings</button>
            </fieldset>
          </form>
          <hr>
          <button
            class="btn btn-outline-danger"
            @click="logOut()"
          >
          Or click here to logout.
        </button>
        </div>

      </div>
    </div>
  </div>

</template>

<script>
import { mapState } from 'vuex'
import { getUser, updateUser } from '@/api/user'
// 仅在客户端加载 js-cookie 包
const Cookie = process.client ? require('js-cookie') : undefined

export default {
  name: 'SettingsIndex',
  // 在路由匹配组件渲染之前会先进行中间件处理
  middleware: 'authenticated',
  components: {},
  props: {},
  data() {
  //这里存放数据
    return {
      userinfo: {
        image: '',
        username: '',
        bio: '',
        email: '',
        password: '',
      },
      msg: '',
    };
  },
  //监听属性 类似于 data 概念
  computed: {
    ...mapState(['user'])
  },
  //监控data中的数据变化
  watch: {
    user(newUser,oldUser){
      if ( newUser != null) {
        this.userinfo = newUser
      }
    }
  },
  //生命周期 - 创建完成（可以访问当前 this 实例）
  created() {
    this.initUserInfo()
  },
  //生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {

  },
  //方法集合
  methods: {
    logOut() {
      // 跳转到首页
      Cookie.remove('user')
      this.$store.commit('delUser')
      this.$router.push("/")
    },
    async updateUserInfo(){
      const { data } = await updateUser(this.userinfo)
      this.msg = "update successfully"
      this.$store.commit('setUser', data.user)
      Cookie.set('user', data.user)
    },
    async initUserInfo(){
      const { data } = await getUser()
      this.userinfo = data.user
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