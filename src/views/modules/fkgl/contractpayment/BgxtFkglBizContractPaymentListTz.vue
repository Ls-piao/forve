<template>
    <div class="page">
      <el-form size="small" :inline="true" class="query-form" ref="searchForm" :model="searchForm" @keyup.enter.native="refreshList()" @submit.native.prevent>
          <el-form-item prop="contractName">
                <el-input size="small" v-model="searchForm.contractName" placeholder="合同名称" clearable></el-input>
         </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="refreshList()" size="small" icon="el-icon-search">查询</el-button>
            <el-button @click="resetSearch()" size="small" icon="el-icon-refresh-right">重置</el-button>
          </el-form-item>
      </el-form>
      <div class="bg-white top">
      <el-row>
        <!-- <el-button v-if="hasPermission('filemanage:wjxx:wjjbxx:add')" type="primary" size="small" icon="el-icon-plus" @click="start()">新建</el-button> -->
        <!-- <el-button v-if="hasPermission('filemanage:wjxx:wjjbxx:edit')" type="warning" size="small" icon="el-icon-edit-outline" @click="edit()"
         :disabled="dataListSelections.length != 1" plain>修改</el-button> -->
        <!-- <el-button v-if="hasPermission('filemanage:wjxx:wjjbxx:del')" type="danger"   size="small" icon="el-icon-delete" @click="del()"
                  :disabled="dataListSelections.length <= 0" plain>删除
        </el-button> -->
        <el-button-group class="pull-right">

            <el-button
              type="default"
              size="small"
              icon="el-icon-refresh"
              @click="refreshList">
            </el-button>
        </el-button-group>
      </el-row>
    <el-table
      :data="dataList"
       size="small"
       height="calc(100% - 80px)"
      @selection-change="selectionChangeHandle"
      @sort-change="sortChangeHandle"
      v-loading="loading"
      class="table">
      <el-table-column
        type="selection"
        header-align="center"
        align="center"
        width="50">
      </el-table-column>
    <el-table-column
        prop="contractName"
        show-overflow-tooltip
        sortable="custom"
        label="合同名称">
      </el-table-column>
    <el-table-column
        prop="contractNo"
        show-overflow-tooltip
        sortable="custom"
        label="合同编号">
      </el-table-column>
    <el-table-column
        prop="handlingDate"
        show-overflow-tooltip
        sortable="custom"
        label="经办日期">
      </el-table-column>
    <el-table-column
        prop="handlingDepartment"
        show-overflow-tooltip
        sortable="custom"
        label="经办部门">
      </el-table-column>
    <el-table-column
        prop="payyee"
        show-overflow-tooltip
        sortable="custom"
        label="收款单位">
      </el-table-column>
    <el-table-column
        prop="contacts"
        show-overflow-tooltip
        sortable="custom"
        label="联系人">
      </el-table-column>
    <el-table-column
        prop="contactsTel"
        show-overflow-tooltip
        sortable="custom"
        label="联系电话">
      </el-table-column>
    <el-table-column
        prop="copeWithMoney"
        show-overflow-tooltip
        sortable="custom"
        label="应付金额">
      </el-table-column>
    <el-table-column
        prop="copeWithDate"
        show-overflow-tooltip
        sortable="custom"
        label="应付日期">
      </el-table-column>
      <el-table-column
        header-align="center"
        align="center"
        fixed="right"
        :key="Math.random()"
        width="200"
        label="操作">
        <template  slot-scope="scope">
          <el-button type="text" v-if="hasPermission('filemanage:wjxx:wjjbxx:view') || hasPermission('filemanage:wjxx:wjjbxx:edit')" icon="el-icon-view" size="small" @click="detail(scope.row)">查看</el-button>
        </template>
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
    </div>
    <!-- 附件下载-->
    <el-dialog
      :title="accessoryTitle"
      :close-on-click-modal="false"
      v-dialogDrag
      :visible.sync="accessoryDialog">
      <el-form size="small" v-loading="loading"
               label-width="120px">
        <el-row :gutter="24">
          <el-upload ref="fileUrl"
                     v-if="visible"
                     :disabled="true"
                     :action="`${this.$http.BASE_URL}/sys/file/webupload/upload?uploadPath=/fileManage`"
                     :headers="{token: $cookie.get('token')}"
                     :on-preview="(file, fileList) => {$window.location.href = (file.response && file.response.url) || file.url}"
                     :file-list="fileUrlArra">
          </el-upload>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
      <el-button size="small" @click="accessoryDialog = false"
      >关闭</el-button>
    </span>
    </el-dialog>
  </div>
</template>

<script>
  import pick from 'lodash.pick'
  export default {
    data () {
      return {
        fileUrlArra: [],
        accessoryDialog: false,
        accessoryTitle: '附件下载',
        visible: true,
        searchForm: {
          contractName: ''
        },
        dataList: [],
        pageNo: 1,
        pageSize: 10,
        total: 0,
        orderBy: '',
        dataListSelections: [],
        isImportCollapse: false,
        loading: false
      }
    },
    components: {
    },
    activated () {
      this.refreshList()
    },
    computed: {
      userName () {
        return JSON.parse(localStorage.getItem('user')).name
      }
    },
    methods: {
      start () {
        // 读取流程表单
        let tabTitle = `发起流程【合同付款】`
        let processTitle = `${this.userName} 在 ${this.moment(new Date()).format('YYYY-MM-DD HH:mm')} 发起了 [合同付款]`
        this.$http.get('/flowable/task/getTaskDef', {params: {
          procDefId: 'fkglhtfk:3:27d7df19-ff2a-11eb-97e7-7e7635e53918',
          status: 'start'
        }}).then(({data}) => {
          if (data.success) {
            this.$router.push({
              path: '/flowable/task/TaskForm',
              query: {procDefId: 'fkglhtfk:3:27d7df19-ff2a-11eb-97e7-7e7635e53918', procDefKey: 'Process_1628308295752', status: 'start', title: tabTitle, formType: data.flow.formType, formUrl: data.flow.formUrl, formTitle: processTitle}
            })
          }
        })
      },
      detail (row) {
        var key = ''
        if (row.state === '审批中' || row.state === '驳回') {
          key = 'fkgl_start'
        } else if (row.state === '部门领导同意') {
          key = 'fkgl_ldsp'
        } else if (row.state === '会计审批同意') {
          key = 'fkgl_kjsp'
        } else {
          key = 'fkgl_end'
        }
        this.$http.get('/flowable/task/getTaskDef', {params: {
          taskDefKey: key,
          procInsId: row.procInsId,
          procDefId: 'fkglhtfk:3:27d7df19-ff2a-11eb-97e7-7e7635e53918'
        }}).then(({data}) => {
          console.log(data)
          if (data.success) {
            this.$router.push({
              path: '/flowable/task/TaskFormDetail',
              query: {readOnly: true, title: row.title, formTitle: row.title, ...pick(data.flow, 'formType', 'formUrl', 'procDefKey', 'taskDefKey', 'procInsId', 'procDefId', 'taskId', 'status', 'title', 'businessId')}
            })
          }
        })
      },
      // 获取数据列表
      refreshList () {
        this.loading = true
        this.$http({
          url: '/fkgl/contractpayment/bgxtFkglBizContractPayment/list',
          method: 'get',
          params: {
            'pageNo': this.pageNo,
            'pageSize': this.pageSize,
            'orderBy': this.orderBy,
            ...this.searchForm
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

      resetSearch () {
        this.$refs.searchForm.resetFields()
        this.refreshList()
      }
    }
  }
</script>
