<template>
  <div>
    <el-dialog
      :title="title"
      :close-on-click-modal="false"
      v-dialogDrag
      :visible.sync="visible"
    >
      <fm-generate-form
        id="print"
        v-if="visible"
        :edit="method !== 'view'"
        :data="options"
        :value="initData"
        :class="method === 'view' ? 'readonly' : ''"
        ref="generateForm"
      >
      </fm-generate-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" type="primary" v-print="printObj"
          >打印</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      title: '',
      method: '',
      beanId: '',
      visible: false,
      initData: {},
      dataBindMap: new Map(),
      options: { list: [] },
      print: false,
      printObj: {
        id: 'print',
        popTitle: '证书',
        extraHead: '<meta http-equiv="Content-Language" content="zh-cn" />'
      }
    }
  },
  created () {
    // this.createForm()
  },
  activated () {
  },
  components: {},
  methods: {
    init (method, formId, beanId, print) {
      this.method = method
      this.beanId = beanId
      if (print) {
        this.print = true
      }
      this.initData = {}
      if (method === 'add') {
        this.title = `新建`
      } else if (method === 'edit') {
        this.title = '修改'
      } else if (method === 'view') {
        this.title = '查看'
      }
      this.visible = true
      this.loading = false
      this.createForm()
      this.$nextTick(() => {
        this.$refs.generateForm.reset()
        if (beanId) {
          this.loading = true
          this.$http({
            url: `/form/generate/queryById?formId=${formId}&id=${beanId}`,
            method: 'get'
          }).then(({ data }) => {
            this.loading = false
            for (let key in data.obj) {
              let dataField = this.dataBindMap.get(key)
              if (
                dataField &&
                (dataField['type'] === 'checkbox' ||
                  dataField['type'] === 'imgupload' ||
                  dataField['type'] === 'table' ||
                  (dataField['type'] === 'select' &&
                    dataField.options.multiple) ||
                  dataField['type'] === 'fileupload')
              ) {
                if (data.obj[key] && typeof data.obj[key] === 'string') {
                  data.obj[key] = JSON.parse(data.obj[key])
                } else if (!data.obj[key]) {
                  data.obj[key] = []
                }
              }
              if (
                dataField &&
                (dataField['type'] === 'number' ||
                  dataField['options'].dataType === 'number')
              ) {
                if (
                  data.obj[key] !== undefined &&
                  data.obj[key] !== '' &&
                  typeof data.obj[key] === 'string'
                ) {
                  data.obj[key] = JSON.parse(data.obj[key])
                }
              }
            }
            this.initData = data.obj
          })
        }
      })
    },
    generateModel (genList) {
      for (let i = 0; i < genList.length; i++) {
        if (genList[i].type === 'grid') {
          genList[i].columns.forEach(item => {
            this.generateModel(item.list)
          })
        } else if (genList[i].type === 'tabs') {
          genList[i].tabs.forEach(item => {
            this.generateModel(item.list)
          })
        } else if (genList[i].type === 'report') {
          genList[i].rows.forEach(row => {
            row.columns.forEach(column => {
              this.generateModel(column.list)
            })
          })
        } else {
          // 处理老版本没有dataBind值的情况，默认绑定数据
          if (genList[i].options.dataBind) {
            this.dataBindMap.set(genList[i].model, genList[i])
          }
        }
      }
    },
    createForm () {
      this.$http({
        url: `/form/make/queryById?id=${this.$route.query.id}`,
        method: 'get'
      }).then(({ data }) => {
        if (data.form.source) {
          this.options = JSON.parse(data.form.source)
        } else {
          this.options = {
            list: [],
            config: {
              labelWidth: 100,
              labelPosition: 'right',
              size: 'small',
              customClass: ''
            }
          }
        }
        this.dataBindMap.clear()
        this.generateModel(this.options.list)
      })
    },

    // 表单提交
    doSubmit () {
      // 自定义js ，保存前执行
      if (this.options.config.eventType === '1') {
        // eslint-disable-next-line no-new-func
        new Function(`return ${this.options.config.customJs}`)()
      }

      this.$refs.generateForm
        .getData()
        .then(data => {
          if (this.beanId) {
            data.id = this.beanId
          }
          this.$http({
            url: `/form/generate/save`,
            method: 'post',
            data: { formId: this.$route.query.id, data: JSON.stringify(data) }
          }).then(({ data }) => {
            if (data && data.success) {
              this.visible = false
              this.$message.success(data.msg)
              this.$emit('refreshDataList')
            }
            // 自定义js 保存后执行
            if (this.options.config.eventType === '2') {
              // eslint-disable-next-line no-new-func
              new Function(`return ${this.options.config.customJs}`)()
            }
          })
        })
        .catch(e => {})
    }
  }
}
</script>
