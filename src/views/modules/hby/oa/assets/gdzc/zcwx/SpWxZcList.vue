<template>
  <div class="page">
      <el-form size="small" :inline="true" class="query-form" ref="searchForm" :model="searchForm" @keyup.enter.native="refreshList()" @submit.native.prevent>
            <!-- 搜索框-->
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
<!--      <el-row>
        &lt;!&ndash;     <el-button v-if="hasPermission('zcwx:bgxtGdzcZcwx:edit')" type="warning" size="small" icon="el-icon-edit-outline" @click="edit()"
             :disabled="dataListSelections.length != 1" plain>修改</el-button>
            <el-button v-if="hasPermission('zcwx:bgxtGdzcZcwx:del')" type="danger"   size="small" icon="el-icon-delete" @click="del()"
                      :disabled="dataListSelections.length <= 0" plain>删除
            </el-button>&ndash;&gt;
        <el-button-group class="pull-right">
          &lt;!&ndash;            <el-button v-if="hasPermission('zcwx:bgxtGdzcZcwx:import')" type="default" size="small" icon="el-icon-upload2" title="导入" @click="isImportCollapse = !isImportCollapse, isSearchCollapse=false"></el-button>&ndash;&gt;
          <el-button v-if="hasPermission('zcwx:bgxtGdzcZcwx:export')" type="default" size="small" icon="el-icon-download" title="导出" @click="exportExcel()"></el-button>
          <el-button
            type="default"
            size="small"
            icon="el-icon-refresh"
            @click="refreshList">
          </el-button>
        </el-button-group>
      </el-row>-->
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
          type=""
          header-align="center"
          align="center"
          width="50">
        </el-table-column>
        <el-table-column
          prop="sqr.name"
          show-overflow-tooltip
          sortable="custom"
          label="申请人">
        </el-table-column>
        <el-table-column
          prop="dept"
          show-overflow-tooltip
          sortable="custom"
          label="部门">
        </el-table-column>
        <el-table-column
          prop="office"
          show-overflow-tooltip
          sortable="custom"
          label="单位">
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
          prop="yjhj"
          show-overflow-tooltip
          sortable="custom"
          label="原价合计">
        </el-table-column>
        <el-table-column
          prop="rwStatus"
          show-overflow-tooltip
          sortable="custom"
          label="报废状态">
          <template slot-scope="scope">
            <el-tag  :type="scope.row.level"   effect="dark" size="small">{{scope.row.rwStatus}} </el-tag>
          </template>
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
              <el-button v-if="hasPermission('zcbf:bgxtGdzcBf:view')" type="text" icon="el-icon-s-marketing" size="small" @click="todo(scope.row)">办理</el-button>
<!--              <el-button v-if="hasPermission('zcbf:bgxtGdzcBf:view')" type="text" icon="el-icon-close" size="small" @click="revoke(scope.row)">撤销</el-button>-->
              <!--          <el-button v-if="hasPermission('zcbf:bgxtGdzcBf:edit')" type="text" icon="el-icon-edit" size="small" @click="edit(scope.row.id)">修改</el-button>
                        <el-button v-if="hasPermission('zcbf:bgxtGdzcBf:del')" type="text"  icon="el-icon-delete" size="small" @click="del(scope.row.id)">删除</el-button>-->
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
<!--    <XmjbxxForm  ref="xmjbxxForm" @refreshDataList="refreshList"></XmjbxxForm>-->
  </div>
</template>

<script>
  import GridSelect from '@/components/gridSelect'
  import SelectTree from '@/components/treeSelect/treeSelect.vue'
  import pick from 'lodash.pick'
export default {
    data () {
      return {
        LxrqRange: [],
        searchForm: {
          sqr: {
            id: ''
          },
          wxNo: '',
          dept: ''
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
      GridSelect,
      SelectTree
    },
    activated () {
      this.refreshList()
    },
    methods: {
      detail (row) {
      },
      todo (row) {
        var title1 = '维修资产审批'
        this.$http.get('/flowable/task/getTaskDef', {params: {
          taskId: row.taskId,
          taskName: title1,
          taskDefKey: row.key,
          procInsId: row.procInsId,
          procDefId: row.def,
          procDefKey: row.de,
          status: 'todo'
        }}).then(({data}) => {
          if (data.success) {
            this.$router.push({
              path: '/flowable/task/TaskForm',
              query: {formTitle: title1, title: title1, ...pick(data.flow, 'formType', 'formReadOnly', 'formUrl', 'procDefKey', 'taskDefKey', 'procInsId', 'procDefId', 'taskId', 'status', 'title', 'businessId')}
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
      // 获取数据列表
      refreshList () {
        this.loading = true
        if (this.LxrqRange.length > 0) {
          this.searchForm.beginLxrq = this.LxrqRange[0]
          this.searchForm.endLxrq = this.LxrqRange[1]
        }
        this.$http({
          url: '/zcwx/bgxtGdzcZcwx/listBySh',
          method: 'get',
          params: {
            'pageNo': this.pageNo,
            'pageSize': this.pageSize,
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
        this.$refs.xmjbxxForm.init('add', '')
      },
      // 修改
      edit (id) {
        id = id || this.dataListSelections.map(item => {
          return item.id
        })[0]
        this.$refs.xmjbxxForm.init('edit', id)
      },
      // 查看
      view (id) {
        this.$refs.xmjbxxForm.init('view', id)
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
            url: '/xmgl/xmxx/xmjbxx/delete',
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
        this.$utils.download('/xmgl/xmxx/xmjbxx/import/template')
      },
      exportExcel () {
        let params = {
          ...this.searchForm
        }
        this.$utils.download('/xmgl/xmxx/xmjbxx/export', params)
      },
      resetSearch () {
        this.$refs.searchForm.resetFields()
        this.LxrqRange = []
        this.searchForm.beginLxrq = ''
        this.searchForm.endLxrq = ''
        this.refreshList()
      }
    }
  }
</script>
