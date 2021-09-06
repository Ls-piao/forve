<template>
  <div>
    <el-input :placeholder="placeholder" :size="size" :disabled="disabled"  :readonly="readonly" style="line-hight:40px" v-model="name" class="input-with-select">
      <el-button slot="append" :disabled="disabled"  :readonly="readonly" @click="zcshowZcSelect" icon="el-icon-search"></el-button>
    </el-input>
    <zc-select ref="zcSelect" @doSubmit="selectZcToInput" :fzr="fzr" :limit="limit" :selectData="selectData" :excludedData="excludedData"></zc-select>
  </div>
</template>
<script>
import zcSelect from './BgxtZcDialog'
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
    },
    fzr: {
      type: String,
      default: ''
    }
  },
  components: {
    zcSelect
  },
  created () {

  },
  watch: {
    value: {
      handler (newVal) {
        this.selectData = []
        if (newVal) {
          newVal.split(',').forEach((id) => {
            this.$http.get(`/zcfl/bgxtGdzcInfo/queryById?id=${id}`).then(({data}) => {
              if (data.bgxtGdzcInfo && data.bgxtGdzcInfo.id !== '') {
                this.selectData.push(data.bgxtGdzcInfo)
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
        this.name = newVal.map(zcInfo => { return zcInfo.name }).join(',')
      },
      immediate: true,
      deep: false
    }
  },
  methods: {
    selectZcToInput (zcInfos) {
      this.selectData = zcInfos
      this.labelValue = zcInfos.map(zcInfo => { return zcInfo.id }).join(',')
      this.name = zcInfos.map(zcInfo => { return zcInfo.name }).join(',')
      console.log(this.labelValue + 'labelValue')
      this.$emit('getValue', this.labelValue, this.name)
    },
    zcshowZcSelect () {
      this.$refs.zcSelect.init()
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


