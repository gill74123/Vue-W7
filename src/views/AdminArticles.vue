<template>
  <h2>貼文管理</h2>
  <div class="text-end my-4">
    <button class="btn btn-primary me-2" @click="openModal('new')">
      新增貼文
    </button>
  </div>
  <table class="table">
    <thead>
      <tr class="table-light">
        <th scope="col" width="130">建立時間</th>
        <th scope="col" width="300">標題</th>
        <th scope="col">作者</th>
        <th scope="col">標籤</th>
        <th scope="col" width="150">是否公開</th>
        <th scope="col">編輯/刪除</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="article in articles" :key="article.id">
        <th>{{ article.create_at }}</th>
        <th>{{ article.title }}</th>
        <th>{{ article.author }}</th>
        <th>
          <span v-for="(tag, index) in article.tag" :key="`tag+${index}`"
          class="border rounded-2 p-1 me-2">{{ tag }}</span>
        </th>
        <th>
          <div class="form-check form-switch p-0">
            <input
              class="form-check-input ms-0 me-2"
              type="checkbox"
              role="switch"
              id="article.id"
              v-model="article.isPublic"
              :true-value="true"
              :false-value="false"

            />
            <!--               @change="updateCoupon(coupon)" -->
            <label
              class="form-check-label"
              for="article.id"
              :class="{
                'text-success': article.isPublic,
                'text-danger': !article.isPublic,
              }"
              >{{ article.isPublic ? "公開" : "隱藏" }}</label
            >
          </div>
        </th>
        <th>
          <div class="btn-group btn-group-sm">
            <button
              type="button"
              class="btn btn-outline-primary"
              @click="openModal('edit', article)"
            >
              編輯
            </button>
            <button
              type="button"
              class="btn btn-outline-danger"
              @click="openModal('articleDelete', article)"
            >
              刪除
            </button>
          </div>
        </th>
      </tr>
    </tbody>
  </table>
  <!-- ArticleModal -->
  <ArticleModal ref="articleModal" :temp-article="tempArticle" :is-new="isNew" @get-article="getArticles"></ArticleModal>
  <!-- Pagination -->
  <Pagination :pages="pagination" @emit-pages="getArticles"></Pagination>
  <!-- DelAlertModal -->
  <DelAlertModal ref="delAlertModal" :temp-article="tempArticle"
  :alert-modal-status="alertModalStatus" @get-articles="getArticles"></DelAlertModal>
</template>

<script>
import ArticleModal from '@/components/ArticleModal.vue'
import Pagination from '@/components/Pagination.vue'
import DelAlertModal from '@/components/DelAlertModal.vue'

export default {
  data () {
    return {
      articles: {},
      tempArticle: {
        isPublic: true,
        tag: []
      },
      pagination: {},
      isNew: true,
      alertModalStatus: ''
    }
  },
  components: {
    ArticleModal,
    Pagination,
    DelAlertModal
  },
  methods: {
    // 取得貼文列表
    getArticles (page = 1) {
    // query 參數用?帶入網址
      const url = `${process.env.VUE_APP_URL}/api/${process.env.VUE_APP_PATH}/admin/articles?page=${page}`
      this.$http.get(url)
        .then((res) => {
          this.articles = res.data.articles
          this.pagination = res.data.pagination// 取得分頁資訊
        })
        .catch((err) => {
          console.log(err.response)
        })
    },
    // 開啟 modal
    openModal (modalStatus, item) {
      if (modalStatus === 'new') {
        // 新增 - 清空選取產品內資料
        this.tempArticle = {
          isPublic: true,
          tag: []
        }
        this.isNew = true
        this.$refs.articleModal.openArticleModal()
      } else if (modalStatus === 'edit') {
        // 編輯 - 拷貝點選的優惠券
        this.tempArticle = { ...item }
        this.isNew = false
        this.$refs.articleModal.openArticleModal()
      } else if (modalStatus === 'articleDelete') {
        // 刪除
        this.tempArticle = { ...item }
        this.alertModalStatus = modalStatus
        this.$refs.delAlertModal.openDelAlertModal()
      }
    }
  },
  watch: {
    articles () {
      this.articles.forEach(item => {
        // 將時間格式改為 YYYY-MM-DD
        item.create_at = new Date(item.create_at * 1000).toISOString().split('T')[0]
      })
    }
  },
  mounted () {
    this.getArticles()
  }
}
</script>
