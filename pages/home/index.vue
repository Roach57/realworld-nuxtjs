<!--  -->
<template>
  <div class="home-page">

    <div class="banner">
      <div class="container">
        <h1 class="logo-font">Roch57</h1>
        <p>A place to share your knowledge.</p>
      </div>
    </div>

    <div class="container page">
      <div class="row">

        <div class="col-md-9">
          <div class="feed-toggle">
            <ul class="nav nav-pills outline-active">
              <li
                v-if="user"
                class="nav-item"
              >
                <nuxt-link
                  class="nav-link"
                  :class="{
                    active: tab === 'your_feed'
                  }"
                  exact
                  :to="{
                    name: 'home',
                    query: {
                      tab: 'your_feed'
                    }
                  }"
                >
                  Your Feed
                </nuxt-link>
              </li>
              <li class="nav-item">
                <nuxt-link
                  class="nav-link"
                  :class="{
                    active: tab === 'global_feed'
                  }"
                  exact
                  :to="{
                    name: 'home',
                    query: {
                      tab: 'global_feed'
                    }
                  }"
                >
                  Global Feed
                </nuxt-link>
              </li>
              <li
                v-if="tag"
                class="nav-item"
              >
                <nuxt-link
                  class="nav-link"
                  :class="{
                    active: tab === 'tag'
                  }"
                  exact
                  :to="{
                    name: 'home',
                    query: {
                      tab: 'tag',
                      tag
                    }
                  }"
                >
                  #{{ tag }}
                </nuxt-link>
              </li>
            </ul>
          </div>

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
            </nuxt-link>
          </div>
          <!-- 分页列表 -->
          <nav>
            <ul class="pagination">

              <!-- ngRepeat: pageNumber in $ctrl.pageRange($ctrl.totalPages) -->
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
                    name: 'home',
                    query: {
                      tab: $route.query.tab,
                      tag: $route.query.tag,
                      page: item,
                    }
                  }"
                >
                  {{ item }}
                </nuxt-link>
              </li>
              <!-- end ngRepeat: pageNumber in $ctrl.pageRange($ctrl.totalPages) -->
            </ul>
          </nav>
          <!-- /分页列表 -->
        </div>

        <div class="col-md-3">
          <div class="sidebar">
            <p>Popular Tags</p>

            <div class="tag-list">
              <nuxt-link
                :to="{
                  name: 'home',
                  query: {
                    tab: 'tag',
                    tag: item,
                  }
                }"
                class="tag-pill tag-default"
                v-for="item in tags"
                :key="item"
              >
                {{ item }}
              </nuxt-link>
            </div>
          </div>
        </div>

      </div>
    </div>

  </div>
</template>

<script>
import {
  getFeedArticles,
  getArticles,
  addFavorite,
  deleteFavorite,
} from '@/api/article'

import { getTags } from '@/api/tag'
import { mapState } from 'vuex'

export default {
  name: 'HomeIndex',
  components: {},
  props: {},
  data() {
  //这里存放数据
    return {

    };
  },
  async asyncData({ query, store }){
    const page = Number.parseInt(query.page || 1)
    const limit = 20
    const { tag } = query
    const tab = query.tab || 'global_feed'
    const loadArticles = store.state.user && tab === 'your_feed'
        ? getFeedArticles
        : getArticles
    // console.log(tagData)
    // console.log(data)
    const [ articleRes, tagRes ] = await Promise.all([
      loadArticles({
        limit,
        offset: (page - 1) * limit,
        tag
      }),
      getTags()
    ])

    const { articles, articlesCount } = articleRes.data
    const { tags } = tagRes.data

    // 添加状态, 防止短时间内重复点击, favoriteDisabled 设置未禁用状态
    articles.forEach(article => article.favoriteDisabled = false)
    // console.log(articles)

    return {
      articles, // 文章列表
      articlesCount,  // 文章总数
      tags, // 标签列表
      limit, // 每页大小
      page,  // 页码
      tag,  // 选项卡
      tab,  // 数据标签
    }
  },
  watchQuery: ['page', 'tag', 'tab'],
  //监听属性 类似于 data 概念
  computed: {
    ...mapState(['user']),
    // 获取总页码
    totalPage() {
      return Math.ceil(this.articlesCount / this.limit)
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