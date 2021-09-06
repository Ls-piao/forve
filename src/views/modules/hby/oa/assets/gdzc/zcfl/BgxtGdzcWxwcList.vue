<template>
    <div class="jp-common-layout page">
      <div class="jp-common-layout-left">
        <div class="jp-common-title">
          <el-row :gutter="5">
            <el-col :span="20">
              <el-input
                placeholder="输入关键字进行过滤"
                size="small"
                v-model="filterText">
              </el-input>
            </el-col>
<!--            <el-col :span="4">
                <el-button type="primary" @click="addTreeNode" size="small" icon="el-icon-plus" circle></el-button>
            </el-col>-->
          </el-row>
        </div>
        <div class="jp-common-el-tree-scrollbar el-scrollbar">
        <div class="el-scrollbar__wrap">
          <div class="el-scrollbar__view">
              <el-tree
                class="filter-tree"
                :data="bgxtGdzcSortTreeData"
                :props="{
                      value: 'id',             // ID字段名
                      label: 'name',         // 显示名称
                      children: 'children'    // 子级字段名
                    }"
                default-expand-all
                highlight-current
                node-key="id"
                :filter-node-method="filterNode"
                :expand-on-click-node="false"
                @node-click="handleNodeClick"
                ref="bgxtGdzcSortTree">
                   <span class="custom-tree-node" slot-scope="{ node, data}">
                    <span>{{ node.label }}</span>
<!--                    <span>
                       <el-button type="text" class="tree-item-button" icon="el-icon-plus" @click="() => addChildTreeNode(data)">
                       </el-button>
                        <el-button type="text" class="tree-item-button" icon="el-icon-edit-outline" @click="() => editTreeNode(data)">
                       </el-button>
                        <el-button type="text" class="tree-item-button" icon="el-icon-delete" @click="() => delTreeNode(data)">
                       </el-button>
                    </span>-->
                  </span>
              </el-tree>
         </div>
        </div>
      </div>
    </div>
    <div class="jp-common-layout-center jp-flex-main">
      <el-form :inline="true" size="small" class="query-form" ref="searchForm" :model="searchForm" @keyup.enter.native="refreshList()" @submit.native.prevent>
            <!-- 搜索框-->
         <el-form-item prop="name" label="资产名称">
                <el-input size="small" v-model="searchForm.name" placeholder="资产名称" clearable></el-input>
         </el-form-item>
         <el-form-item prop="typeNo.id" label="类别">
              <SelectTree
                                ref="typeNo"
                                :props="{
                                    value: 'id',             // ID字段名
                                    label: 'name',         // 显示名称
                                    children: 'children'    // 子级字段名
                                  }"
                                size="small"
                                url="/zcfl/bgxtGdzcSort/treeData"
                                :value="searchForm.typeNo.id"
                                :clearable="true"
                                :accordion="true"
                                @getValue="(value) => {searchForm.typeNo.id=value}"/>
         </el-form-item>
        <template v-if="toggleSearchStatus">
          <el-form-item prop="serialNumber" label="序列号">
            <el-input size="small" v-model="searchForm.serialNumber" placeholder="序列号" clearable></el-input>
          </el-form-item>
         <el-form-item prop="brand" label="品牌">
                <el-input size="small" v-model="searchForm.brand" placeholder="品牌" clearable></el-input>
         </el-form-item>
          <el-form-item prop="state" label="资产状态">
            <el-select size="small" v-model="searchForm.state" placeholder="请选择"  style="width: 100%;">
              <el-option
                v-for="item in $dictUtils.getDictList('zczt')"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </template>
          <el-form-item>
            <el-button type="primary" @click="refreshList()" size="small" icon="el-icon-search">查询</el-button>
            <el-button @click="resetSearch()" size="small" icon="el-icon-refresh-right">重置</el-button>
            <a @click="handleToggleSearch" style="margin-left: 8px">
              {{ toggleSearchStatus ? '收起' : '展开' }}
              <i :class="toggleSearchStatus ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"/>
            </a>
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
                  :action="`${this.$http.BASE_URL}/zcfl/bgxtGdzcInfo/import`"
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
        <!--      <el-button v-if="hasPermission('zcfl:bgxtGdzcInfo:add')" type="primary" size="small" icon="el-icon-plus" @click="add()">新建</el-button>
            <el-button v-if="hasPermission('zcfl:bgxtGdzcInfo:edit')" type="warning" size="small" icon="el-icon-edit-outline" @click="edit()"
              :disabled="dataListSelections.length != 1" plain>修改</el-button>-->
<!--        <el-button v-if="hasPermission('zcfl:bgxtGdzcInfo:del')" type="danger"   size="small" icon="el-icon-delete" @click="del()"
                  :disabled="dataListSelections.length <= 0" plain>删除
        </el-button>-->
        <el-button-group class="pull-right">
<!--            <el-button v-if="hasPermission('zcfl:bgxtGdzcInfo:import')" type="default" size="small" icon="el-icon-upload2" title="导入" @click="isImportCollapse = !isImportCollapse"></el-button>-->
            <el-button v-if="hasPermission('zcfl:bgxtGdzcInfo:export')" type="default" size="small" icon="el-icon-download" title="导出" @click="exportExcel()"></el-button>
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
          <el-button v-if="hasPermission('zcfl:bgxtGdzcInfo:wxwc') && scope.row.state == '3' " type="text"  icon="el-icon-circle-check" size="small" @click="wxwc(scope.row.id)">维修完成</el-button>
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
    <BgxtGdzcInfoForm  ref="bgxtGdzcInfoForm" @refreshDataList="refreshList"></BgxtGdzcInfoForm>
    <BgxtGdzcSortForm  ref="bgxtGdzcSortForm" @refreshTree="refreshTree"></BgxtGdzcSortForm>
      <DataRecord ref="dataRecord" @refreshDataList="refreshList"></DataRecord>
    </div>
    </div>
</template>

<script>
  import BgxtGdzcInfoForm from './BgxtGdzcInfoForm'
  import BgxtGdzcSortForm from './BgxtGdzcSortForm'
  import SelectTree from '@/components/treeSelect/treeSelect.vue'
  import DataRecord from '@/views/modules/hby/oa/assets/ypgl/ypwh/DataRecord'
export default {
    data () {
      return {
        searchForm: {
          name: '',
          typeNo: {
            id: ''
          },
          state: '3',
          brand: '',
          serialNumber: '',
          id: '',
          createBy: {
            id: this.$store.state.user.id
          },
          responsibilityDept: {
            id: ''
          }
        },
        filterText: '',
        bgxtGdzcSortTreeData: [],
        selectBgxtGdzcSortName: '',
        dataList: [],
        pageNo: 1,
        pageSize: 10,
        total: 0,
        orderBy: '',
        dataListSelections: [],
        isImportCollapse: false,
        loading: false,
        toggleSearchStatus: false
      }
    },
    components: {
      SelectTree,
      BgxtGdzcInfoForm,
      BgxtGdzcSortForm,
      DataRecord
    },
    activated () {
      this.refreshTree()
      this.refreshList()
    },
    computed: {
    },
    watch: {
      filterText (val) {
        this.$refs.bgxtGdzcSortTree.filter(val)
      }
    },
    methods: {
      filterNode (value, data) {
        if (!value) return true
        return data.name.indexOf(value) !== -1
      },
      refreshTree () {
        this.$http({
          url: `/zcfl/bgxtGdzcSort/treeData`,
          method: 'get'
        }).then(({data}) => {
          this.bgxtGdzcSortTreeData = data.treeData
        })
      },
      handleNodeClick (data) {
        this.searchForm.typeNo.id = data.id
        this.refreshList()
      },
      addChildTreeNode (node) {
        this.$refs.bgxtGdzcSortForm.init('addChild', {id: '', parent: {id: node.id, name: node.name}})
      },
       // 新增
      addTreeNode () {
        this.$refs.bgxtGdzcSortForm.init('add', {id: '', parent: {id: '', name: ''}})
      },
      // 修改
      editTreeNode (data) {
        this.$refs.bgxtGdzcSortForm.init('edit', {id: data.id, parent: {id: '', name: ''}})
      },
      delTreeNode (data) {
        this.$confirm(`确定删除所选项吗?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.loading = true
          this.$http({
            url: '/zcfl/bgxtGdzcSort/delete',
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
          url: '/zcfl/bgxtGdzcInfo/list',
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
        if (this.searchForm.typeNo.id === '' || this.searchForm.typeNo.id === undefined) {
          this.$message.error('请先选择一条资产类型')
        } else {
          this.$refs.bgxtGdzcInfoForm.init('add', this.searchForm.typeNo.id)
        }
      },
      // 修改
      edit (id) {
        id = id || this.dataListSelections.map(item => {
          return item.id
        })[0]
        this.$refs.bgxtGdzcInfoForm.init('edit', id)
      },
      // 查看
      view (id) {
        this.$refs.bgxtGdzcInfoForm.init('view', id)
      },
/*      // 借领
      jl (id) {
        this.$refs.bgxtZcjlForm.init('jl', id)
      }, */
      // 审核
      shenhe (id) {
        let shids = id || this.dataListSelections.map(item => {
          return item.id
        }).join(',')
        this.searchForm.id = id
        this.$confirm('确定要审核通过所选资产吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.loading = true
          this.$http({
            url: '/zcfl/bgxtGdzcInfo/update',
            method: 'post',
            params: {'ids': shids}
          }).then(({data}) => {
            if (data && data.success) {
              this.$message.success(data.msg)
              this.refreshList()
            }
            this.loading = false
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
            url: '/zcfl/bgxtGdzcInfo/delete',
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
      // 归还
      gh (id) {
        this.$confirm(`确定归还所选项吗?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.loading = true
          this.$http({
            url: '/zcfl/bgxtGdzcInfo/gh',
            method: 'post',
            params: {'id': id}
          }).then(({data}) => {
            if (data && data.success) {
              this.$message.success(data.msg)
              this.refreshList()
            }
            this.loading = false
          })
        })
      },
      // 维修完成
      wxwc (id) {
        this.$confirm(`确定维修完成吗?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.loading = true
          this.$http({
            url: '/zcfl/bgxtGdzcInfo/wxwc',
            method: 'post',
            params: {'id': id}
          }).then(({data}) => {
            if (data && data.success) {
              this.$message.success(data.msg)
              this.refreshList()
            }
            this.loading = false
          })
        })
      },
      oper (id) {
        this.$refs.dataRecord.refreshList(id)
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
        this.$utils.download('/zcfl/bgxtGdzcInfo/import/template')
      },
      exportExcel () {
        let params = {
          ...this.searchForm
        }
        this.$utils.download('/zcfl/bgxtGdzcInfo/export', params)
      },
      resetSearch () {
        this.$refs.searchForm.resetFields()
        this.filterText = ''
        this.$refs.bgxtGdzcSortTree.setCurrentKey(null)
        this.refreshList()
      },
      handleToggleSearch () {
        this.toggleSearchStatus = !this.toggleSearchStatus
      }
    }
  }
</script>
