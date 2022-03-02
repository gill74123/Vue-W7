<template>
  <div class="container">
    <div class="row justify-content-center text-center">
      <div class="col-md-5">
        <h1>登入頁面</h1>
        <form action="" class="form-signin p-4">
          <div class="form-floating mb-3">
            <input type="email" class="form-control" id="username" placeholder="name@example.com" required autofocus
            v-model="user.username">
            <label for="username">Email address</label>
          </div>
          <div class="form-floating mb-3">
            <input type="password" class="form-control" id="password" placeholder="Password" required
            v-model="user.password">
            <label for="password">Password</label>
          </div>
          <button class="btn btn-lg btn-primary w-100 mt-3" type="button" @click="login">
            登入
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      user: {
        username: '',
        password: ''
      }
    }
  },
  methods: {
    login () {
      const url = `${process.env.VUE_APP_URL}/admin/signin`
      this.$http
        .post(url, this.user)
        .then((res) => {
          // console.log(res)
          const { token, expired } = res.data

          // 將 token, expired 存到 cookie
          document.cookie = `gillToken=${token}; expires=${new Date(expired)}; path=/`

          // 頁面跳轉
          this.$router.push('/admin/products')
        })
        .catch((err) => {
          console.log(err.response)
          alert(err.response.data.message)
        })
    }
  }
}
</script>
