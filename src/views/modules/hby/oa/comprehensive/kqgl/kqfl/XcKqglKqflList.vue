<template>
    <div class="page bg-white">
      <el-row>
        <el-button v-if="hasPermission('xckqglkqfl:xcKqglKqfl:add')" type="primary" size="small" icon="el-icon-plus" @click="add()">新建</el-button>
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
        show-overflow-tooltip
        label="分类名称">
      </el-treetable-column>
    <el-treetable-column
        prop="flState"
        show-overflow-tooltip
        label="分类使用状态">
        <template slot-scope="scope">
          {{ $dictUtils.getDictLabel("FLSYZT", scope.row.flState, '-') }}
        </template>
      </el-treetable-column>
      <el-treetable-column
        header-align="center"
        align="center"
        fixed="right"
        :key="Math.random()"
        width="300"
        label="操作">
        <template  slot-scope="scope">
          <el-button v-if="hasPermission('xckqglkqfl:xcKqglKqfl:view')" type="text" size="small" icon="el-icon-view" @click="view(scope.row.id)">查看</el-button>
          <el-button v-if="hasPermission('xckqglkqfl:xcKqglKqfl:edit') && scope.row.id !== '1'" type="text" size="small" icon="el-icon-edit" @click="edit(scope.row.id)">修改</el-button>
          <el-button v-if="hasPermission('xckqglkqfl:xcKqglKqfl:del') && scope.row.id !== '1'" type="text" size="small" icon="el-icon-delete" @click="del(scope.row.id)">删除</el-button>
          <el-button v-if="hasPermission('xckqglkqfl:xcKqglKqfl:add')" type="text" size="small" icon="el-icon-circle-plus-outline" @click="addChild(scope.row.id, scope.row.name)">添加下级考勤分类</el-button>
        </template>
      </el-treetable-column>
    </el-treetable>
        <!-- 弹窗, 新增 / 修改 -->
    <XcKqglKqflForm  ref="xcKqglKqflForm" @refreshDataList="refreshList"></XcKqglKqflForm>
  </div>
</template>

<script>
  import XcKqglKqflForm from './XcKqglKqflForm'
  import SelectTree from '@/components/treeSelect/treeSelect.vue'
  export default {
    data () {
      return {
        dataList: [],
        loading: false
      }
    },
    components: {
      SelectTree,
      XcKqglKqflForm
    },
    activated () {
      this.refreshList()
    },

    methods: {
      // 获取数据列表
      refreshList () {
        this.loading = true
        this.$http({
          url: '/xckqglkqfl/xcKqglKqfl/treeData',
          method: 'get'
        }).then(({data}) => {
          this.dataList = data.treeData
          this.loading = false
        })
      },
        // 新增下级
      addChild (id, name) {
        this.$refs.xcKqglKqflForm.init('addChild', {id: '', parent: {id: id, name: name}})
      },
       // 新增
      add () {
        this.$refs.xcKqglKqflForm.init('add', {id: '', parent: {id: '', name: ''}})
      },
      // 修改
      edit (id) {
        this.$refs.xcKqglKqflForm.init('edit', {id: id, parent: {id: '', name: ''}})
      },
      // 查看
      view (id) {
        this.$refs.xcKqglKqflForm.init('view', {id: id, parent: {id: '', name: ''}})
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
            url: '/xckqglkqfl/xcKqglKqfl/delete',
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
