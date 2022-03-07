<template>
  <h2>優惠券</h2>
  <div class="text-end my-4">
    <button class="btn btn-primary me-2" @click="openModal('new')">
      建立優惠券
    </button>
  </div>
  <table class="table">
    <thead>
      <tr class="table-light">
        <th scope="col">名稱</th>
        <th scope="col" class="text-start">優惠碼</th>
        <th scope="col">折扣</th>
        <th scope="col" width="150">截止日</th>
        <th scope="col" width="150">啟用狀態</th>
        <th scope="col">編輯/刪除</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="coupon in coupons" :key="coupon.id">
        <th>{{ coupon.title }}</th>
        <th>{{ coupon.code }}</th>
        <th>{{ coupon.percent }} %</th>
        <th>{{ coupon.due_date }}</th>
        <th>
          <div class="form-check form-switch p-0">
            <input
              class="form-check-input ms-0 me-2"
              type="checkbox"
              role="switch"
              id="coupon.id"
              v-model="coupon.is_enabled"
              :true-value="1"
              :false-value="0"
              @change="updateCoupon(coupon)"
            />
            <label
              class="form-check-label"
              for="coupon.id"
              :class="{
                'text-success': coupon.is_enabled,
                'text-danger': !coupon.is_enabled,
              }"
              >{{ coupon.is_enabled ? "啟用" : "未啟用" }}</label
            >
          </div>
        </th>
        <th>
          <div class="btn-group btn-group-sm">
            <button type="button" class="btn btn-outline-primary" @click="openModal('edit', coupon)">編輯</button>
            <button type="button" class="btn btn-outline-danger" :disabled="coupon.is_enabled"
            @click="openModal('couponDelete', coupon)">刪除</button>
          </div>
        </th>
      </tr>
    </tbody>
  </table>

  <!-- CouponModal -->
  <CouponModal ref="couponModal" :temp-coupon="tempCoupon" :is-new="isNew" @get-coupons="getCoupons"></CouponModal>
  <!-- Pagination -->
  <Pagination :pages="pagination" @emit-pages="getCoupons"></Pagination>
  <!-- DelAlertModal -->
  <DelAlertModal ref="delAlertModal" :temp-coupon="tempCoupon" :alert-modal-status="alertModalStatus"
  @get-coupons="getCoupons"></DelAlertModal>
</template>

<script>
import CouponModal from '@/components/CouponModal.vue'
import DelAlertModal from '@/components/DelAlertModal.vue'
import Pagination from '@/components/Pagination.vue'

export default {
  data () {
    return {
      coupons: {},
      tempCoupon: {
        is_enabled: 0
      },
      pagination: {},
      isNew: true,
      alertModalStatus: ''
    }
  },
  components: {
    CouponModal,
    DelAlertModal,
    Pagination
  },
  methods: {
    // 取得優惠券列表
    getCoupons (page = 1) {
      // query 參數用?帶入網址
      const url = `${process.env.VUE_APP_URL}/api/${process.env.VUE_APP_PATH}/admin/coupons?page=${page}`
      this.$http.get(url)
        .then((res) => {
          this.coupons = res.data.coupons
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
        this.tempCoupon = {
          is_enabled: 0
        }
        this.isNew = true
        this.$refs.couponModal.openCouponModal()
      } else if (modalStatus === 'edit') {
        // 編輯 - 拷貝點選的優惠券
        this.tempCoupon = { ...item }
        this.isNew = false
        this.$refs.couponModal.openCouponModal()
      } else if (modalStatus === 'couponDelete') {
        // 刪除
        this.tempCoupon = { ...item }
        this.alertModalStatus = modalStatus
        this.$refs.delAlertModal.openDelAlertModal()
      }
    },
    // 修改啟用狀態
    updateCoupon (item) {
      this.isNew = false
      this.tempCoupon = { ...item }
      this.$refs.couponModal.updateCoupon(item.id)
    }
  },
  watch: {
    coupons () {
      this.coupons.forEach(item => {
        // 將時間格式改為 YYYY-MM-DD
        item.due_date = new Date(item.due_date * 1000).toISOString().split('T')[0]
      })
    }
  },
  mounted () {
    this.getCoupons()
  }
}
</script>
