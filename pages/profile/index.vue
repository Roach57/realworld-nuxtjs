<!--  -->
<template>
  <div class="profile-page">

    <div class="user-info">
      <div class="container">
        <div class="row">

          <div class="col-xs-12 col-md-10 offset-md-1">
            <img :src="profile.image" class="user-img" />
            <h4>{{ profile.username }}</h4>
            <p ng-bind="::$ctrl.profile.bio" class="ng-binding">{{ profile.bio }}</p>
            <nuxt-link
              ui-sref="app.settings"
              class="btn btn-sm btn-outline-secondary action-btn"
              v-if="isMyprofile"
              :to="{
                name: 'settings'
              }"
            >
              <i class="ion-gear-a"></i> Edit Profile Settings
            </nuxt-link>
            <button
              ui-sref="app.settings"
              class="btn btn-sm btn-outline-secondary action-btn"
              :disabled="followDisabled"
              v-else
              @click="onFollow()"
            >
              <i class="ion-plus-round"></i> {{ showFollowMsg }} {{ profile.username }}
            </button>
          </div>

        </div>
      </div>
    </div>

    <div class="container">
      <div class="row">
        <div class="col-xs-12 col-md-10 offset-md-1">

          <div class="articles-toggle">
            <ul class="nav nav-pills outline-active">
              <li
                v-if="profile"
                class="nav-item"
              >
                <nuxt-link
                  class="nav-link"
                  exact
                  :to="{
                    name: 'profile',
                    params: {
                      username: profile.username
                    }
                  }"
                >
                  My Articles
                </nuxt-link>
              </li>
              <li class="nav-item">
                <nuxt-link
                  class="nav-link"
                  :class="{
                    active: tab === 'favorited'
                  }"
                  exact
                  :to="{
                    name: 'profile',
                    params: {
                      username: profile.username
                    },
                    query: {
                      tab: 'favorited'
                    }
                  }"
                >
                  Favorited Articles
                </nuxt-link>
              </li>
            </ul>
          </div>

          <!-- 文章列表 -->

          <div
            class="article-preview"
            v-for="article in articles"
            :key="article.slug"
          >
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
                <span class="date">{{ article.createdAt | date('MMM DD, YYYY') }}</span>
              </div>
              <button
                class="btn btn-outline-primary btn-sm pull-xs-right"
                :class="{
                  active: article.favorited
                }"
                @click="onFavorite(article)"
                :disabled="article.favoriteDisabled"
              >
                <i class="ion-heart"></i>
                {{ article.favoritesCount }}
              </button>
            </div>
            <nuxt-link
              class="preview-link"
              :to="{
                name: 'article',
                params: {
                  slug: article.slug
                }
              }"
            >
              <h1>{{ article.title }}</h1>
              <p>{{ article.description }}</p>
              <span>Read more...</span>
              <ul class="tag-list">
                <li
                  class="tag-default tag-pill tag-outline ng-binding ng-scope"
                  ng-repeat="tag in $ctrl.article.tagList"
                  v-for="tag,index in article.tagList"
                  :key="index"
                >
                  {{ tag }}
                </li>
              </ul>
            </nuxt-link>
          </div>
          <!-- /文章列表 -->

          <!-- 分页列表 -->
          <nav>
            <ul class="pagination">
              <li
                class="page-item"
                :class="{
                  active: item === page
                }"
                v-for="item in totalPage"
                :key="item"
              >
                <nuxt-link
                  class="page-link"
                  :to="{
                    name: 'profile',
                    query: {
                      tab: $route.query.tab,
                      page: item,
                    }
                  }"
                >
                  {{ item }}
                </nuxt-link>
              </li>
            </ul>
          </nav>
          <!-- /分页列表 -->

        </div>

      </div>
    </div>

  </div>
</template>

<script>
import {
  getUserProfiles,
  followUser,
  unFollowUser
} from '@/api/profiles'

import {
  getMyArticles,
  getFavoritedArticles,
  addFavorite,
  deleteFavorite,
} from '@/api/article'

import { mapState } from 'vuex'

export default {
  name: 'UserProfile',
  // 在路由匹配组件渲染之前会先进行中间件处理
  middleware: 'authenticated',
  components: {},
  props: {},
  data() {
  //这里存放数据
    return {
      followDisabled: false
    };
  },
  watchQuery: ['page', 'tab'],
  async asyncData({ params, query }){
    const { data } = await getUserProfiles(params.username)
    const { profile } = data
    // console.log(data)
    const page = Number.parseInt(query.page || 1)
    const limit = 5
    const tab = Object.keys(query).length === 0 ? 'author': 'favorited'
    const articleRes = tab === 'favorited'
        ? await getFavoritedArticles({
          limit,
          offset: (page - 1) * limit,
          favorited: profile.username,
        })
        : await getMyArticles({
          limit,
          offset: (page - 1) * limit,
          author: profile.username,
        })

    const { articles, articlesCount } = articleRes.data

    // // 添加状态, 防止短时间内重复点击, favoriteDisabled 设置未禁用状态
    articles.forEach(article => article.favoriteDisabled = false)

    return {
      profile,
      articles, // 文章列表
      articlesCount,  // 文章总数
      limit, // 每页大小
      page,  // 页码
      tab,  // 数据标签
    }
  },
  //监听属性 类似于 data 概念
  computed: {
    ...mapState(['user']),
    totalPage() {
      return Math.ceil(this.articlesCount / this.limit)
    },
    isMyprofile(){
      return this.user.username === this.profile.username
    },
    showFollowMsg(){
      return this.profile.following ? "Unfollow":"Follow"
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
    async onFavorite (article) {
      // console.log(article)
      // 禁用点击
      article.favoriteDisabled = true
      if (article.favorited) {
        // 取消点赞
        await deleteFavorite(article.slug)
        article.favorited = false
        article.favoritesCount += -1
      } else {
        // 添加点赞
        await addFavorite(article.slug)
        article.favorited = true
        article.favoritesCount += 1
      }
      // 取消禁用, 恢复可点击
      article.favoriteDisabled = false
    },
    async onFollow(){
      this.followDisabled = true
      this.profile.following
      ? await unFollowUser(this.profile.username)
      : await followUser(this.profile.username)
      this.profile.following = !this.profile.following
      this.followDisabled = false
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