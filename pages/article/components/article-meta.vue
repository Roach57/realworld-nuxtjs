<!--  -->
<template>
  <div class="article-meta">
    <nuxt-link
      :to="{
        name: 'profile',
        params: {
          username: article.author.username
        }
      }"
    >
      <img :src="article.author.image" />
    </nuxt-link>
    <div class="info">
      <nuxt-link
        class="author"
        :to="{
          name: 'profile',
          params: {
            username: article.author.username
          }
        }"
      >
        {{ article.author.username }}
      </nuxt-link>
      <span class="date">{{ article.createAt | date('MMM DD, YYYY') }}</span>
    </div>
    <span
      class="ng-scope"
      v-if="isMyArticle"
    >
      <nuxt-link
        class="btn btn-outline-secondary btn-sm"
        exact
        :to="{
          name: 'editor',
          params: {
            slug: article.slug
          }
        }"
      >
        <i class="ion-edit"></i>
        &nbsp;
        Edit Article
      </nuxt-link>
      &nbsp;&nbsp;
      <button
        class="btn btn-outline-danger btn-sm"
        @click="delArticle(article.slug)"
      >
        <i class="ion-trash-a"></i>
        &nbsp;
        Delete Article
      </button>
    </span>
    <span
      class="ng-scope"
      v-else
    >
      <button
        class="btn btn-sm btn-outline-secondary"
        :class="{
          active: article.author.following
        }"
        :disabled="article.followDisabled"
        @click="onFollow()"
      >
        <i class="ion-plus-round"></i>
        &nbsp;
        {{ showFollowMsg }} <span class="counter">{{ article.author.username }}</span>
      </button>
      &nbsp;&nbsp;
      <button
        class="btn btn-sm btn-outline-primary"
        :class="{
          active: article.favorited
        }"
        :disabled="article.favoriteDisabled"
        @click="onFavorited()"
      >
        <i class="ion-heart"></i>
        &nbsp;
        {{ showFavoritedMsg }} Article <span class="counter">({{ article.favoritesCount }})</span>
      </button>
    </span>
  </div>
</template>

<script>
import { deleteArticle } from '@/api/article'
import { mapState } from 'vuex'

export default {
  name: 'ArticleMeta',
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

    };
  },
  //监听属性 类似于 data 概念
  computed: {
    ...mapState(['user']),
    isMyArticle(){
      if (this.user){
      return this.user.username === this.article.author.username
      }
      return false
    },
    showFollowMsg(){
      return this.article.author.following ? "Unfollow":"Follow"
    },
    showFavoritedMsg(){
      return this.article.favorited ? "Unfavorite":"Favorite"
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
    async delArticle(slug){
      await deleteArticle(slug)
      this.$router.push("/")
    },
    async onFollow(){
      this.$emit('changeFollow')
    },
    async onFavorited(){
      this.$emit('changeFavorited')
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