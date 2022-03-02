<template>
  <h2>後台產品列表</h2>
  <div class="text-end my-4">
    <button class="btn btn-primary me-2" @click="openModal('new')">
      建立新產品
    </button>
    <button class="btn btn-secondary" @click="openModal('logout')">登出</button>
  </div>
  <table class="table">
    <thead>
      <tr class="table-light">
        <th scope="col">分類</th>
        <th scope="col" class="text-start">商品名稱</th>
        <th scope="col">原價</th>
        <th scope="col">售價</th>
        <th scope="col">推薦星等</th>
        <th scope="col" width="120">啟用狀態</th>
        <th scope="col">編輯/刪除</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="item in products" :key="item.id">
        <th scope="row">{{ item.category }}</th>
        <td class="text-start">{{ item.title }}</td>
        <td>{{ item.origin_price }}</td>
        <td>{{ item.price }}</td>
        <td>{{ item.starRankData }} 星</td>
        <td text-end>
          <div class="form-check form-switch">
            <input
              class="form-check-input"
              type="checkbox"
              role="switch"
              id="item.id"
              v-model="item.is_enabled"
              :true-value="1"
              :false-value="0"
            />
            <label
              class="form-check-label"
              for="item.id"
              :class="{
                'text-success': item.is_enabled,
                'text-danger': !item.is_enabled,
              }"
              >{{ item.is_enabled ? "上架" : "未上架" }}</label
            >
          </div>
        </td>
        <td>
          <div class="btn-group btn-group-sm">
            <button type="button" class="btn btn-primary">編輯</button>
            <button type="button" class="btn btn-outline-danger">刪除</button>
          </div>
        </td>
      </tr>
    </tbody>
  </table>

  <!-- ProductModal  -->
  <ProductModal ref="productModal"></ProductModal>
</template>

<script>
import ProductModal from '@/components/ProductModal.vue'

export default {
  data () {
    return {
      products: [],
      pagination: {}
    }
  },
  components: {
    ProductModal
  },
  methods: {
    // 取得產品列表
    getProducts (page = 1) { // 參數預設值
      // query 參數用?帶入網址
      const url = `${process.env.VUE_APP_URL}/api/${process.env.VUE_APP_PATH}/admin/products?page=${page}`
      this.$http.get(url)
        .then((res) => {
          this.products = res.data.products
          this.pagination = res.data.pagination// 取得分頁資訊
        })
        .catch((err) => {
          console.log(err.response)
        })
    }
  },
  mounted () {
    this.getProducts()
  }
}
</script>
