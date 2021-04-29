<!--  -->
<template>
  <div class="editor-page">
    <div class="container page">
      <div class="row">

        <div class="col-md-10 offset-md-1 col-xs-12">
          <form>
            <fieldset>
              <fieldset class="form-group">
                  <input v-model="article.title" type="text" class="form-control form-control-lg" placeholder="Article Title">
              </fieldset>
              <fieldset class="form-group">
                  <input v-model="article.description" type="text" class="form-control" placeholder="What's this article about?">
              </fieldset>
              <fieldset class="form-group">
                  <textarea v-model="article.body" class="form-control" rows="8" placeholder="Write your article (in markdown)"></textarea>
              </fieldset>
              <fieldset class="form-group">
                  <input
                    type="text"
                    class="form-control"
                    placeholder="Enter tags"
                    v-model="newtag"
                    @keyup.enter="addTag"
                  >
                  <div class="tag-list">
                    <span
                      ng-repeat="tag in $ctrl.article.tagList"
                      class="tag-default tag-pill ng-binding ng-scope"
                      v-for="tag,index in article.tagList"
                      :key="index"
                    >
                      <i
                        class="ion-close-round"
                        @click="removeTag(index)"
                      ></i>{{ tag }}
                    </span>
              </div>
              </fieldset>
              <button
                class="btn btn-lg pull-xs-right btn-primary"
                type="button"
                @click="publishArticle"
              >
                  Publish Article
              </button>
            </fieldset>
          </form>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
import _ from 'lodash';
import { getArticle, createArticle, updateArticle } from '@/api/article'
const Cookie = process.client ? require('js-cookie') : undefined

export default {
  name: 'EditorIndex',

  // 在路由匹配组件渲染之前会先进行中间件处理
  middleware: 'authenticated',
  components: {},
  props: {},
  data() {
  //这里存放数据
    return {
      article: {
        author: {
          bio:'',
          following:'',
          image:'',
          username:'',
        },
        title:'',
        slug:'',
        body:'',
        ccreatedAt:'',
        updatedAt:'',
        tagList:[],
        description:'',
        favorited:'',
        favoritesCount:'',
      },
      newtag:'',
    };
  },
  async asyncData({ params }){
    if (_.has(params, 'slug')) {
      const { data } = await getArticle(params.slug)
      const { article }  = data
      return {
        article
      }
    }
  },
  //监听属性 类似于 data 概念
  computed: {
    isCreateArticle () {
      return this.$route.name === 'editor'
    }
  },
  //监控data中的数据变化
  watch: {},
  //生命周期 - 创建完成（可以访问当前 this 实例）
  created() {

  },
  //生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {
    const cookieUser = Cookie.getJSON('user')
    if (this.article.author.username != '' && cookieUser.username != this.article.author.username) {
      this.$router.push("/")
    }
  },
  //方法集合
  methods: {
    addTag(){
      this.article.tagList.push(this.newtag)
      this.newtag = ''
    },
    removeTag(index){
      this.article.tagList.splice(index,1)
    },
    async publishArticle(){
      const { data } = this.isCreateArticle
      ? await createArticle({
          article: {
            title: this.article.title,
            description: this.article.description,
            body: this.article.body,
            tagList: this.article.tagList,
          }
        })
      : await updateArticle(this.article.slug, {
          article: {
            title: this.article.title,
            description: this.article.description,
            body: this.article.body,
            tagList: this.article.tagList,
          }
        })

      // console.log(data.article.slug)
      this.$router.push(`/article/${data.article.slug}`)
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