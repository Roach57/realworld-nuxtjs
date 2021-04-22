<!--  -->
<template>
<div class=''>
  <!-- 顶部导航栏 -->
  <nav class="navbar navbar-light">

  </nav>
  <!-- /顶部导航栏 -->

  <!-- 子路由 -->
  <nuxt-child/>
  <!-- /子路由 -->

  <!-- 底部 -->
        <div class="container">
        <a href="/" class="logo-font">conduit</a>
        <span class="attribution">
          An interactive learning project from <a href="https://thinkster.io">Thinkster</a>. Code &amp; design licensed under MIT.
        </span>
      </div>
  <!-- /底部 -->

</div>
</template>

<script>

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
  computed: {},
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