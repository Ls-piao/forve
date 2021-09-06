<template>
    <div class="page">
      <el-form size="small" :inline="true" class="query-form" ref="searchForm" :model="searchForm" @keyup.enter.native="refreshList()" @submit.native.prevent>
            <!-- 搜索框-->
         <el-form-item prop="name">
                <el-input size="small" v-model="searchForm.name" placeholder="发言信息" clearable></el-input>
         </el-form-item>
         <el-form-item prop="createBy.id">
                <el-input size="small" v-model="searchForm.createBy.name" placeholder="发言人" clearable></el-input>
         </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="refreshList()" size="small" icon="el-icon-search">查询</el-button>
            <el-button @click="resetSearch()" size="small" icon="el-icon-refresh-right">重置</el-button>
          </el-form-item>
      </el-form>
    <div class="bg-white top">
    <vxe-toolbar :refresh="{query: refreshList}" >
      <template #buttons>
          <el-row>
            <el-button type="primary" size="small" icon="el-icon-plus" @click="add()">发言</el-button>
          </el-row>
      </template>
    </vxe-toolbar>
    <div style="height: 500px">
      <vxe-table
        resizable
        ref="xzfy"
        border="inner"
        auto-resize
        height="auto"
        row-id="id"
        size="small"
        show-header-overflow
        show-overflow
        highlight-hover-row
        :print-config="{}"
        :export-config="{}"
        :tree-config="{}"
        :loading="loading"
        :checkbox-config="{checkStrictly: false}"
        :data="dataList">
      <vxe-table-column width="0px"> </vxe-table-column>
    <vxe-table-column
        field="name"
        align="left"
        tree-node 
        title="发言信息">
      </vxe-table-column>
    <vxe-table-column
        field="createBy.name"
        align="right"
        title="发言人">
      </vxe-table-column>
      <vxe-table-column title="操作" width="300px" fixed="right" align="center">
        <template  slot-scope="scope">
          <el-button type="text" size="small" icon="el-icon-view" @click="view(scope.row.id)">查看</el-button>
          <!-- <el-button type="text" size="small" icon="el-icon-edit" @click="edit(scope.row.id)">修改</el-button>
          <el-button type="text" size="small" icon="el-icon-delete" @click="del(scope.row.id)">删除</el-button> -->
          <el-button type="text" size="small" icon="el-icon-circle-plus-outline" @click="addChild(scope.row.id, scope.row.name)">回复</el-button>
        </template>
      </vxe-table-column>
    </vxe-table>
    </div>
    </div>
        <!-- 弹窗, 新增 / 修改 -->
    <XzfyForm  ref="xzfyForm" @refreshDataList="refreshList"></XzfyForm>
  </div>
</template>

<script>
  import XzfyForm from './XzfyForm'
  import XEUtils from 'xe-utils'
  export default {
    data () {
      return {
        xzId: '',
        searchForm: {
          name: '',
          createBy: {
            id: '',
            name: ''
          }
        },
        dataList: [],
        loading: false
      }
    },
    components: {
      XzfyForm
    },
    activated () {
      this.refreshList()
    },

    methods: {
      // 获取数据列表
      refreshList () {
        this.loading = true
        this.$http({
          url: '/xzgl/xzfy/xzfy/treeData?xz.id=' + this.xzId,
          method: 'get'
        }).then(({data}) => {
          this.dataList = data.treeData
          this.handleSearch()
          this.loading = false
        })
      },
      handleSearch () {
        let options = { children: 'children' }
        let searchProps = ['name', 'createBy.name']
        this.dataList = XEUtils.searchTree(this.dataList, item => searchProps.every(key => XEUtils.toValueString(this.searchForm[key]).trim() === '' || XEUtils.toValueString(item[key]).indexOf(this.searchForm[key]) > -1), options)
        this.$nextTick(() => {
          this.$refs.xzfy.setAllTreeExpand(true)
        })
      },
      resetSearch () {
        this.$refs.searchForm.resetFields()
        this.refreshList()
      },
        // 新增下级
      addChild (id, name) {
        this.$refs.xzfyForm.init('addChild', {id: '', parent: {id: id, name: name, xzId: this.xzId}})
      },
       // 新增
      add () {
        this.$refs.xzfyForm.init('add', {id: '', parent: {id: '0', name: '', xzId: this.xzId}})
      },
      // 修改
      edit (id) {
        this.$refs.xzfyForm.init('edit', {id: id, parent: {id: '', name: '', xzId: this.xzId}})
      },
      // 查看
      view (id) {
        this.$refs.xzfyForm.init('view', {id: id, parent: {id: '', name: '', xzId: this.xzId}})
      },
      // 删除
      del (id) {
        let ids = id || this.$refs.xzfy.getCheckboxRecords().map(item => {
          return item.id
        }).join(',')
        this.$confirm(`确定删除所选项吗?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.loading = true
          this.$http({
            url: '/xzgl/xzfy/xzfy/delete',
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
      }
    }
  }
</script>