<template>
  <div class="jp-common-layout page">
    <div class="jp-common-layout-center jp-flex-main">
      <el-form :inline="true" size="small" class="query-form" ref="searchForm" :model="searchForm"
               @keyup.enter.native="refreshList()" @submit.native.prevent>
        <!-- 搜索框-->
        <el-form-item prop="dataName" label="资料名称">
          <el-input size="small" v-model="searchForm.dataName" placeholder="资料名称" clearable></el-input>
        </el-form-item>
        <el-form-item prop="dataType.id" label="资料类别">
          <SelectTree
            ref="dataType" placeholder="请选择资料类别"
            :props="{
                          value: 'id',             // ID字段名
                          label: 'name',         // 显示名称
                          children: 'children'    // 子级字段名
                        }"
            size="small"
            url="/data/dataType/treeData"
            :value="searchForm.dataType.id"
            :clearable="true"
            :accordion="true"
            @getValue="(value) => {searchForm.dataType.id=value}"/>
        </el-form-item>
        <el-form-item prop="dataStatus" label="状态">
          <el-select v-model="searchForm.dataStatus" placeholder="请选择状态">
            <el-option
              v-for="(item,key) in dataStatusList"
              :key="key"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="refreshList()" size="small">查询</el-button>
          <el-button @click="resetSearch()" size="small">重置</el-button>
        </el-form-item>
      </el-form>
      <!-- 导入导出-->
      <el-dialog title="导入Excel" :visible.sync="isImportCollapse">
        <el-form :inline="true" v-show="isImportCollapse" class="query-form" ref="importForm">
          <el-form-item>
            <el-button type="default" @click="downloadTpl()" size="small">下载模板</el-button>
          </el-form-item>
          <el-form-item prop="loginName">
            <el-upload
              class="upload-demo"
              :action="`${this.$http.BASE_URL}/data/data/import`"
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
          <el-button v-if="hasPermission('data:data:add')" type="primary" size="small" icon="el-icon-plus"
                     @click="add()">新建
          </el-button>
          <el-button v-if="hasPermission('data:data:del')" type="danger" size="small" icon="el-icon-delete"
                     @click="del()"
                     :disabled="dataListSelections.length <= 0" plain>删除
          </el-button>
          <el-button-group class="pull-right">
            <el-button v-if="hasPermission('data:data:import')" type="default" size="small" icon="el-icon-upload2"
                       title="导入" @click="isImportCollapse = !isImportCollapse"></el-button>
            <el-button v-if="hasPermission('data:data:export')" type="default" size="small" icon="el-icon-download"
                       title="导出" @click="exportExcel()"></el-button>
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
            prop="dataName"
            show-overflow-tooltip
            sortable="custom"
            label="资料名称">
            <!--            <template slot-scope="scope">-->
            <!--              <el-link type="primary" :underline="false" v-if="hasPermission('data:data:edit')"-->
            <!--                       @click="edit(scope.row.id)">{{ scope.row.dataName }}-->
            <!--              </el-link>-->
            <!--              <el-link type="primary" :underline="false" v-else-if="hasPermission('data:data:view')"-->
            <!--                       @click="view(scope.row.id)">{{ scope.row.dataName }}-->
            <!--              </el-link>-->
            <!--              <span v-else>{{ scope.row.dataName }}</span>-->
            <!--            </template>-->
          </el-table-column>
          <el-table-column
            prop="dataType.name"
            show-overflow-tooltip
            sortable="custom"
            label="资料类别">
          </el-table-column>
          <el-table-column
            prop="department"
            show-overflow-tooltip
            sortable="custom"
            label="发布部门">
          </el-table-column>
          <!--<el-table-column
            prop="dataUrl"
            show-overflow-tooltip
            sortable="custom"
            label="资料路径">
            <template slot-scope="scope" v-if="scope.row.dataUrl">
              <a :href="item" target="_blank" :key="index" v-for="(item, index) in scope.row.dataUrl.split('|')">
                {{ decodeURIComponent(item.substring(item.lastIndexOf("/") + 1)) }}
              </a>
            </template>
          </el-table-column>-->
          <!-- <el-table-column
             prop="dataContent"
             show-overflow-tooltip
             sortable="custom"
             label="资料内容">
             <template slot-scope="scope">
                 <p v-html="$utils.unescapeHTML(scope.row.dataContent)"></p>
             </template>
           </el-table-column>-->
          <el-table-column
            prop="dataStatus"
            show-overflow-tooltip
            sortable="custom"
            label="状态">
            <template slot-scope="scope">
              <!--0待审核1审核驳回2待发布3已发布-->
              <el-tag effect="dark" size="small" :type="statusStyle[scope.row.dataStatus]">{{ dataStatusMap.get('' + scope.row.dataStatus) }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column
            header-align="center"
            align="center"
            fixed="right"
            :key="Math.random()"
            width="200"
            label="操作">
            <template slot-scope="scope">
              <el-button v-if="hasPermission('data:data:view')" type="text" icon="el-icon-view" size="small"
                         @click="view(scope.row.id)">查看
              </el-button>
              <el-button v-if="hasPermission('data:data:edit')" :disabled="scope.row.dataStatus === 3 || scope.row.dataStatus === 2" type="text" icon="el-icon-edit" size="small"
                         @click="edit(scope.row.id)">修改
              </el-button>
              <el-button v-if="hasPermission('data:data:del')" :disabled="scope.row.dataStatus === 3 || scope.row.dataStatus === 2" type="text" icon="el-icon-delete" size="small"
                         @click="del(scope.row.id)">删除
              </el-button>
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
          style="margin-bottom: 1%"
          layout="total, sizes, prev, pager, next, jumper">
        </el-pagination>
      </div>
      <!-- 弹窗, 新增 / 修改 -->
      <DataForm ref="dataForm" @refreshDataList="refreshList"></DataForm>
      <DataTypeForm ref="dataTypeForm" @refreshTree="refreshTree"></DataTypeForm>
    </div>
  </div>
</template>

<script>
import DataForm from './DataForm'
import DataTypeForm from './DataTypeForm'
import SelectTree from '@/components/treeSelect/treeSelect.vue'

export default {
  data () {
    return {
      statusStyle: ['info', 'danger', 'warning', 'success'],
      searchForm: {
        dataType: {
          id: ''
        },
        dataStatus: '',
        dataName: ''
      },
      dataStatusList: this.$dictUtils.getDictList('STUDY_AUDIT_STATUS'),
      dataTypeTreeData: [],
      selectDataTypeName: '',
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
    SelectTree,
    DataForm,
    DataTypeForm
  },
  activated () {
    this.refreshTree()
    this.refreshList()
  },
  computed: {
    dataStatusMap: function () {
      let dict = new Map()
      this.dataStatusList.forEach(item => {
        dict.set(item.value, item.label)
      })
      return dict
    }
  },
  watch: {},
  methods: {
    filterNode (value, data) {
      if (!value) return true
      return data.name.indexOf(value) !== -1
    },
    refreshTree () {
      this.$http({
        url: `/data/dataType/treeData`,
        method: 'get'
      }).then(({data}) => {
        this.dataTypeTreeData = data.treeData
      })
    },
    handleNodeClick (data) {
      this.searchForm.dataType.id = data.id
      this.refreshList()
    },
    addChildTreeNode (node) {
      this.$refs.dataTypeForm.init('addChild', {id: '', parent: {id: node.id, name: node.name}})
    },
    // 新增
    addTreeNode () {
      this.$refs.dataTypeForm.init('add', {id: '', parent: {id: '', name: ''}})
    },
    // 修改
    editTreeNode (data) {
      this.$refs.dataTypeForm.init('edit', {id: data.id, parent: {id: '', name: ''}})
    },
    delTreeNode (data) {
      this.$confirm(`确定删除所选项吗?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.loading = true
        this.$http({
          url: '/data/dataType/delete',
          method: 'delete',
          params: {'id': data.id}
        }).then(({data}) => {
          if (data && data.success) {
            this.$message.success(data.msg)
            this.loading = false
            this.refreshTree()
            this.refreshList()
          }
        })
      })
    },
    // 获取数据列表
    refreshList () {
      this.loading = true
      this.$http({
        url: '/data/data/list',
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
      this.$refs.dataForm.init('add', '')
    },
    // 修改
    edit (id) {
      id = id || this.dataListSelections.map(item => {
        return item.id
      })[0]
      this.$refs.dataForm.init('edit', id)
    },
    // 查看
    view (id) {
      this.$refs.dataForm.init('view', id)
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
          url: '/data/data/delete',
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
      this.$utils.download('/data/data/import/template')
    },
    exportExcel () {
      let params = {
        ...this.searchForm
      }
      this.$utils.download('/data/data/export', params)
    },
    resetSearch () {
      this.$refs.searchForm.resetFields()
      this.refreshList()
    }
  }
}
</script>
