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
          <div class="row g-2">
              <div class="col-12">
                <label for="title" class="form-label">貼文標題</label>
                <input id="title" type="text" class="form-control" placeholder="輸入標題"
                v-model="tempArticle.title"
                />
              </div>
              <div class="col-8">
                <label for="subtitle" class="form-label">副標題</label>
                <input id="subtitle" type="text" class="form-control" placeholder="輸入副標題"
                v-model="tempArticle.description"
                />
              </div>
              <div class="col-4">
                <label for="author" class="form-label">發佈者</label>
                <input id="author" type="text" class="form-control" placeholder="輸入發佈者"
                v-model="tempArticle.author"
                />
              </div>
              <div class="col-6">
                <label for="tag" class="form-label">標籤</label>
                <input id="tag" type="text" class="form-control" placeholder="輸入標籤"
                v-model="tempArticle.tag"
                />
              </div>
              <div class="col-6">
                <label for="create_at" class="form-label">發佈日期</label>
                <input id="create_at" type="date" class="form-control"/>
              </div>
          </div>
          <hr>
          <div>
            <ckeditor
                  :editor="editor"
                  :config="editorConfig"
                  v-model="tempArticle.content"
                ></ckeditor>
          </div>
          <div class="form-check me-3">
                  <input
                    id="isPublic"
                    class="form-check-input"
                    type="checkbox"
                    v-model="tempArticle.isPublic"
                    :true-value="1"
                    :false-value="0"
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
            @click="updateCoupon(tempCoupon.id)"
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
      editor: ClassicEditor,
      editorConfig: {
        toolbar: ['heading', 'bold', 'italic', 'blockquote', 'link', '|', 'undo', 'redo', '|', 'numberedList', 'bulletedList']
      }
    }
  },
  methods: {
    // 開啟 modal
    openArticleModal () {
      this.articleModal.show()
    },
    // 關閉 modal
    closeArticleModal () {
      this.articleModal.hide()
    }
  },
  mounted () {
    this.articleModal = new Modal(this.$refs.articleModal, { keyboard: false })
  }
}
</script>
