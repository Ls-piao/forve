<template>
    <div class="page bg-white">
      <el-row>
        <el-button v-if="hasPermission('zxsq:flb:xcBgzxLjfl:add')" type="primary" size="small" icon="el-icon-plus" @click="add()">新建</el-button>
      </el-row>
    <el-treetable
      :data="dataList"
      isBigData
      isTreeTable
      size="medium"
      v-loading = "loading"
      row-key="id"
      class="table treetable">
    <el-treetable-column
        prop="name"
        align="left"
        show-overflow-tooltip
        label="名称">
            <template slot-scope="scope">
              <el-link  type="primary" :underline="false" v-if="hasPermission('zxsq:flb:xcBgzxLjfl:edit')" @click="edit(scope.row.id)">{{scope.row.name}}</el-link>
              <el-link  type="primary" :underline="false" v-else-if="hasPermission('zxsq:flb:xcBgzxLjfl:view')"  @click="view(scope.row.id)">{{scope.row.name}}</el-link>
              <span v-else>{{scope.row.name}}</span>
            </template>
      </el-treetable-column>
    <el-treetable-column
        prop="content"
        show-overflow-tooltip
        label="分类说明">
      </el-treetable-column>
      <el-treetable-column
        header-align="center"
        align="center"
        fixed="right"
        :key="Math.random()"
        width="300"
        label="操作">
        <template  slot-scope="scope">
          <el-button v-if="hasPermission('zxsq:flb:xcBgzxLjfl:view')" type="text" size="small" icon="el-icon-view" @click="view(scope.row.id)">查看</el-button>
          <el-button v-if="hasPermission('zxsq:flb:xcBgzxLjfl:edit')" type="text" size="small" icon="el-icon-edit" @click="edit(scope.row.id)">修改</el-button>
          <el-button v-if="hasPermission('zxsq:flb:xcBgzxLjfl:del')" type="text" size="small" icon="el-icon-delete" @click="del(scope.row.id)">删除</el-button>
          <el-button v-if="hasPermission('zxsq:flb:xcBgzxLjfl:add')" type="text" size="small" icon="el-icon-circle-plus-outline" @click="addChild(scope.row.id, scope.row.name)">添加下级分类管理</el-button>
        </template>
      </el-treetable-column>
    </el-treetable>
        <!-- 弹窗, 新增 / 修改 -->
    <XcBgzxLjflForm  ref="xcBgzxLjflForm" @refreshDataList="refreshList"></XcBgzxLjflForm>
  </div>
</template>

<script>
  import XcBgzxLjflForm from './SortForm'
  export default {
    data () {
      return {
        dataList: [],
        loading: false
      }
    },
    components: {
      XcBgzxLjflForm
    },
    activated () {
      this.refreshList()
    },

    methods: {
      // 获取数据列表
      refreshList () {
        this.loading = true
        this.$http({
          url: '/zxsq/flb/xcBgzxLjfl/treeData?flag=3',
          method: 'get'
        }).then(({data}) => {
          this.dataList = data.treeData
          this.loading = false
        })
      },
        // 新增下级
      addChild (id, name) {
        this.$refs.xcBgzxLjflForm.init('addChild', {id: '', parent: {id: id, name: name}})
      },
       // 新增
      add () {
        this.$refs.xcBgzxLjflForm.init('add', {id: '', parent: {id: '', name: ''}})
      },
      // 修改
      edit (id) {
        this.$refs.xcBgzxLjflForm.init('edit', {id: id, parent: {id: '', name: ''}})
      },
      // 查看
      view (id) {
        this.$refs.xcBgzxLjflForm.init('view', {id: id, parent: {id: '', name: ''}})
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
            url: '/zxsq/flb/xcBgzxLjfl/delete',
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
      }
    }
  }
</script>
