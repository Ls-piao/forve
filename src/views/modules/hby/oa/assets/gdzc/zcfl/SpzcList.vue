<template>
  <div class="page">
      <el-form size="small" :inline="true" class="query-form" ref="searchForm" :model="searchForm" @keyup.enter.native="refreshList()" @submit.native.prevent>
            <!-- 搜索框-->



          <el-form-item>
            <el-button type="primary" @click="refreshList()" size="small" icon="el-icon-search">查询</el-button>
            <el-button @click="resetSearch()" size="small" icon="el-icon-refresh-right">重置</el-button>
          </el-form-item>
      </el-form>
      <div class="bg-white top">
      <el-row>
        <!-- <el-button type="primary" size="small" icon="el-icon-plus" @click="add()">新建</el-button> -->

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
            size="medium"
            header-align="center"
            align="center"
            width="50">
          </el-table-column>
          <el-table-column
            prop="name"
            show-overflow-tooltip
            label="资产名称">
          </el-table-column>
          <el-table-column
            prop="typeNo.name"
            show-overflow-tooltip
            label="类别名称">
          </el-table-column>
          <el-table-column
            prop="state"
            show-overflow-tooltip
            label="资产状态">
            <template slot-scope="scope">
              <el-tag v-if="scope.row.state === '1'" size="small" type="success">闲置</el-tag>
              <el-tag v-else-if="scope.row.state === '2'" size="small" type="warning">占用</el-tag>
              <el-tag v-else-if="scope.row.state === '3'" size="small" type="warning">维修中</el-tag>
              <el-tag v-else-if="scope.row.state === '4'" size="small" type="danger">报废</el-tag>
              <el-tag v-else-if="scope.row.state === '5'" size="small" type="danger">待审核</el-tag>
              <el-tag v-else-if="scope.row.state === '6'" size="small" type="warning">审批中</el-tag>
              <el-tag v-else-if="scope.row.state === '7'" size="small" type="warning">锁定</el-tag>
            </template>
          </el-table-column>
          <el-table-column
            prop="responsibilityPeople.name"
            show-overflow-tooltip
            sortable="custom"
            label="负责人">
          </el-table-column>
          <el-table-column
            prop="responsibilityDept.name"
            show-overflow-tooltip
            sortable="custom"
            label="责任部门">
          </el-table-column>
          <el-table-column
            prop="bxPerple.name"
            show-overflow-tooltip
            sortable="custom"
            label="保修联系人">
          </el-table-column>
          <el-table-column
            header-align="center"
            align="center"
            fixed="right"
            :key="Math.random()"
            width="200"
            label="操作">
            <template  slot-scope="scope">
              <!--          <el-button v-if="hasPermission('zcfl:bgxtGdzcInfo:jl')" type="text" icon="el-icon-view" size="small" @click="jl(scope.row.id)">借领</el-button>-->
              <!--          <el-button v-if="hasPermission('zcfl:bgxtGdzcInfo:edit') && scope.row.state == '1'"  type="text" icon="el-icon-edit" size="small" @click="edit(scope.row.id)">修改</el-button>-->
              <!--          <el-button v-if="hasPermission('zcfl:bgxtGdzcInfo:del') && scope.row.state == '1' || scope.row.state == '5'" type="text"  icon="el-icon-delete" size="small" @click="del(scope.row.id)">删除</el-button>-->
              <!--          <el-button v-if="hasPermission('zcfl:bgxtGdzcInfo:gh') && scope.row.state == '2' " type="text"  icon="el-icon-delete" size="small" @click="gh(scope.row.id)">归还</el-button>-->
              <!--          <el-button v-if="hasPermission('zcfl:bgxtGdzcInfo:wxwc') && scope.row.state == '3' " type="text"  icon="el-icon-circle-check" size="small" @click="wxwc(scope.row.id)" title="维修完成"></el-button>-->
              <el-button v-if="hasPermission('zcfl:bgxtGdzcInfo:wxwc')" type="text"  icon="el-icon-s-data" size="small" @click="todo(scope.row)">办理</el-button>
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
        var title1 = '资产审批'
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
      // 获取数据列表
      refreshList () {
        this.loading = true
        if (this.LxrqRange.length > 0) {
          this.searchForm.beginLxrq = this.LxrqRange[0]
          this.searchForm.endLxrq = this.LxrqRange[1]
        }
        this.$http({
          url: '/zcfl/bgxtGdzcInfo/listBySh',
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
