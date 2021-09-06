<template>
    <div class="page">
      <el-form size="small" :inline="true" class="query-form" ref="searchForm" :model="searchForm" @keyup.enter.native="refreshList()" @submit.native.prevent>
            <!-- 搜索框-->
        <el-form-item prop="zc.name">
          <el-input size="small" v-model="searchForm.zc.id" placeholder="资产名称" clearable></el-input>
        </el-form-item>
        <el-form-item prop="sqr.name">
          <el-input size="small" v-model="searchForm.sqr.id" placeholder="申请人名称" clearable></el-input>
        </el-form-item>
        <el-form-item prop="type">
          <el-select v-model="searchForm.type" placeholder="请选择申请类型" size="small" style="width: 100%;">
            <el-option
              v-for="item in $dictUtils.getDictList('jlzt')"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="jcNo">
          <el-input size="small" v-model="searchForm.jcNo" placeholder="借领单号" clearable></el-input>
        </el-form-item>
        <el-form-item prop="jysm">
          <el-input size="small" v-model="searchForm.jysm" placeholder="借领说明" clearable></el-input>
        </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="refreshList()" size="small" icon="el-icon-search">查询</el-button>
            <el-button @click="resetSearch()" size="small" icon="el-icon-refresh-right">重置</el-button>
          </el-form-item>
      </el-form>
        <!-- 导入导出-->
      <el-dialog  title="导入Excel" :visible.sync="isImportCollapse">
          <el-form size="small" :inline="true" v-show="isImportCollapse"  ref="importForm">
             <el-form-item>
              <el-button type="default" @click="downloadTpl()" size="small">下载模板</el-button>
             </el-form-item>
             <el-form-item prop="loginName">
                <el-upload
                  class="upload-demo"
                  :action="`${this.$http.BASE_URL}/zcjl/bgxtZcjl/import`"
                  :on-success="uploadSuccess"
                   :show-file-list="true">
                  <el-button size="small" type="primary">点击上传</el-button>
                  <div slot="tip" class="el-upload__tip">只允许导入“xls”或“xlsx”格式文件！</div>
                </el-upload>
            </el-form-item>
          </el-form>
      </el-dialog>
      <div class="bg-white top">
      <el-row>
       <el-button v-if="hasPermission('zcjl:bgxtZcjl:add')" type="primary" size="small" icon="el-icon-plus" @click="add()">新建</el-button>
        <!--     <el-button v-if="hasPermission('zcjl:bgxtZcjl:edit')" type="warning" size="small" icon="el-icon-edit-outline" @click="edit()"
             :disabled="dataListSelections.length != 1" plain>修改</el-button>
            <el-button v-if="hasPermission('zcjl:bgxtZcjl:del')" type="danger"   size="small" icon="el-icon-delete" @click="del()"
                      :disabled="dataListSelections.length <= 0" plain>删除
            </el-button>-->
        <el-button-group class="pull-right">
<!--            <el-button v-if="hasPermission('zcjl:bgxtZcjl:import')" type="default" size="small" icon="el-icon-upload2" title="导入" @click="isImportCollapse = !isImportCollapse"></el-button>-->
            <el-button v-if="hasPermission('zcjl:bgxtZcjl:export')" type="default" size="small" icon="el-icon-download" title="导出" @click="exportExcel()"></el-button>
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
        prop="zc.name"
        show-overflow-tooltip
        label="资产名称">
      </el-table-column>
      <el-table-column
        prop="sqr.name"
        show-overflow-tooltip
        label="申请人">
      </el-table-column>
    <el-table-column
        prop="type"
        show-overflow-tooltip
        label="申请类型">
        <template slot-scope="scope">
              {{ $dictUtils.getDictLabel("jlzt", scope.row.type, '-') }}
        </template>
      </el-table-column>
    <el-table-column
        prop="yjghDate"
        show-overflow-tooltip
        label="预计归还">
      </el-table-column>
    <el-table-column
        prop="sjghDate"
        show-overflow-tooltip
        label="实际归还">
      </el-table-column>
      <el-table-column
        prop="dept.id"
        show-overflow-tooltip
        label="部门">
      </el-table-column>
    <el-table-column
        prop="jcNo"
        show-overflow-tooltip
        label="借领单号">
      </el-table-column>
      <el-table-column
        prop="rwStatus"
        show-overflow-tooltip
        sortable="custom"
        label="借领状态">
        <template slot-scope="scope">
          <el-tag  :type="scope.row.level"   effect="dark" size="small">{{scope.row.rwStatus}} </el-tag>
        </template>
      </el-table-column>/
      <el-table-column
        prop="jsr.name"
        show-overflow-tooltip
        label="经手人">
      </el-table-column>
      <el-table-column
        prop="zdr.name"
        show-overflow-tooltip
        label="制单人">
      </el-table-column>
    <el-table-column
        prop="jysm"
        show-overflow-tooltip
        label="借领说明">
      </el-table-column>
      <el-table-column
        header-align="center"
        align="center"
        fixed="right"
        :key="Math.random()"
        width="200"
        label="操作">
        <template  slot-scope="scope">
          <el-button v-if="hasPermission('zcjl:bgxtZcjl:view')" type="text" icon="el-icon-view" size="small" @click="view(scope.row)">查看</el-button>
          <el-button v-if="scope.row.rwStatus ==='等待审核'" type="text" icon="el-icon-close" size="small" @click="revoke(scope.row)">撤销</el-button>
<!--          <el-button v-if="hasPermission('zcjl:bgxtZcjl:edit')" type="text" icon="el-icon-edit" size="small" @click="edit(scope.row.id)">修改</el-button>
          <el-button v-if="hasPermission('zcjl:bgxtZcjl:del')" type="text"  icon="el-icon-delete" size="small" @click="del(scope.row.id)">删除</el-button>-->
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
        <!-- 弹窗, 新增 / 修改 -->
   <BgxtZcjlListForm  ref="bgxtZcjlListForm" @refreshDataList="refreshList"></BgxtZcjlListForm>
  </div>
</template>

<script>
  import BgxtZcjlListForm from './BgxtZcjlListForm'
  import pick from 'lodash.pick'
export default {
    data () {
      return {
        searchForm: {
          type: '',
          jcNo: '',
          jysm: '',
          zc: {
            id: ''
          },
          sqr: {
            id: ''
          },
          createBy: {
            id: this.$store.state.user.id
          },
          def: ''
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
      BgxtZcjlListForm
    },
    activated () {
      this.refreshList()
    },
    methods: {
      // 获取数据列表
      refreshList () {
        console.log(this.searchForm)
        this.loading = true
        this.$http({
          url: '/zcjl/bgxtZcjl/list',
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
      // 新增
      add () {
        let row = {
          'name': '发起借领流程',
          'id': this.searchForm.def
        }
        // 读取流程表单
        let tabTitle = `发起流程【${row.name}】`
        let processTitle = `${this.$store.state.user.name} 在 ${this.moment(new Date()).format('YYYY-MM-DD HH:mm')} 发起了 [${row.name}]`
        this.$http.get('/flowable/task/getTaskDef', {params: {
          procDefId: row.id,
          status: 'start'
        }}).then(({data}) => {
          if (data.success) {
            this.$router.push({
              path: '/flowable/task/TaskForm',
              query: {procDefId: row.id, procDefKey: row.id.split(':')[0], status: 'start', title: tabTitle, formType: data.flow.formType, formUrl: data.flow.formUrl, formTitle: processTitle, redirectUrl: '/hby/oa/assets/gdzc/zcjl/BgxtZcjlList'}
            })
          }
        })
      },
      // 修改
      edit (id) {
        id = id || this.dataListSelections.map(item => {
          return item.id
        })[0]
        this.$refs.bgxtZcjlForm.init('edit', id)
      },
      // 查看
      view (row) {
        var key = ''
        var title1 = ''
        key = ''
        title1 = '资产借领流程'
        this.$http.get('/flowable/task/getTaskDef', {params: {
          taskDefKey: key,
          procInsId: row.procInsId,
          procDefId: row.def
        }}).then(({data}) => {
          if (data.success) {
            this.$router.push({
              path: '/flowable/task/TaskFormDetail',
              query: {readOnly: true, title: title1, formTitle: title1, ...pick(data.flow, 'formType', 'formUrl', 'procDefKey', 'taskDefKey', 'procInsId', 'procDefId', 'taskId', 'status', 'title', 'businessId')}
            })
          }
        })
      },
      // 撤销申请
      revoke (row) {
        this.$confirm(`确定要撤销该流程吗?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http.post('/flowable/process/revokeProcIns', {'id': row.procInsId}).then(({data}) => {
            if (data && data.success) {
              // 修改状态
              this.$http({
                url: `/zcjl/bgxtZcjl/updateState`,
                method: 'post',
                data: row
              }).then(({data}) => {
                this.loading = false
                if (data && data.success) {
                  this.$message.success(data.msg)
                  this.refreshList()
                }
              })
            }
          })
        })
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
            url: '/zcjl/bgxtZcjl/delete',
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
          this.$message.success({dangerouslyUseHTMLString: true,
            message: res.msg})
        } else {
          this.$message.error(res.msg)
        }
      },
      // 下载模板
      downloadTpl () {
        this.$utils.download('/zcjl/bgxtZcjl/import/template')
      },
      exportExcel () {
        let params = {
          ...this.searchForm
        }
        this.$utils.download('/zcjl/bgxtZcjl/export', params)
      },
      resetSearch () {
        this.$refs.searchForm.resetFields()
        this.refreshList()
      }
    }
  }
</script>
