<template>
  <div>
    <el-input :placeholder="placeholder" :size="size" :disabled="disabled"  :readonly="readonly" style="line-hight:40px" v-model="name" class="input-with-select">
      <el-button slot="append" :disabled="disabled"  :readonly="readonly" @click="showArticlesSelect" icon="el-icon-search"></el-button>
    </el-input>
    <articles-select ref="articlesSelect" @doSubmit="selectArticlesToInput" :limit="limit" :selectData="selectData" :excludedData="excludedData"></articles-select>
  </div>
</template>
<script>
import articlesSelect from './ArticalsSelectDialog'
export default {
  data () {
    return {
      name: '',
      labelValue: this.value,
      selectData: []
    }
  },
  props: {
    limit: Number,
    value: String,
    size: {
      type: String,
      default: () => { return 'small' }
    },
    placeholder: {
      type: String,
      default: () => { return '请选择' }
    },
    readonly: {
      type: Boolean,
      default: () => { return false }
    },
    disabled: {
      type: Boolean,
      default: () => { return false }
    },
    excludedData: {
      type: [],
      default: () => { return [] }
    }
  },
  components: {
    articlesSelect
  },
  created () {

  },
  watch: {
    value: {
      handler (newVal) {
        this.selectData = []
        if (newVal) {
          newVal.split(',').forEach((id) => {
            this.$http.get(`/ypwh/artilcesSub/queryById?id=${id}`).then(({data}) => {
              if (data.artilcesSub && data.artilcesSub.id !== '') {
                this.selectData.push(data.artilcesSub)
              }
            })
          })
        }
      },
      immediate: true,
      deep: false
    },
    selectData: {
      handler (newVal) {
        this.name = newVal.map(articles => { return articles.name }).join(',')
      },
      immediate: true,
      deep: false
    }
  },
  methods: {
    selectArticlesToInput (articles) {
      this.selectData = articles
      this.$emit('getValue', this.selectData)
    },
    showArticlesSelect () {
      this.$refs.articlesSelect.init()
    }
  }
}
</script>
<style>
.el-form-item__content .el-input-group {
  vertical-align: middle;
}
.el-tag + .el-tag {
  margin-left: 5px;
  margin-bottom: 5px;
}
</style>


