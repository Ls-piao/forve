<template>
  <div>
    <el-dialog
      :title="title"
      :close-on-click-modal="false"
      v-dialogDrag
      :visible.sync="visible">
      <el-table
        :data="dataList"
        size="small"
        v-loading="loading"
        style="margin-top: -25px;height:100%"
        class="table">
        <el-table-column
          prop="user.name"
          label="姓名">
        </el-table-column>
        <el-table-column
          prop="createDate"
          label="签到时间">
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="sizeChangeHandle"
        @current-change="currentChangeHandle"
        :current-page="pageNo"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="pageSize"
        :total="total"
        background
        layout="total, sizes, prev, pager, next, jumper">
      </el-pagination>

<!--      <el-form :model="inputForm" size="small" ref="inputForm" v-loading="loading" :class="method==='view'?'readonly':''"  :disabled="method==='view'"-->
<!--               label-width="120px">-->
<!--        <el-row  :gutter="15">-->
<!--        </el-row>-->
<!--      </el-form>-->
      <span slot="footer" class="dialog-footer">
      <el-button size="small" @click="visible = false">关闭</el-button>
      <el-button size="small" type="primary" v-if="isQd == 'yes'" @click="doSubmit()" v-noMoreClick>签到</el-button>
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
      visible: false,
      loading: false,
      dataList: [],
      pageNo: 1,
      pageSize: 10,
      total: 0,
      orderBy: '',
      dataListSelections: [],
      isImportCollapse: false,
      isQd: '',
      hyzt: '',
      inputForm: {
        hyid: ''
      }
    }
  },
  components: {
  },
  methods: {
    init (method, hyid) {
      this.method = method
      this.inputForm.hyid = hyid
      this.refreshList()
      this.$http({
        url: `/hygl/hygl/queryById?id=${this.inputForm.hyid}`,
        method: 'get'
      }).then(({data}) => {
        this.title = data.hygl.hyzt + `签到`
        this.loading = false
      })
      // 查找当前登录人是否签到过
      this.$http({
        url: `/hygl/hyqd/hyqd/isQd`,
        method: 'get',
        params: {
          'hyid': this.inputForm.hyid
        }
      }).then(({data}) => {
        console.log(data.msg)
        this.isQd = data.msg
        this.loading = false
      })
      this.visible = true
      this.loading = false
    },
    // 表单提交
    doSubmit () {
      this.$refs['inputForm'].validate((valid) => {
        if (valid) {
          this.loading = true
          this.$http({
            url: `/hygl/hyqd/hyqd/save`,
            method: 'post',
            data: this.inputForm
          }).then(({data}) => {
            this.loading = false
            if (data && data.success) {
              this.visible = false
              this.$message.success(data.msg)
              this.$emit('refreshDataList')
            }
          })
        }
      })
    },
    // 获取数据列表
    refreshList () {
      this.loading = true
      this.$http({
        url: '/hygl/hyqd/hyqd/list',
        method: 'get',
        params: {
          'hyid': this.inputForm.hyid,
          'pageNo': this.pageNo,
          'pageSize': this.pageSize,
          'orderBy': this.orderBy
        }
      }).then(({data}) => {
        if (data && data.success) {
          this.dataList = data.page.list
          this.total = data.page.count
          this.loading = false
        }
      })
    },
    // 每页数
    sizeChangeHandle (val) {
      this.pageSize = val
      this.pageNo = 1
      this.refreshList()
    },
    // 当前页
    currentChangeHandle (val) {
      this.pageNo = val
      this.refreshList()
    }
  }
}
</script>
