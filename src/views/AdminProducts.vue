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
        <th scope="col" width="150">是否推薦</th>
        <th scope="col" width="150">啟用狀態</th>
        <th scope="col">編輯/刪除</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="item in products" :key="item.id">
        <th scope="row">{{ item.category }}</th>
        <td class="text-start">{{ item.title }}</td>
        <td>{{ item.origin_price }}</td>
        <td>{{ item.price }}</td>
        <!-- <td>{{ item.starRankData }} {{ item.is_recommend}}星</td>
         -->
         <td class="text-center">
          <div class="form-check form-switch ps-3">
            <input
              class="form-check-input ms-0"
              type="checkbox"
              role="switch"
              id="item.id"
              v-model="item.is_recommend"
              :true-value="1"
              :false-value="0" @change="updateProduct(item)"
            />
            <label
              class="form-check-label"
              for="item.id"
              :class="{
                'text-success': item.is_recommend,
                'text-danger': !item.is_recommend,
              }"
              >{{ item.is_recommend ? "推薦" : "尚未" }}</label
            >
          </div>
        </td>
        <td class="text-center">
          <div class="form-check form-switch ps-3">
            <input
              class="form-check-input ms-0"
              type="checkbox"
              role="switch"
              id="item.id"
              v-model="item.is_enabled"
              :true-value="1"
              :false-value="0" @change="updateProduct(item)"
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
            <button type="button" class="btn btn-primary" @click="openModal('edit', item)">編輯</button>
            <button type="button" class="btn btn-outline-danger" :disabled="item.is_enabled" @click="openModal('delete', item)">刪除</button>
          </div>
        </td>
      </tr>
    </tbody>
  </table>

  <!-- ProductModal  -->
  <ProductModal ref="productModal" :temp-product="tempProduct" :is-new="isNew" @get-products="getProducts"></ProductModal>
  <!-- Pagination -->
  <Pagination :pages="pagination" @get-products="getProducts"></Pagination>
  <!-- AlertModal - 刪除&登出 -->
  <AlertModal ref="alertModal" :temp-product="tempProduct" :alert-modal-status="alertModalStatus"
            @get-products="getProducts"></AlertModal>
</template>

<script>
import ProductModal from '@/components/ProductModal.vue'
import Pagination from '@/components/Pagination.vue'
import AlertModal from '@/components/AlertModal.vue'

export default {
  data () {
    return {
      products: [],
      pagination: {},
      tempProduct: {
        imagesUrl: [],
        is_recommend: ''
      },
      isNew: true,
      alertModalStatus: ''
    }
  },
  components: {
    ProductModal,
    Pagination,
    AlertModal
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
    },
    // 開啟 Modal
    openModal (modalStatus, item) {
      if (modalStatus === 'new') {
        // 新增 - 清空選取產品內資料
        this.tempProduct = {
          imagesUrl: [],
          is_recommend: ''
        }

        // 點擊新增 btn 就把改成 true
        this.isNew = true

        // 開啟 modal (呼叫 ProductModal 的方法)
        this.$refs.productModal.openProductModal()
      } else if (modalStatus === 'edit') {
        // 編輯 - 拷貝點選的產品
        this.tempProduct = { ...item }

        // 先判斷是否有 imagesUrl 陣列，沒有得先加上
        if (this.tempProduct.imagesUrl === undefined) {
          this.tempProduct.imagesUrl = []
        }

        // 點擊編輯 btn 就把改成 false
        this.isNew = false

        // 開啟 modal (呼叫 ProductModal 的方法)
        this.$refs.productModal.openProductModal()
      } else if (modalStatus === 'delete') {
        // 刪除 - 拷貝點選的產品
        this.tempProduct = { ...item }

        this.alertModalStatus = modalStatus

        // 開啟 modal
        this.$refs.alertModal.openAlertModal()
      } else if (modalStatus === 'logout') {
        this.alertModalStatus = modalStatus

        // 開啟 modal
        this.$refs.alertModal.openAlertModal()
      }
    },
    updateProduct (item) {
      this.isNew = false
      this.tempProduct = { ...item }
      this.$refs.productModal.updateProduct(item.id)
    }
  },
  // 刪除
  mounted () {
    this.getProducts()
    // console.log(this.$refs)
  }
}
</script>
