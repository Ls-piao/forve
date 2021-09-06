<template>
  <div class="page">
      <el-form size="small" :inline="true" class="query-form" ref="searchForm" :model="searchForm" @keyup.enter.native="refreshList()" @submit.native.prevent>
            <!-- 搜索框-->
         <el-form-item prop="wxNo">
                <el-input size="small" v-model="searchForm.wxNo" placeholder="维修编号" clearable></el-input>
         </el-form-item>
        <el-form-item prop="sqr.name">
          <el-input size="small" v-model="searchForm.sqr.id" placeholder="申请人名称" clearable></el-input>
        </el-form-item>
        <el-form-item prop="dept">
          <el-input size="small" v-model="searchForm.dept" placeholder="申请部门" clearable></el-input>
        </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="refreshList()" size="small" icon="el-icon-search">查询</el-button>
            <el-button @click="resetSearch()" size="small" icon="el-icon-refresh-right">重置</el-button>
          </el-form-item>
      </el-form>
        <!-- 导入导出-->
        <el-dialog  title="导入Excel" :visible.sync="isImportCollapse">
          <el-form :inline="true" v-show="isImportCollapse"  class="query-form" ref="importForm">
             <el-form-item>
              <el-button type="default" @click="downloadTpl()" size="small">下载模板</el-button>
             </el-form-item>
             <el-form-item prop="loginName">
                <el-upload
                  class="upload-demo"
                  :action="`${this.$http.BASE_URL}/zcwx/bgxtGdzcZcwx/import`"
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
       <el-button v-if="hasPermission('zcwx:bgxtGdzcZcwx:add')" type="primary" size="small" icon="el-icon-plus" @click="add()">新建</el-button>
        <!--     <el-button v-if="hasPermission('zcwx:bgxtGdzcZcwx:edit')" type="warning" size="small" icon="el-icon-edit-outline" @click="edit()"
             :disabled="dataListSelections.length != 1" plain>修改</el-button>
            <el-button v-if="hasPermission('zcwx:bgxtGdzcZcwx:del')" type="danger"   size="small" icon="el-icon-delete" @click="del()"
                      :disabled="dataListSelections.length <= 0" plain>删除
            </el-button>-->
        <el-button-group class="pull-right">
<!--            <el-button v-if="hasPermission('zcwx:bgxtGdzcZcwx:import')" type="default" size="small" icon="el-icon-upload2" title="导入" @click="isImportCollapse = !isImportCollapse, isSearchCollapse=false"></el-button>-->
            <el-button v-if="hasPermission('zcwx:bgxtGdzcZcwx:export')" type="default" size="small" icon="el-icon-download" title="导出" @click="exportExcel()"></el-button>
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
      @selection-change="selectionChangeHandle"
      @sort-change="sortChangeHandle"
      v-loading="loading"
      size="small"
      height="calc(100% - 80px)"
      @expand-change="detail"
      class="table">
      <el-table-column
        type="selection"
        header-align="center"
        align="center"
        width="50">
      </el-table-column>
      <el-table-column type="expand">
      <template slot-scope="scope">
      <el-tabs>
            <el-tab-pane label="固定资产维修明细">
                  <el-table
                  size="small"
                  :data="scope.row.bgxtGdzcZcwxInfoList"
                  style="width: 100%">
                  <el-table-column
                    prop="zc.name"
                    label="资产ID">
                  </el-table-column>
                <el-table-column
                    prop="wxjg"
                    show-overflow-tooltip
                    label="维修价格">
                  </el-table-column>
                <el-table-column
                    prop="wxfy"
                    show-overflow-tooltip
                    label="维修费用">
                  </el-table-column>
                <el-table-column
                    prop="wxwcDate"
                    show-overflow-tooltip
                    label="维修完成时间">
                  </el-table-column>
                <el-table-column
                    prop="fyfdqk"
                    show-overflow-tooltip
                    label="费用分担情况">
                  </el-table-column>
                <el-table-column
                    prop="remarks"
                    show-overflow-tooltip
                    label="备注信息">
                  </el-table-column>
                </el-table>
              </el-tab-pane>
            </el-tabs>
      </template>
      </el-table-column>
    <el-table-column
        prop="sqr.name"
        show-overflow-tooltip
        sortable="custom"
        label="申请人">
            <template slot-scope="scope">
              <el-link  type="primary" :underline="false" v-if="hasPermission('zcwx:bgxtGdzcZcwx:edit')" @click="edit(scope.row.id)">{{scope.row.sqr.name}}</el-link>
              <el-link  type="primary" :underline="false" v-else-if="hasPermission('zcwx:bgxtGdzcZcwx:view')"  @click="view(scope.row.id)">{{scope.row.sqr.name}}</el-link>
              <span v-else>{{scope.row.sqr.name}}</span>
            </template>
      </el-table-column>
    <el-table-column
        prop="dept"
        show-overflow-tooltip
        sortable="custom"
        label="部门">
      </el-table-column>
    <el-table-column
        prop="wxNo"
        show-overflow-tooltip
        sortable="custom"
        label="维修编号">
      </el-table-column>
    <el-table-column
        prop="sqDate"
        show-overflow-tooltip
        sortable="custom"
        label="申请时间">
      </el-table-column>
      <el-table-column
        prop="rwStatus"
        show-overflow-tooltip
        sortable="custom"
        label="借领状态">
        <template slot-scope="scope">
          <el-tag  :type="scope.row.level"   effect="dark" size="small">{{scope.row.rwStatus}} </el-tag>
        </template>
      </el-table-column>
    <el-table-column
        prop="yjhj"
        show-overflow-tooltip
        sortable="custom"
        label="原价合计(元)">
      </el-table-column>
<!--    <el-table-column
        prop="attach"
        show-overflow-tooltip
        sortable="custom"
        label="附件">
        <template slot-scope="scope" v-if="scope.row.attach">
            <a :href="item" target="_blank" :key="index" v-for="(item, index) in scope.row.attach.split('|')">
                {{decodeURIComponent(item.substring(item.lastIndexOf("/")+1))}}
            </a>
        </template>
      </el-table-column>-->
    <el-table-column
        prop="remarks"
        show-overflow-tooltip
        sortable="custom"
        label="备注信息">
      </el-table-column>
      <el-table-column
        header-align="center"
        align="center"
        fixed="right"
        :key="Math.random()"
        width="200"
        label="操作">
        <template  slot-scope="scope">
          <el-button v-if="hasPermission('zcwx:bgxtGdzcZcwx:view')" type="text" icon="el-icon-view" size="small" @click="view(scope.row)">查看</el-button>
          <el-button v-if="scope.row.rwStatus ==='等待审核'" type="text" icon="el-icon-close" size="small" @click="revoke(scope.row)">撤销</el-button>
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
    <BgxtGdzcZcwxForm  ref="bgxtGdzcZcwxForm" @refreshDataList="refreshList"></BgxtGdzcZcwxForm>
  </div>
</template>

<script>
  import BgxtGdzcZcwxForm from './BgxtGdzcZcwxForm'
  import pick from 'lodash.pick'
export default {
    data () {
      return {
        searchForm: {
          sqr: {
            id: ''
          },
          wxNo: '',
          dept: '',
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
      BgxtGdzcZcwxForm
    },
    activated () {
      this.refreshList()
    },
    methods: {
      // 获取数据列表
      refreshList () {
        this.loading = true
        this.$http({
          url: '/zcwx/bgxtGdzcZcwx/list',
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
          'name': '资产维修流程',
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
              query: {procDefId: row.id, procDefKey: row.id.split(':')[0], status: 'start', title: tabTitle, formType: data.flow.formType, formUrl: data.flow.formUrl, formTitle: processTitle}
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
                url: `/zcwx/bgxtGdzcZcwx/updateState`,
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
      // 修改
      edit (id) {
        id = id || this.dataListSelections.map(item => {
          return item.id
        })[0]
        this.$refs.bgxtGdzcZcwxForm.init('edit', id)
      },
      // 查看
      view (row) {
        var key = ''
        var title1 = ''
        key = ''
        title1 = '资产维修流程'
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
            url: '/zcwx/bgxtGdzcZcwx/delete',
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
     // 查看详情
      detail (row) {
        this.$http.get(`/zcwx/bgxtGdzcZcwx/queryById?id=${row.id}`).then(({data}) => {
          this.dataList.forEach((item, index) => {
            if (item.id === row.id) {
              item.bgxtGdzcZcwxInfoList = data.bgxtGdzcZcwx.bgxtGdzcZcwxInfoList
            }
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
        this.$utils.download('/zcwx/bgxtGdzcZcwx/import/template')
      },
      exportExcel () {
        let params = {
          ...this.searchForm
        }
        this.$utils.download('/zcwx/bgxtGdzcZcwx/export', params)
      },
      resetSearch () {
        this.$refs.searchForm.resetFields()
        this.refreshList()
      }
    }
  }
</script>
