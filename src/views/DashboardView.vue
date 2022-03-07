<template>
  <!-- <div class="container-fluid w-100">
    <div class="row">
      <div class="col-md-2 bg-light d-flex justify-content-between flex-md-column justify-content-md-start">
        <router-link class="navbar-brand text-dark fs-1" to="/">YumYum</router-link>
        <nav class="navbar navbar-expand-md navbar-light">
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
            <div class="collapse navbar-collapse" id="navbarSupportedContent">
              <ul class="navbar-nav flex-column fs-6 mb-2 mb-lg-0 w-100">
                <li class="nav-item">
                  <router-link to="/admin/products" class="nav-link py-2 px-3">產品管理</router-link>
                </li>
                <li class="nav-item">
                  <router-link to="/admin/orders" class="nav-link py-2 px-3">訂單管理</router-link>
                </li>
                 <li class="nav-item">
                  <router-link to="/admin/coupons" class="nav-link py-2 px-3 menuLink">優惠券管理</router-link>
                </li>
                <li class="nav-item">
                  <router-link to="" class="nav-link py-2 px-3 menuLink">貼文管理</router-link>
                </li>
                <li class="nav-item">
                  <a href="#" class="nav-link py-2 px-3" @click.prevent="logout">登出</a>
                </li>
              </ul>
            </div>
        </nav>
      </div>
      <div class="col-md-10">
        <router-view v-if="checkSuccess"></router-view>
      </div>
    </div>
  </div> -->
  <div class="container-fluid">
    <div class="row min-vh-100">
      <div class="col-md-2 border bg-light py-2 ">
        <div class="d-flex flex-md-column justify-content-between">
          <router-link class="text-dark fs-3" to="/">YumYum</router-link>
          <button
                class="border rounded-1 bg-transparent d-md-none"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#navbarSupportedContent"
                aria-controls="navbarSupportedContent"
                aria-expanded="false"
                aria-label="Toggle navigation"
              >
            <span class="material-icons-round align-middle fs-1">menu</span>
          </button>
        </div>
        <div class="collapse d-md-block" id="navbarSupportedContent">
          <ul class="navbar-nav flex-column text-center text-md-start fs-6 mb-lg-0">
            <li class="nav-item">
              <router-link to="/admin/products" class="menuLink">產品管理</router-link>
            </li>
            <li class="nav-item">
              <router-link to="/admin/orders" class="menuLink">訂單管理</router-link>
            </li>
             <li class="nav-item">
              <router-link to="/admin/coupons" class="menuLink">優惠券管理</router-link>
            </li>
            <!-- <li class="nav-item">
              <router-link to="" class="menuLink">貼文管理</router-link>
            </li> -->
            <li class="nav-item">
              <a href="#" class="menuLink" @click.prevent="logout">登出</a>
            </li>
          </ul>
        </div>
      </div>
      <div class="col-md-10 border">
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
    // 確認管理者
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
    },
    // 登出
    logout () {
      const url = `${process.env.VUE_APP_URL}/logout`
      this.$http.post(url)
        .then((res) => {
          // 頁面跳轉
          this.$router.push('/login')
        })
        .catch((err) => {
          console.log(err.response)
        })
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
.menuLink{
  color: rgb(163, 163, 163);
  padding: 0.5rem;
  &:hover{
    color: white;
    background-color: gray;
  }
  &.active{
    color: white;
    background-color: gray;
  }
}
</style>
