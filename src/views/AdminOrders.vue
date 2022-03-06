<template>
  <h2>訂單管理</h2>
  <div class="text-end my-4">
    <button class="btn btn-outline-danger me-2" @click="openModal('orderAllDelete')">
      清空全部訂單
    </button>
  </div>
  <table class="table">
    <thead>
      <tr class="table-light">
        <th scope="col">購買時間</th>
        <th scope="col" class="text-start">訂單編號</th>
        <th scope="col">Email</th>
        <th scope="col" width="200">購買品項</th>
        <th scope="col">應付金額</th>
        <th scope="col">訂單狀態</th>
        <th scope="col">編輯/刪除</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="item in orders" :key="item.id">
        <th scope="row">{{ item.create_at }}</th>
        <td class="text-start">{{ item.create_at }}</td>
        <td>{{ item.user.email }}</td>
        <td >
          <div v-for="(product) in item.products" :key="product.id">{{ product.product.title }}</div>
        </td>
        <td class="text-center">{{ item.total }}</td>
        <td>
          <div class="form-check form-switch p-0">
            <input
              class="form-check-input ms-0 me-2"
              type="checkbox"
              role="switch"
              id="item.id"
              v-model="item.is_paid"
              :true-value="true"
              :false-value="false"
              @change="updateOrder(item)"
            />
            <label
              class="form-check-label"
              for="item.id"
              :class="{
                'text-success': item.is_paid,
                'text-danger': !item.is_paid,
              }"
              >{{ item.is_paid ? "已付款" : "未付款" }}</label
            >
          </div>
        </td>
        <td>
          <div class="btn-group btn-group-sm">
            <button
              type="button"
              class="btn btn-outline-primary"
              @click="openModal('orderModal', item)"
            >
              訂單詳情
            </button>
            <button
              type="button"
              class="btn btn-outline-danger"
              @click="openModal('orderDelete', item)"
            >
              刪除
            </button>
          </div>
        </td>
      </tr>
    </tbody>
  </table>

  <!-- OrderModal -->
  <OrderModal ref="orderModal" :temp-order="tempOrder"></OrderModal>
  <!-- Pagination -->
  <Pagination :pages="pagination" @emit-pages="getOrders"></Pagination>
  <!-- AlertModal -->
  <AlertModal ref="alertModal" :temp-order="tempOrder" :alert-modal-status="alertModalStatus"
  @get-orders="getOrders"></AlertModal>
</template>

<script>
import OrderModal from '@/components/OrderModal.vue'
import Pagination from '@/components/Pagination.vue'
import AlertModal from '@/components/AlertModal.vue'

export default {
  data () {
    return {
      orders: [],
      pagination: {},
      tempOrder: {},
      alertModalStatus: ''
    }
  },
  components: {
    OrderModal,
    Pagination,
    AlertModal
  },
  methods: {
    // 取得訂單列表
    getOrders (page = 1) {
      // query 參數用?帶入網址
      const url = `${process.env.VUE_APP_URL}/api/${process.env.VUE_APP_PATH}/admin/orders?page=${page}`
      this.$http.get(url)
        .then((res) => {
          // console.log(res)
          this.orders = res.data.orders
          this.pagination = res.data.pagination// 取得分頁資訊
        })
        .catch((err) => {
          console.log(err.response)
        })
    },
    // 修改訂單
    updateOrder (item) {
      this.tempOrder = { ...item }
      const url = `${process.env.VUE_APP_URL}/api/${process.env.VUE_APP_PATH}/admin/order/${item.id}`
      this.$http.put(url, { data: this.tempOrder })
        .then((res) => {
          // console.log(res)
        })
        .catch((err) => {
          console.log(err.response)
        })
    },
    // 刪除全部訂單
    // 開啟 Modal
    openModal (modalStatus, item) {
      if (modalStatus === 'orderModal') { // OrderModal
        this.tempOrder = { ...item }
        this.$refs.orderModal.openOrderModal()
      } else if (modalStatus === 'orderDelete' || modalStatus === 'orderAllDelete') { // AlertModal
        this.tempOrder = { ...item }
        this.$refs.alertModal.openAlertModal()
        this.alertModalStatus = modalStatus
      }
    }
  },
  mounted () {
    this.getOrders()
  }
}
</script>
