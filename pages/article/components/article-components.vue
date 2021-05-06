<!--  -->
<template>
  <div class=''>
    <form
      class="card comment-form"
      @submit.prevent="appendComment"
      v-if="islogin"
    >
      <div class="card-block">
        <textarea v-model="commentContext" class="form-control" placeholder="Write a comment..." rows="3"></textarea>
      </div>
      <div class="card-footer">
        <img
          class="comment-author-img"
          :src="user.image"
        />
        <button
          class="btn btn-sm btn-primary"
          :disabled="commentDisabled"
        >
        Post Comment
        </button>
      </div>
    </form>
    <p show-authed="false" style="display: inherit;"  v-else>
      <nuxt-link to="/login">Sign in</nuxt-link> or
      <nuxt-link to="/register">Sign up</nuxt-link> to add comments on this article.
    </p>
    <div
      class="card"
      v-for="comment in comments"
      :key="comment.id"
    >
      <div class="card-block">
        <p class="card-text">{{ comment.body }}</p>
      </div>
      <div class="card-footer">
        <nuxt-link
          class="comment-author"
          :to="{
            name: 'profile',
            params: {
              username: comment.author.username
            }
          }"
        >
          <img :src="comment.author.image" class="comment-author-img" />
        </nuxt-link>
        &nbsp;
        <nuxt-link
          class="comment-author"
          :to="{
            name: 'profile',
            params: {
              username: comment.author.username
            }
          }"
        >
          {{ comment.author.username }}
        </nuxt-link>
        <span class="date-posted">{{ comment.createAt | date('MMM DD, YYYY') }}</span>
        <span
          class="mod-options"
          v-if="comment.ismycomment"
        >
          <i class="ion-trash-a" @click="delComment(comment.id)"></i>
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import {
  getComments,
  addComment,
  deleteComment,
} from '@/api/article'
import { mapState } from 'vuex'

export default {
  name: 'ArticleComments',
  components: {},
  props: {
    article: {
      type: Object,
      required: true
    }
  },
  data() {
  //这里存放数据
    return {
      commentContext: '', //当前评论
      comments: [], //评论列表
      commentDisabled: false, //是否禁用点击
      islogin: false, // 是否登陆
    };
  },

  //监听属性 类似于 data 概念
  computed: {
    ...mapState(['user']),
  },
  //监控data中的数据变化
  watch: {},
  //生命周期 - 创建完成（可以访问当前 this 实例）
  created() {

  },
  //生命周期 - 挂载完成（可以访问DOM元素）
  async mounted() {
    const { data } = await getComments(this.article.slug)
    if (this.user){
      console.log(this.user)
      this.islogin = true
      data.comments.forEach(comment => comment.ismycomment = comment.author.username === this.user.username ? true : false)
      this.comments = data.comments
    }
  },
  //方法集合
  methods: {
    async appendComment(){
      this.commentDisabled = true
      const { data } = await addComment(this.article.slug, this.commentContext)
      this.commentContext = ''
      data.comment.ismycomment = true
      // console.log(data)
      this.comments.unshift(data.comment)
      this.commentDisabled = false
    },
    async delComment(id){
      // console.log("delCommnet", id)
      await deleteComment(this.article.slug, id)
      this.comments.every((item,index) => {
        // console.log(item)
        if(item.id === id){
          this.comments.splice(index,1)
          return false
        } else {
          return true
        }
      })

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