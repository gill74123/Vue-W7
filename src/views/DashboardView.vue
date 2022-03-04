<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col-md-2 bg-light d-flex flex-md-column justify-content-between justify-content-md-start align-items-center">
        <router-link class="navbar-brand text-dark fs-1" to="/">YumYum</router-link>
        <nav class="navbar navbar-expand-md navbar-light w-100">
            <button
              class="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarSupportedContent"
              aria-controls="navbarSupportedContent"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse d" id="navbarSupportedContent">
              <ul class="navbar-nav flex-column fs-6 mb-2 mb-lg-0 w-100">
                <li class="nav-item">
                  <router-link to="/admin/products" class="nav-link py-2 px-3 menuLink">產品管理</router-link>
                </li>
                <li class="nav-item">
                  <router-link to="/admin/orders" class="nav-link py-2 px-3 menuLink">訂單管理</router-link>
                </li>
                <!-- <li class="nav-item">
                  <router-link to="" class="nav-link py-2 px-3 menuLink">優惠券管理</router-link>
                </li>
                <li class="nav-item">
                  <router-link to="" class="nav-link py-2 px-3 menuLink">貼文管理</router-link>
                </li> -->
              </ul>
            </div>
        </nav>
      </div>
      <div class="col-md-10">
        <router-view v-if="checkSuccess"></router-view>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      checkSuccess: false
    }
  },
  methods: {
    checkAdmin () {
      const myToken = document.cookie.replace(
        /(?:(?:^|.*;\s*)gillToken\s*=\s*([^;]*).*$)|^.*$/,
        '$1'
      )

      if (myToken) {
        // 將 token 帶入 axios headers
        this.$http.defaults.headers.common.Authorization = `${myToken}`

        const url = `${process.env.VUE_APP_URL}/api/user/check`
        this.$http
          .post(url)
          .then((res) => {
            // console.log(res)
            this.checkSuccess = true
          })
          .catch((err) => {
            console.log(err.response)
            alert(err.response.data.message)

            // 頁面跳轉
            this.$router.push('/login')
          })
      } else {
        alert('您尚未登入，請登入！')
        // 頁面跳轉
        this.$router.push('/login')
      }
    }
  },
  mounted () {
    this.checkAdmin()
  }
}
</script>

<style lang="scss">
a{
  display: block;
}
.navbar-light .navbar-nav .nav-link{
  color: rgb(163, 163, 163);
  &.active{
    color: white;
  background-color: gray;
  }
}
</style>
