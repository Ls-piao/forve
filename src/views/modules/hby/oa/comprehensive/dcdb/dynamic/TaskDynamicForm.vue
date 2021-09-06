<template>
  <div>
    <el-dialog
      class="dialogStyle"
      :title="title"
      :close-on-click-modal="false"
      width="75%"
      append-to-body
      v-dialogDrag
      :visible.sync="visible">
      <el-form size="small" v-loading="loading" label-width="120px">
        <div style="background-color:gainsboro; height: 30px ;padding-left: 15px;padding-right: 15px">
        <el-row style=" left: 3.8%;font-size: 15.3px">
          <el-col :span="8">
            <el-row :gutter="5" style="margin-top: 1.5%;">
              <el-col :span="24"><b>变更项</b></el-col>
            </el-row>
          </el-col>
          <el-col :span="8">
            <el-row :gutter="5" style=" margin-top: 1.5%;">
              <el-col :span="24"><b>变更前</b></el-col>
            </el-row>
          </el-col>
          <el-col :span="8">
            <el-row :gutter="5" style="margin-top: 1.5%;">
              <el-col :span="24"><b>变更后</b></el-col>
            </el-row>
          </el-col>
        </el-row>
        </div>
        <div class="xiangQing">
        <el-row style="left: 3.8%;font-size: 15.3px;margin-top: 2%">
          <el-col :span="8">
            <el-row :gutter="5">
              <el-col :span="8">任务名称:</el-col>
            </el-row>
          </el-col>
          <el-col :span="8">
            <el-row :gutter="5">
              <el-col :span="15" style="font-size:15px;font-weight: 550">
                <p v-if="beforeInputForm.taskName === afterInputForm.taskName">{{ beforeInputForm.taskName }}</p>
                <p v-else-if="beforeInputForm.taskName === ''">无数据</p>
                <p v-else style="color: red">{{ beforeInputForm.taskName }}</p>
              </el-col>
            </el-row>
          </el-col>
          <el-col :span="8">
            <el-row :gutter="5">
              <el-col :span="15" style="font-size:15px;font-weight: 550">
                <p v-if="beforeInputForm.taskName === afterInputForm.taskName">{{ afterInputForm.taskName }}</p>
                <p v-else style="color: red">{{ afterInputForm.taskName }}</p>
              </el-col>
            </el-row>
          </el-col>
        </el-row>
        </div>
        <div class="xiangQing">
        <el-row style="left: 3.8%;font-size: 15.3px;margin-top: 0%">
          <el-col :span="8">
            <el-row :gutter="5">
              <el-col :span="8">任务目标:</el-col>
            </el-row>
          </el-col>
          <el-col :span="8">
            <el-row :gutter="5">
              <el-col :span="15" style="font-size:15px;font-weight: 550">
                <p v-if="beforeInputForm.object === afterInputForm.object">{{ beforeInputForm.object }}</p>
                <p v-else-if="beforeInputForm.object === ''">无数据</p>
                <p v-else style="color: red">{{ beforeInputForm.object }}</p>
              </el-col>
            </el-row>
          </el-col>
          <el-col :span="8">
            <el-row :gutter="5">
              <el-col :span="15" style="font-size:15px;font-weight: 550">
                <p v-if="beforeInputForm.object === afterInputForm.object">{{ afterInputForm.object }}</p>
                <p v-else style="color: red">{{ afterInputForm.object }}</p>
              </el-col>
            </el-row>
          </el-col>
        </el-row>
        </div>
        <div class="xiangQing">
          <el-row style="left: 3.8%;font-size: 15.3px;margin-top: 0%">
            <el-col :span="8">
              <el-row :gutter="5">
                <el-col :span="8">开始时间:</el-col>
              </el-row>
            </el-col>
            <el-col :span="8">
              <el-row :gutter="5">
                <el-col :span="15" style="font-size:15px;font-weight: 550">
                  <p v-if="beforeInputForm.strStartDate === afterInputForm.strStartDate">{{ beforeInputForm.strStartDate }}</p>
                  <p v-else-if="beforeInputForm.strStartDate === ''">无数据</p>
                  <p v-else style="color: red">{{ beforeInputForm.strStartDate }}</p>
                </el-col>
              </el-row>
            </el-col>
            <el-col :span="8">
              <el-row :gutter="5">
                <el-col :span="15" style="font-size:15px;font-weight: 550">
                  <p v-if="beforeInputForm.strStartDate === afterInputForm.strStartDate">{{ afterInputForm.strStartDate }}</p>
                  <p v-else style="color: red">{{ afterInputForm.strStartDate }}</p>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </div>
        <div class="xiangQing">
          <el-row style="left: 3.8%;font-size: 15.3px;margin-top: 0%">
            <el-col :span="8">
              <el-row :gutter="5">
                <el-col :span="8">结束时间:</el-col>
              </el-row>
            </el-col>
            <el-col :span="8">
              <el-row :gutter="5">
                <el-col :span="15" style="font-size:15px;font-weight: 550">
                  <p v-if="beforeInputForm.strEndDate === afterInputForm.strEndDate">{{ beforeInputForm.strEndDate }}</p>
                  <p v-else-if="beforeInputForm.strEndDate === ''">无数据</p>
                  <p v-else style="color: red">{{ beforeInputForm.strEndDate }}</p>
                </el-col>
              </el-row>
            </el-col>
            <el-col :span="8">
              <el-row :gutter="5">
                <el-col :span="15" style="font-size:15px;font-weight: 550">
                  <p v-if="beforeInputForm.strEndDate === afterInputForm.strEndDate">{{ afterInputForm.strEndDate }}</p>
                  <p v-else style="color: red">{{ afterInputForm.strEndDate }}</p>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </div>
        <div class="xiangQing">
        <el-row style="left: 3.8%;font-size: 15.3px;margin-top: 0%">
          <el-col :span="8">
            <el-row :gutter="5">
              <el-col :span="8">任务状态:</el-col>
            </el-row>
          </el-col>
          <el-col :span="8">
            <el-row :gutter="5">
              <el-col :span="15" style="font-size:15px;font-weight: 550">
                <p v-if="beforeInputForm.taskStatus === afterInputForm.taskStatus">{{ beforeInputForm.taskStatus }}</p>
                <p v-else-if="beforeInputForm.taskStatus === ''">无数据</p>
                <p v-else style="color: red">{{ beforeInputForm.taskStatus }}</p>
              </el-col>
            </el-row>
          </el-col>
          <el-col :span="8">
            <el-row :gutter="5">
              <el-col :span="15" style="font-size:15px;font-weight: 550">
                <p v-if="beforeInputForm.taskStatus === afterInputForm.taskStatus">{{ afterInputForm.taskStatus }}</p>
                <p v-else style="color: red">{{ afterInputForm.taskStatus }}</p>
              </el-col>
            </el-row>
          </el-col>
        </el-row>
        </div>
        <div class="xiangQing">
        <el-row style="left: 3.8%;font-size: 15.3px;margin-top: 0%">
          <el-col :span="8">
            <el-row :gutter="5">
              <el-col :span="8">任务类型:</el-col>
            </el-row>
          </el-col>
          <el-col :span="8">
            <el-row :gutter="5">
              <el-col :span="15" style="font-size:15px;font-weight: 550">
                <p v-if="beforeInputForm.taskType === afterInputForm.taskType">{{ beforeInputForm.taskType }}</p>
                <p v-else-if="beforeInputForm.taskType === ''">无数据</p>
                <p v-else style="color: red">{{ beforeInputForm.taskType }}</p>
              </el-col>
            </el-row>
          </el-col>
          <el-col :span="8">
            <el-row :gutter="5">
              <el-col :span="15" style="font-size:15px;font-weight: 550">
                <p v-if="beforeInputForm.taskType === afterInputForm.taskType">{{ afterInputForm.taskType }}</p>
                <p v-else style="color: red">{{ afterInputForm.taskType }}</p>
              </el-col>
            </el-row>
          </el-col>
        </el-row>
        </div>
        <div class="xiangQing">
        <el-row style="left: 3.8%;font-size: 15.3px;margin-top: 0%">
          <el-col :span="8">
            <el-row :gutter="5">
              <el-col :span="8">拒绝原因:</el-col>
            </el-row>
          </el-col>
          <el-col :span="8">
            <el-row :gutter="5">
              <el-col :span="15" style="font-size:15px;font-weight: 550">
                <p v-if="beforeInputForm.reason === afterInputForm.reason">{{ beforeInputForm.reason }}</p>
                <p v-else-if="beforeInputForm.reason === ''">无数据</p>
                <p v-else style="color: red">{{ beforeInputForm.reason }}</p>
              </el-col>
            </el-row>
          </el-col>
          <el-col :span="8">
            <el-row :gutter="5">
              <el-col :span="15" style="font-size:15px;font-weight: 550">
                <p v-if="beforeInputForm.reason === afterInputForm.reason">{{ afterInputForm.reason }}</p>
                <p v-else style="color: red">{{ afterInputForm.reason }}</p>
              </el-col>
            </el-row>
          </el-col>
        </el-row>
        </div>
      </el-form>
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
      searchForm: {
        taskName: '',
        mainTaskName: '',
        taskStatus: ''
      },
      mainTaskId: '',
      pageNo: 1,
      pageSize: 10,
      orderBy: '',
      beforeInputForm: {
        taskStatus: '',
        object: '',
        taskName: '',
        taskType: '',
        reason: '',
        strStartDate: '',
        strEndDate: ''
      },
      afterInputForm: {
        taskStatus: '',
        object: '',
        taskName: '',
        taskType: '',
        reason: '',
        strStartDate: '',
        strEndDate: ''
      }
    }
  },
  components: {
  },
  methods: {
    init (method, id) {
      this.method = method
      if (method === 'view') {
        this.mainTaskId = id
      }
      this.visible = true
      this.loading = true
      this.refreshList()
    },
    // 获取数据列表
    refreshList () {
      this.$http({
        url: '//taskDynamic/taskDynamic/queryById',
        method: 'get',
        params: {
          'id': this.mainTaskId
        }
      }).then(({data}) => {
        if (data && data.success) {
          if (data.taskDynamic.operation === 'addTask') {
            this.title = '新增主任务详情'
          } else if (data.taskDynamic.operation === 'updateTask') {
            this.title = '修改主任务详情'
          } else if (data.taskDynamic.operation === 'ggztTask') {
            this.title = '更改主任务状态详情'
          }
          this.beforeInputForm = JSON.parse(data.taskDynamic.beforeChange)
          this.afterInputForm = JSON.parse(data.taskDynamic.afterChange)
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
    },
    // 多选
    selectionChangeHandle (val) {
      this.dataListSelections = val
    },
    // 排序
    sortChangeHandle (obj) {
      if (obj.order === 'ascending') {
        this.orderBy = obj.prop + ' asc'
      } else if (obj.order === 'descending') {
        this.orderBy = obj.prop + ' desc'
      } else {
        this.orderBy = ''
      }
      this.refreshList()
    },
    // 查看
    view (id) {
      this.$refs.taskDynamicForm.init('view', id)
    },
    // 删除tab
    removeTabHandle (tabName) {
      this.mainTabs = this.mainTabs.filter(item => item.name !== tabName)
      if (this.mainTabs.length >= 1) {
        // 当前选中tab被删除
        if (tabName === this.mainTabsActiveName) {
          this.$router.push({name: this.mainTabs[this.mainTabs.length - 1].name}, () => {
            this.mainTabsActiveName = this.$route.name
          })
        }
      } else {
        this.$router.push('/')
      }
    },
    // 删除
    del (id) {
      let ids = id || this.dataListSelections.map(item => {
        return item.id
      }).join(',')
      this.$confirm(`确定删除所选项吗?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.loading = true
        this.$http({
          url: '/sontask/sonTask/delete',
          method: 'delete',
          params: {'ids': ids}
        }).then(({data}) => {
          if (data && data.success) {
            this.$message.success(data.msg)
            this.refreshList()
          }
          this.loading = false
        })
      })
    },
    // 导入成功
    uploadSuccess (res, file) {
      if (res.success) {
        this.$message.success({
          dangerouslyUseHTMLString: true,
          message: res.msg
        })
      } else {
        this.$message.error(res.msg)
      }
    },
    // 下载模板
    downloadTpl () {
      this.$utils.download('/sontask/sonTask/import/template')
    },
    exportExcel () {
      let params = {
        ...this.searchForm
      }
      this.$utils.download('/sontask/sonTask/export', params)
    },
    resetSearch () {
      this.$refs.searchForm.resetFields()
      this.refreshList()
    }
  }
}
</script>
<style lang="less" scoped>
.dialogStyle {

  .el-dialog .el-dialog__body {
    overflow-x: hidden
  }
}
.xiangQing {
  border-bottom: 1px dashed ;
  padding: 15px 15px;

}
</style>
