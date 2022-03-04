<template>
  <h2>訂單管理</h2>
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
          <div v-for="product in item.products" :key="product.id">{{ product.product.title }}</div>
        </td>
        <td class="text-center">{{ item.total }}</td>
        <td class="text-center">
          <div class="form-check form-switch ps-3">
            <input
              class="form-check-input ms-0"
              type="checkbox"
              role="switch"
              id="item.id"
              v-model="item.is_enabled"
              :true-value="1"
              :false-value="0"
              @change="updateProduct(item)"
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
            <button
              type="button"
              class="btn btn-outline-primary"
              @click="openModal('edit', item)"
            >
              編輯
            </button>
            <button
              type="button"
              class="btn btn-outline-danger"
              :disabled="item.is_enabled"
              @click="openModal('delete', item)"
            >
              刪除
            </button>
          </div>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script>
export default {
  data () {
    return {
      orders: [],
      pagination: {}
    }
  },
  methods: {
    getorders (page = 1) {
      // query 參數用?帶入網址
      const url = `${process.env.VUE_APP_URL}/api/${process.env.VUE_APP_PATH}/admin/orders?page=${page}`
      this.$http.get(url)
        .then((res) => {
          console.log(res)
          this.orders = res.data.orders
          this.pagination = res.data.pagination// 取得分頁資訊
        })
        .catch((err) => {
          console.log(err.response)
        })
    }
  },
  mounted () {
    this.getorders()
  }
}
</script>
