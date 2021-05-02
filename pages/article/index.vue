<!--  -->
<template>
  <div class="article-page">

    <div class="banner">
      <div class="container">
        <h1>{{ article.title }}</h1>
        <article-meta :article="article" v-on:changeFollow="onFollow" v-on:changeFavorited="onFavorited" />
      </div>
    </div>

    <div class="container page">

      <div class="row article-content">
        <div class="col-md-12" v-html="article.body"></div>
      </div>
      <hr />

      <div class="article-actions">
        <article-meta :article="article" v-on:changeFollow="onFollow" v-on:changeFavorited="onFavorited" />
      </div>

      <div class="row">

        <div class="col-xs-12 col-md-8 offset-md-2">

        <article-comments :article="article" />

        </div>

      </div>

    </div>

  </div>
</template>

<script>
import { 
  getArticle,
  addFavorite,
  deleteFavorite,
} from '@/api/article'

import {

  followUser,
  unFollowUser,
} from '@/api/profiles'

import MarkdownIt from 'markdown-it'
import ArticleMeta from  './components/article-meta'
import ArticleComments from  './components/article-components'


export default {
  name: 'ArticleIndex',
  components: {
    ArticleMeta,
    ArticleComments
  },
  props: {},
  data() {
  //这里存放数据
    return {

    };
  },
  async asyncData({ params }){
    const { data } = await getArticle(params.slug)
    const { article }  = data
    const md = new MarkdownIt()
    article.body = md.render(article.body)
    article.followDisabled = false
    article.favoriteDisabled = false
    return {
      article
    }
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
  head (){
    return {
      title: `${this.article.title} - RealWorld`,
      meta: [
        {
          hid: 'description', name: 'description',
          content: this.article.description
        }
      ]
    }
  },
  //方法集合
  methods: {
    async onFollow(){
      this.article.followDisabled = true
      this.article.author.following
      ? await unFollowUser(this.article.author.username)
      : await followUser(this.article.author.username)
      this.article.author.following = !this.article.author.following
      this.article.followDisabled = false
    },
    async onFavorited(){
      this.article.favoriteDisabled = true
      if (this.article.favorited){
        await deleteFavorite(this.article.slug)
        this.article.favoritesCount += -1
      } else {
        await addFavorite(this.article.slug)
        this.article.favoritesCount += 1
      }
      this.article.favorited = !this.article.favorited
      this.article.favoriteDisabled = false
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