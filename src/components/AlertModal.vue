<template>
  <div
    id="alertModal"
    ref="alertModal"
    class="modal fade"
    tabindex="-1"
    aria-labelledby="alertModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog">
      <div class="modal-content border-0">
        <div
          class="modal-header text-white bg-danger"
        >
          <h5 id="alertModalLabel" class="modal-title">
            <span v-if="alertModalStatus === 'productDelete'">刪除產品</span>
            <span v-else-if="alertModalStatus === 'orderDelete' || alertModalStatus === 'orderAllDelete'">刪除訂單</span>
          </h5>
          <button
            type="button"
            class="btn-close btn-close-white"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body text-start" v-if="alertModalStatus === 'productDelete'">
          是否刪除
          <strong class="text-danger">{{ tempProduct.title }}</strong> 商品(刪除後將無法恢復)。
        </div>
        <div class="modal-body text-start" v-else-if="alertModalStatus === 'orderDelete'">
          是否刪除
          <strong class="text-danger">{{ tempOrder.create_at }}</strong> 訂單(刪除後將無法恢復)。
        </div>
        <div class="modal-body text-start" v-else-if="alertModalStatus === 'orderAllDelete'">
          是否刪除
          <strong class="text-danger">全部</strong> 訂單(刪除後將無法恢復)。
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
            class="btn btn-danger"
            v-if="alertModalStatus === 'productDelete'"
            @click="delProduct(tempProduct.id)"
          >
            確認刪除
          </button>
          <button
            type="button"
            class="btn btn-danger"
            v-if="alertModalStatus === 'orderDelete' || alertModalStatus === 'orderAllDelete'"
            @click="delOrder(alertModalStatus, tempOrder.id)"
          >
            確認刪除
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Modal from 'bootstrap/js/dist/modal'

export default {
  props: ['alert-modal-status', 'temp-product', 'temp-order'],
  data () {
    return {
      alertModal: ''
    }
  },
  methods: {
    // 刪除產品
    delProduct (productId) {
      const url = `${process.env.VUE_APP_URL}/api/${process.env.VUE_APP_PATH}/admin/product/${productId}`

      this.$http.delete(url)
        .then((res) => {
          // 關閉 Modal
          this.closeAlertModal()

          // 執行 取得產品列表
          this.$emit('get-products') // 此方法在外層所以要用 emit
        })
        .catch((err) => {
          console.log(err.response)
        })
    },
    // 刪除訂單
    delOrder (modalStatus, orderId) {
      let url = `${process.env.VUE_APP_URL}/api/${process.env.VUE_APP_PATH}/admin/order/${orderId}`
      // 刪除全部訂單的 URL
      if (modalStatus === 'orderAllDelete') {
        url = `${process.env.VUE_APP_URL}/api/${process.env.VUE_APP_PATH}/admin/orders/all`
      }
      this.$http.delete(url)
        .then((res) => {
          // 關閉 Modal
          this.closeAlertModal()

          // 執行 取得產品列表
          this.$emit('get-orders') // 此方法在外層所以要用 emit
        })
        .catch((err) => {
          console.log(err.response)
        })
    },
    openAlertModal () {
      this.alertModal.show()
    },
    closeAlertModal () {
      this.alertModal.hide()
    }
  },
  mounted () {
    // 使用 new 建立 bootstrap modal，拿到實體 DOM 並賦予到變數上
    this.alertModal = new Modal(this.$refs.alertModal, { keyboard: false })
  }
}
</script>
