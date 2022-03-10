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
        <td class="text-start">{{ item.id }}</td>
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
              詳情
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
  <!-- DelAlertModal -->
  <DelAlertModal ref="delAlertModal" :temp-order="tempOrder" :alert-modal-status="alertModalStatus"
  @get-orders="getOrders"></DelAlertModal>
</template>

<script>
import OrderModal from '@/components/OrderModal.vue'
import Pagination from '@/components/Pagination.vue'
import DelAlertModal from '@/components/DelAlertModal.vue'

export default {
  data () {
    return {
      orders: [],
      pagination: {},
      tempOrder: {},
      alertModalStatus: '',
      createTime: ''
    }
  },
  components: {
    OrderModal,
    Pagination,
    DelAlertModal
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
      // 將時間格式從 YYYY-MM-DD 轉換成 Unix 格式
      // Math.floor() 取小於數值的最大整數
      this.tempOrder.create_at = Math.floor(new Date(this.tempOrder.create_at) / 1000)

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
        this.$refs.delAlertModal.openDelAlertModal()
        this.alertModalStatus = modalStatus
      }
    }
  },
  watch: {
    orders () {
      this.orders.forEach(item => {
        // 將時間格式改為 YYYY-MM-DD
        item.create_at = new Date(item.create_at * 1000).toISOString().split('T')[0]
      })
    }
  },
  mounted () {
    this.getOrders()
  }
}
</script>
