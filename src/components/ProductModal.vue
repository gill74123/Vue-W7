<template>
  <div
    id="productModal"
    ref="productModal"
    class="modal fade"
    aria-labelledby="productModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-xl">
      <div class="modal-content border-0">
        <div class="modal-header bg-dark text-white">
          <h5 id="productModalLabel" class="modal-title">
            <span>新增產品</span>
          </h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <div class="row">
            <div class="col-sm-4">
              <div class="mb-2">
                <div class="mb-3">
                  <label for="imageUrl" class="form-label">輸入圖片網址</label>
                  <div class="input-group">
                    <input
                      type="text"
                      class="form-control"
                      placeholder="請輸入圖片連結"
                      ref="imageUrl"
                    />
                    <button
                      type="button"
                      class="btn btn-outline-secondary"
                      @click="imageUpload('imageUrl')"
                    >
                      上傳圖片
                    </button>
                  </div>
                </div>
                <img class="img-fluid" :src="tempProduct.imageUrl" alt="" />
              </div>
              <div class="mb-3">
                <label for="imageUrl" class="form-label">上傳檔案</label>
                <div class="input-group">
                  <input
                    class="form-control"
                    type="file"
                    id="fileInput"
                    ref="fileInput"
                  />
                  <button
                    type="button"
                    class="btn btn-outline-secondary"
                    @click="imageUpload"
                  >
                    上傳圖片
                  </button>
                </div>
                <template
                  v-for="(image, index) in tempProduct.imagesUrl"
                  :key="image">
                  <div class="position-relative">
                    <a href="#" @click.prevent="imageDelete(index)">
                      <span class="material-icons-outlined position-absolute top-0 start-100 translate-middle removeCircle">remove_circle_outline</span>
                    </a>
                    <img class="img-fluid mb-2" :src="image" alt="" />
                  </div>
                </template>
              </div>
            </div>
            <div class="col-sm-8">
              <div class="mb-3">
                <label for="title" class="form-label">標題</label>
                <input
                  id="title"
                  type="text"
                  class="form-control"
                  placeholder="請輸入標題"
                  v-model="tempProduct.title"
                />
              </div>

              <div class="row">
                <div class="mb-3 col-md-6">
                  <label for="category" class="form-label">分類</label>
                  <input
                    id="category"
                    type="text"
                    class="form-control"
                    placeholder="請輸入分類"
                    v-model="tempProduct.category"
                  />
                </div>
                <div class="mb-3 col-md-6">
                  <label for="price" class="form-label">單位</label>
                  <input
                    id="unit"
                    type="text"
                    class="form-control"
                    placeholder="請輸入單位"
                    v-model="tempProduct.unit"
                  />
                </div>
              </div>

              <div class="row">
                <div class="mb-3 col-md-6">
                  <label for="origin_price" class="form-label">原價</label>
                  <input
                    id="origin_price"
                    type="number"
                    min="0"
                    class="form-control"
                    placeholder="請輸入原價"
                    v-model="tempProduct.origin_price"
                  />
                </div>
                <div class="mb-3 col-md-6">
                  <label for="price" class="form-label">售價</label>
                  <input
                    id="price"
                    type="number"
                    min="0"
                    class="form-control"
                    placeholder="請輸入售價"
                    v-model="tempProduct.price"
                  />
                </div>
              </div>
              <hr />
              <div class="mb-3">
                <label for="description" class="form-label">產品描述</label>
                <textarea
                  id="description"
                  type="text"
                  class="form-control"
                  placeholder="請輸入產品描述"
                  v-model="tempProduct.description"
                >
                </textarea>
              </div>
              <div class="mb-3">
                <label for="content" class="form-label">說明內容</label>
                <textarea
                  id="description"
                  type="text"
                  class="form-control"
                  placeholder="請輸入說明內容"
                  v-model="tempProduct.content"
                >
                </textarea>
              </div>
              <div class="d-flex mb-3">
                <div class="form-check me-3">
                  <input
                    id="is_enabled"
                    class="form-check-input"
                    type="checkbox"
                    v-model="tempProduct.is_enabled"
                    :true-value="1"
                    :false-value="0"
                  />
                  <label class="form-check-label" for="is_enabled"
                    >是否啟用</label
                  >
                </div>
                <div class="form-check">
                  <input
                    id="is_recommend"
                    class="form-check-input"
                    type="checkbox"
                    v-model="tempProduct.is_recommend"
                    :true-value="1"
                    :false-value="0"
                  />
                  <label class="form-check-label" for="is_recommend"
                    >店長推薦</label
                  >
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-outline-secondary"
            data-bs-dismiss="modal"
          >
            取消
          </button>
          <button
            type="button"
            class="btn btn-primary"
            @click="updateProduct(tempProduct.id)"
          >
            確認
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Modal from 'bootstrap/js/dist/modal'

export default {
  props: ['temp-product', 'is-new'],
  data () {
    return {
      productModal: '',
      fileInput: '',
      imageUrl: ''
    }
  },
  methods: {
    // 新增產品/更新編輯產品
    updateProduct (productId) {
      // Vue 在更新 DOM 的時候是非同步的，導致 ProductModal 拿到的 props 資料與父元件不一致
      // 所以使用 nextTick() 當 DOM 更新後才執行
      this.$nextTick(() => {
        let url = ''
        let httpMethod = ''

        if (this.isNew) {
          url = `${process.env.VUE_APP_URL}/api/${process.env.VUE_APP_PATH}/admin/product`
          httpMethod = 'post'
        } else {
          url = `${process.env.VUE_APP_URL}/api/${process.env.VUE_APP_PATH}/admin/product/${productId}`
          httpMethod = 'put'
        }
        this.$http[httpMethod](url, { data: this.tempProduct })
          .then((res) => {
            // 關閉 Modal
            this.closeProductModal()

            // 執行 取得產品列表
            this.$emit('get-products') // 此方法在外層所以要用 emit
          })
          .catch((err) => {
            console.dir(err.response)
          })
      })
    },
    // 圖片上傳
    imageUpload (imageUrl) {
      // 用網址新增圖片
      if (imageUrl === 'imageUrl') {
        this.tempProduct.imageUrl = this.imageUrl.value
        // 清空 input 欄位
        this.imageUrl.value = ''
        return
      }

      // 用檔案新增圖片
      const file = this.fileInput.files[0]
      // 將格式傳換成 formData
      const formData = new FormData()
      formData.append('file-to-upload', file)
      const url = `${process.env.VUE_APP_URL}/api/${process.env.VUE_APP_PATH}/admin/upload`
      this.$http.post(url, formData)
        .then((res) => {
          this.tempProduct.imagesUrl.push(res.data.imageUrl)
          // 清空 input 欄位
          this.fileInput.value = ''
        })
        .catch((err) => {
          console.log(err.response)
        })
    },
    // 圖片刪除
    imageDelete (index) {
      this.tempProduct.imagesUrl.splice(index, 1)
    },
    // 開啟 modal
    openProductModal () {
      this.productModal.show()
    },
    // 關閉 modal
    closeProductModal () {
      this.productModal.hide()
    }
  },
  mounted () {
    this.productModal = new Modal(this.$refs.productModal, { keyboard: false })
    this.fileInput = this.$refs.fileInput
    this.imageUrl = this.$refs.imageUrl
  }
}
</script>

<style lang="scss">
.removeCircle{
    color: rgb(212, 212, 212);
    &:hover{
        color: red
    }
}
</style>
