<template>
    <div
    id="articleModal"
    ref="articleModal"
    class="modal fade"
    aria-labelledby="articleModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-lg">
      <div class="modal-content border-0">
        <div class="modal-header bg-dark text-white">
          <h5 id="articleModalLabel" class="modal-title">
            <span>新增貼文</span>
          </h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <div class="row g-2 mb-2">
              <div class="col-12">
                <label for="title" class="form-label">貼文標題</label>
                <input id="title" type="text" class="form-control" placeholder="輸入標題"
                v-model="itemArticle.title"
                />
              </div>
              <div class="col-12">
                <label for="subtitle" class="form-label">副標題</label>
                <input id="subtitle" type="text" class="form-control" placeholder="輸入副標題"
                v-model="itemArticle.description"
                />
              </div>
          </div>
          <div class="row g-2">
            <div class="col-6">
              <div class="mb-3">
                  <label for="imageUrl" class="form-label">封面圖</label>
                  <div class="input-group mb-2">
                    <input
                      type="text"
                      class="form-control"
                      placeholder="可以透過外部圖片 URL 上傳"
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
              </div>
              <div class="border rounded-2" style="height: 150px; background-size: cover; background-position: center center;"
              :style="{backgroundImage: `url(${itemArticle.image})`}">
              </div>
            </div>
            <div class="col-6 d-flex flex-column justify-content-between">
              <div class="mb-2">
                <label for="tag" class="form-label">標籤</label>
                <input id="tag" type="text" class="form-control" placeholder="輸入標籤，用 [ ENTER ] 新增"
                 v-model="tag" @keyup.enter="addTag(tag)"
                />
              </div>
                <div class="d-flex">
                  <button class="d-flex align-items-center btn btn-secondary btn-sm rounded-3 me-1"
                  v-for="(tag, index) in itemArticle.tag" :key="tag" @click="removeTag(index)">
                    <span>{{ tag }}</span>
                    <i class="material-icons-round fs-5 ms-1">clear</i>
                  </button>
                </div>
              <div class="mb-2">
                <label for="author" class="form-label">發佈者</label>
                <input id="author" type="text" class="form-control" placeholder="輸入發佈者"
                v-model="itemArticle.author"
                />
              </div>
              <div>
                <label for="create_at" class="form-label">發佈日期</label>
                <input id="create_at" type="date" class="form-control"
                v-model="create_at"/>
              </div>
            </div>
          </div>
          <hr>
          <div class="mb-2">
            <ckeditor :editor="editor" :config="editorConfig" v-model="itemArticle.content"></ckeditor>
          </div>
          <div class="form-check me-3">
                  <input
                    id="isPublic"
                    class="form-check-input"
                    type="checkbox"
                    v-model="itemArticle.isPublic"
                    :true-value="true"
                    :false-value="false"
                  />
                  <label class="form-check-label" for="isPublic"
                    >是否公開</label
                  >
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
            @click="updateArticle(itemArticle.id)"
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
import ClassicEditor from '@ckeditor/ckeditor5-build-classic'

export default {
  props: ['temp-article', 'is-new'],
  data () {
    return {
      articleModal: '',
      itemArticle: {
        tag: []
      },
      create_at: '',
      fileInput: '',
      imageUrl: '',
      tag: '',
      editor: ClassicEditor,
      editorConfig: {
        toolbar: ['heading', 'bold', 'italic', 'blockquote', 'link', '|', 'undo', 'redo', '|', 'numberedList', 'bulletedList']
      }
    }
  },
  methods: {
    // 新增/編輯 貼文
    updateArticle (articleId) {
      // Vue 在更新 DOM 的時候是非同步的，導致 ProductModal 拿到的 props 資料與父元件不一致
      // 所以使用 nextTick() 當 DOM 更新後才執行
      this.$nextTick(() => {
        let url = `${process.env.VUE_APP_URL}/api/${process.env.VUE_APP_PATH}/admin/article/${articleId}`
        let httpMethod = 'put'

        if (this.isNew) {
          url = `${process.env.VUE_APP_URL}/api/${process.env.VUE_APP_PATH}/admin/article`
          httpMethod = 'post'
        }
        this.$http[httpMethod](url, { data: this.itemArticle })
          .then((res) => {
            // 關閉 Modal
            this.closeArticleModal()

            // 執行 取得產品列表
            this.$emit('get-articles')// 此方法在外層所以要用 emit
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
        this.itemArticle.image = this.imageUrl.value
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
          this.itemArticle.image = res.data.imageUrl
          // 清空 input 欄位
          this.fileInput.value = ''
        })
        .catch((err) => {
          console.log(err.response)
        })
    },
    // 新增標籤
    addTag (tag) {
      this.itemArticle.tag.push(tag)
      this.tag = ''
      // console.log(e.target.value)
    },
    // 移除標籤
    removeTag (index) {
      if (window.event.target.nodeName === 'I') {
        this.itemArticle.tag.splice(index, 1)
      }
    },
    // 開啟 modal
    openArticleModal () {
      this.articleModal.show()
    },
    // 關閉 modal
    closeArticleModal () {
      this.articleModal.hide()
    }
  },
  watch: {
    tempArticle () {
      this.itemArticle = { ...this.tempArticle }
      this.create_at = new Date(this.itemArticle.create_at * 1000).toISOString().split('T')[0]
    },
    create_at () {
      // 將時間格式從 YYYY-MM-DD 轉換成 Unix 格式
      // Math.floor() 取小於數值的最大整數
      this.tempArticle.create_at = Math.floor(new Date(this.create_at) / 1000)
    }
  },
  mounted () {
    this.articleModal = new Modal(this.$refs.articleModal, { keyboard: false })
    this.fileInput = this.$refs.fileInput
    this.imageUrl = this.$refs.imageUrl
  }
}
</script>

<style>
.ck-editor__editable_inline {
  min-height: 300px;
}
</style>
