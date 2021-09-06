<template>
    <div class="jp-common-layout page">
      <div class="jp-common-layout-left">
        <div class="jp-common-title"> 
          <el-row :gutter="5">
            <el-col :span="24">
              <el-input
                placeholder="输入关键字进行过滤"
                size="small"
                v-model="filterText">
              </el-input>
            </el-col>
            
          </el-row>
        </div>
        <div class="jp-common-el-tree-scrollbar el-scrollbar">
        <div class="el-scrollbar__wrap">
          <div class="el-scrollbar__view">
              <el-tree
                class="filter-tree"
                :data="wjlbTreeData"
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
                ref="wjlbTree">
                   <!-- <span class="custom-tree-node" slot-scope="{ node, data}">
                    <span>{{ node.label }}</span>
                    <span>
                       <el-button type="text" class="tree-item-button" icon="el-icon-plus" @click="() => addChildTreeNode(data)">
                       </el-button>
                        <el-button type="text" class="tree-item-button" icon="el-icon-edit-outline" @click="() => editTreeNode(data)">
                       </el-button>
                        <el-button type="text" class="tree-item-button" icon="el-icon-delete" @click="() => delTreeNode(data)">
                       </el-button>
                    </span>
                  </span> -->
              </el-tree>
         </div>
        </div>
      </div>
    </div>
    <div class="jp-common-layout-center jp-flex-main">
    <el-form :inline="true" size="small" class="query-form" ref="searchForm" :model="searchForm" @keyup.enter.native="refreshList()" @submit.native.prevent>
    <!-- 搜索框-->
    <el-form-item prop="lbId.id">
    <SelectTree
                      ref="lb"
                      :props="{
                          value: 'id',             // ID字段名
                          label: 'name',         // 显示名称
                          children: 'children'    // 子级字段名
                        }"
                      size="small"
                      url="/wjgl/wjgl/wjlb/treeData"
                      :value="searchForm.lbId.id"
                      :clearable="true"
                      :accordion="true"
                      @getValue="(value) => {searchForm.lbId.id=value}"/>
         </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="refreshList()" size="small" icon="el-icon-search">查询</el-button>
            <el-button @click="resetSearch()" size="small" icon="el-icon-refresh-right">重置</el-button>
          </el-form-item>
      </el-form>
      <div class="bg-white top">
      <el-row>
        <!-- <el-button type="warning" size="small" icon="el-icon-edit-outline" @click="edit()"
         :disabled="dataListSelections.length != 1" plain>修改</el-button> -->
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
        prop="fileName"
        show-overflow-tooltip
        sortable="custom"
        label="文件名称">
            <template slot-scope="scope">
              <el-link  type="primary" :underline="false"  @click="view(scope.row.id)">{{scope.row.fileName}}</el-link>
            </template>
      </el-table-column>
    <el-table-column
        prop="filePostfix"
        show-overflow-tooltip
        sortable="custom"
        label="文件后缀">
      </el-table-column>
    <el-table-column
        prop="fileType"
        show-overflow-tooltip
        sortable="custom"
        label="文件类型">
        <!-- <template slot-scope="scope">
          {{$dictUtils.getDictLabel("file_type", scope.row.fileType, "")}}
        </template> -->
      </el-table-column>
      <el-table-column
        prop="lbId.name"
        show-overflow-tooltip
        sortable="custom"
        label="文件类别">
      </el-table-column>
      <el-table-column
        prop="state"
        label="状态">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.state === '0'" size="small">待审核</el-tag>
          <el-tag v-else-if="scope.row.state === '1'" size="small">待归档</el-tag>
          <el-tag v-else-if="scope.row.state === '2'" size="small" type="danger">审核退回</el-tag>
          <el-tag v-else-if="scope.row.state === '3'" size="small" type="success">已归档</el-tag>
        </template>
      </el-table-column>
    <el-table-column
        prop="lev"
        show-overflow-tooltip
        sortable="custom"
        label="文件秘密级别">
      </el-table-column>
      <el-table-column
        header-align="center"
        align="center"
        fixed="right"
        :key="Math.random()"
        width="200"
        label="操作">
        <template  slot-scope="scope">
          <el-button type="text" icon="el-icon-view" size="small" @click="view(scope.row.id)">查看</el-button>
          <!-- <el-button type="text" icon="el-icon-edit" size="small" @click="edit(scope.row.id)">修改</el-button> -->
          <el-button type="text" icon="el-icon-download" size="small" @click="sonAccessory(scope.row.path)">下载</el-button>
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
        <!-- 弹窗, 新增 / 修改 -->
    <WjjbxxForm  ref="wjjbxxForm" @refreshDataList="refreshList"></WjjbxxForm>
    </div>
    </div>
</template>

<script>
  import WjjbxxForm from '../wjxx/WjjbxxForm'
  import SelectTree from '@/components/treeSelect/treeSelect.vue'
  export default {
    data () {
      return {
        fileUrlArra: [],
        accessoryDialog: false,
        accessoryTitle: '附件下载',
        visible: true,
        searchForm: {
          lbId: {
            id: ''
          }
        },
        filterText: '',
        wjlbTreeData: [],
        selectWjlbName: '',
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
      WjjbxxForm
    },
    activated () {
      this.refreshTree()
      this.refreshList()
    },
    computed: {
    },
    watch: {
      filterText (val) {
        this.$refs.wjlbTree.filter(val)
      }
    },
    methods: {
      filterNode (value, data) {
        if (!value) return true
        return data.name.indexOf(value) !== -1
      },
      refreshTree () {
        this.$http({
          url: `/wjgl/wjgl/wjlb/treeData`,
          method: 'get'
        }).then(({data}) => {
          this.wjlbTreeData = data.treeData
        })
      },
      handleNodeClick (data) {
        this.searchForm.lbId.id = data.id
        this.refreshList()
      },
      addChildTreeNode (node) {
        this.$refs.wjlbForm.init('addChild', {id: '', parent: {id: node.id, name: node.name}})
      },
       // 新增
      addTreeNode () {
        this.$refs.wjlbForm.init('add', {id: '', parent: {id: '', name: ''}})
      },
      // 修改
      editTreeNode (data) {
        this.$refs.wjlbForm.init('edit', {id: data.id, parent: {id: '', name: ''}})
      },
      // 附件查看
      sonAccessory (url) {
        this.accessoryDialog = true
        this.fileUrlArra = []
        url.split('|').forEach((item) => {
          if (item.trim().length > 0) {
            this.fileUrlArra.push({name: decodeURIComponent(item.substring(item.lastIndexOf('/') + 1)), url: item})
          }
        })
      },
      delTreeNode (data) {
        this.$confirm(`确定删除所选项吗?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.loading = true
          this.$http({
            url: '/wjgl/wjlb/delete',
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
          url: '/filemanage/wjxx/wjjbxx/listView?state=2',
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
        this.$refs.wjjbxxForm.init('add', '')
      },
      // 修改
      edit (id) {
        id = id || this.dataListSelections.map(item => {
          return item.id
        })[0]
        this.$refs.wjjbxxForm.init('edit', id)
      },
      // 查看
      view (id) {
        this.$refs.wjjbxxForm.init('view', id)
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
            url: '/wjgl/wjjbxx/delete',
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
        this.$utils.download('/wjgl/wjjbxx/import/template')
      },
      exportExcel () {
        let params = {
          ...this.searchForm
        }
        this.$utils.download('/wjgl/wjjbxx/export', params)
      },
      resetSearch () {
        this.$refs.searchForm.resetFields()
        this.filterText = ''
        this.$refs.wjlbTree.setCurrentKey(null)
        this.refreshList()
      }
    }
  }
</script>