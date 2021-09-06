<template>
  <div class="page bg-white">
    <el-form :inline="true" size="small" class="query-form" ref="searchForm" :model="searchForm"
             @keyup.enter.native="refreshList()" @submit.native.prevent>
      <!-- 搜索框-->
      <el-form-item prop="name" label="资料名称">
        <el-input size="small" v-model="searchForm.name" placeholder="资料名称" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="refreshList()" size="small">查询</el-button>
        <el-button @click="resetSearch()" size="small">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row>
      <el-button v-if="hasPermission('datatype:dataType:add')" type="primary" size="small" icon="el-icon-plus"
                 @click="add()">新建
      </el-button>
    </el-row>
    <el-treetable
      :data="dataList"
      isBigData
      isTreeTable
      size="medium"
      v-loading="loading"
      row-key="id"
      class="table treetable">
      <el-treetable-column
        prop="name"
        show-overflow-tooltip
        label="名称">
        <template slot-scope="scope">
          <el-link type="primary" :underline="false" @click="view(scope.row.id)">{{ scope.row.name }}</el-link>
        </template>
      </el-treetable-column>
      <el-table-column
        prop="coverImg"
        show-overflow-tooltip
        sortable="custom"
        label="类型封面">
        <template slot-scope="scope" v-if="scope.row.coverImg">
          <el-image
            style="height: 50px;width:50px;margin-right:10px;"
            :src="src" v-for="(src, index) in scope.row.coverImg.split('|')" :key="index"
            :preview-src-list="scope.row.coverImg.split('|')">
          </el-image>
        </template>
      </el-table-column>
      <el-treetable-column
        header-align="center"
        align="center"
        fixed="right"
        :key="Math.random()"
        width="300"
        label="操作">
        <template slot-scope="scope">
          <el-button v-if="hasPermission('datatype:dataType:view')" type="text" size="small" icon="el-icon-view"
                     @click="view(scope.row.id)">查看
          </el-button>
          <el-button v-if="hasPermission('datatype:dataType:edit')" type="text" size="small" icon="el-icon-edit"
                     @click="edit(scope.row.id)">修改
          </el-button>
          <el-button v-if="hasPermission('datatype:dataType:del')" type="text" size="small" icon="el-icon-delete"
                     @click="del(scope.row.id)">删除
          </el-button>
          <!--
                    <el-button v-if="hasPermission('datatype:dataType:add')" type="text" size="small" icon="el-icon-circle-plus-outline" @click="addChild(scope.row.id, scope.row.name)">添加下级数据类型</el-button>
          -->
        </template>
      </el-treetable-column>
    </el-treetable>
    <!-- 弹窗, 新增 / 修改 -->
    <DataTypeForm ref="dataTypeForm" @refreshDataList="refreshList"></DataTypeForm>
  </div>
</template>

<script>
import DataTypeForm from './DataTypeForm'

export default {
  data () {
    return {
      searchForm: {
        name: ''
      },
      dataList: [],
      loading: false
    }
  },
  components: {
    DataTypeForm
  },
  activated () {
    this.refreshList()
  },

  methods: {
    // 获取数据列表
    refreshList () {
      this.loading = true
      this.$http({
        url: '/data/dataType/treeData',
        method: 'get',
        params: {
          ...this.searchForm
        }
      }).then(({data}) => {
        this.dataList = data.treeData
        this.loading = false
      })
    },
    // 新增下级
    addChild (id, name) {
      this.$refs.dataTypeForm.init('addChild', {id: '', parent: {id: id, name: name}})
    },
    // 新增
    add () {
      this.$refs.dataTypeForm.init('add', {id: '', parent: {id: '', name: ''}})
    },
    // 修改
    edit (id) {
      this.$refs.dataTypeForm.init('edit', {id: id, parent: {id: '', name: ''}})
    },
    // 查看
    view (id) {
      this.$refs.dataTypeForm.init('view', {id: id, parent: {id: '', name: ''}})
    },
    // 删除
    del (id) {
      this.$confirm(`确定删除所选项吗?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.loading = true
        this.$http({
          url: '/data/dataType/delete',
          method: 'delete',
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
    resetSearch () {
      this.$refs.searchForm.resetFields()
      this.refreshList()
    }
  }
}
</script>
