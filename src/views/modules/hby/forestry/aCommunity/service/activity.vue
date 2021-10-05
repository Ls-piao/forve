<template>
  <div class="container">
    <div class="page-header">
      <el-form class="searchbox" :inline="true">
        <el-form-item>
          <el-input placeholder="活动名称" v-model="outParams.hdname" size="mini"></el-input>
        </el-form-item>
      </el-form>
      <div style="line-height: 2.2">
        <el-button
          @click="doSearch"
          size="mini"
          icon="el-icon-search"
          type="primary"
          >查询</el-button
        >
        <el-button @click="reset" size="mini" icon="el-icon-refresh"
          >重置</el-button
        >
      </div>
    </div>
    <div class="tableBox">
      <div class="listbar">
        <el-radio-group v-model="showType" size="mini" class="chose">
          <el-radio-button size="mini" label="all">全部</el-radio-button>
          <el-radio-button size="mini" label="selected"
            >选中({{ selectedData.length }})</el-radio-button
          >
        </el-radio-group>
        <el-button
          class="checkbtn-add"
          type="default"
          size="mini"
          icon="el-icon-plus"
          @click="add(selectedData)"
          >新增</el-button
        >
           <el-button
          class="checkbtn"
          type="danger"
          size="mini"
          icon="el-icon-delete"
          @click="handleDelete(selectedData)"
          >批量删除</el-button
        >
      </div>

      <MyTable
        class="tables"
        ref="table"
        :columnNames="tableColumnNames"
        :fetchFun="tableFetchFun"
        :outParams="outParams"
        :selections="true"
        :showType="showType"
        :isSort="false"
        :limit="15"
        @selectedDataChange="selectedDataChange"
        rowKey="id"
      ></MyTable>
    </div>
    <viewDialog ref="viewDialog" />
    <addDialog ref="addDialog" />
    <previewDialog ref="previewDialog" />
  </div>
</template>

<script>
import { cloneDeep } from 'lodash'
import addDialog from './addActivity.vue'
import viewDialog from './viewActivity.vue'
import previewDialog from './preview'
export default {
  name: '',
  components: {
    addDialog,
    viewDialog,
    previewDialog
  },
  props: {},
  data () {
    return {
      searchParams: {
        hdname: ''
      },
      tableColumnNames: [
        'service_id',
        'service_title',
        'service_avatar',
        'service_type',
        'service_tip',
        'shop_control'
      ],
      outParams: {
        hdname: ''
      },
      showType: 'all', // 表格显示数据类型
      selectedData: [] // 选中表格数据
    }
  },
  computed: {
    tableFetchFun () {
      return this.initData
    }
  },
  watch: {},
  created () {},
  mounted () {},
  methods: {
    initData () {
      return this.$http({
        url: '/hby/sqfw/sqfw/list',
        params: this.outParams
      })
    },
    selectedDataChange (val) {
      this.selectedData = val
    },
    doSearch () {
      this.$refs.table.initData()
    },
    reset () {
      this.outParams = cloneDeep(this.searchParams)
      this.$refs.table.initData()
    },
    // 导入
    uploadSuccess (res, file) {
      if (res.success) {
        this.$message.success({dangerouslyUseHTMLString: true,
          message: res.msg})
        this.$refs.table.initData()
      } else {
        this.$message.error(res.msg)
      }
    },
    exportData () {
      this.$http({
        method: 'get',
        url: '/hby/sqfw/sqfw/export',
        responseType: 'blob'
      }).then(response => {
        if (!response) {
          return
        }
        let link = document.createElement('a')
        link.href = window.URL.createObjectURL(new Blob([response.data]))
        link.target = '_blank'
        let filename = response.headers['content-disposition']
        link.download = decodeURI(filename)
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
         // eslint-disable-next-line handle-callback-err
      }).catch((error) => {

      })
    },
    dels (items) {
      let ids = items.map(v => v.id).join(',')
      this.$http
        .delete('/hby/sqfw/sqfw/delete', {
          params: { ids }
        })
        .then(({ data }) => {
          if (data.code === 200) {
            this.$message.success('操作成功')
            this.$refs.table.initData() // 刷新表格
          }
        })
    },
    handleDelete (scope) {
      if (scope instanceof Array) {
      } else {
        scope = [scope]
      }
      if (scope.length === 0) {
        this.$alert('请选择需要删除的数据', '错误提示', { type: 'error' })
        return
      }
      this.$confirm('确认删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.dels(scope)
        })
        .catch(() => {})
    },
    add () {
      this.$refs.addDialog.init('add')
    },
    edit (v) {
      this.$refs.addDialog.init('edit', v)
    },
    view (v) {
      this.$refs.viewDialog.init(v)
    },
    preview (v, prop) {
      this.$refs.previewDialog.init(v, prop)
    }
  }
}
</script>
<style lang="less">
.searchbox {
  .el-form-item {
    display: flex;
    margin-right: 8px;
    margin-bottom: 0;
  }
}
.videoBox {
  .el-dialog__header {
    border-bottom: 0;
    background: #f5f5f7;
  }
  .el-dialog__body {
    padding: 0 !important;
  }
}
</style>
<style scoped lang="less">
.container {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
}
.icon {
  font-size: 14px;
}
.chose {
  margin-right: 8px;
}
.checkbtn {
  border: 0;
  margin-bottom: 8px;
  cursor: pointer;
}
.checkbtn-add {
  color: #fff;
  background: rgba(0, 212, 192, 1);
  border: 0;
  margin-bottom: 8px;
  cursor: pointer;
}
.checkbtn-add:hover {
  color: #fff;
  background: rgba(0, 212, 192, 0.8);
}
.searchbox {
  display: flex;
  align-items: center;
}
.page-header {
  position: relative;
  margin-bottom: 12px;
  background-color: #fff;
  min-height: 42px;
  box-sizing: border-box;
  padding: 8px;
  border-left: #127efc 4px solid;
  display: flex;
  .el-input,
  .el-cascader,
  .el-date-editor,
  .el-select {
    margin-right: 12px;
    width: 100%;
  }
}
.tableBox {
  background-color: #fff;
  padding: 10px;
  box-sizing: border-box;
  flex: 1;
}
.tables {
  height: 84%;
}
.tableBox tbody tr {
  height: 40px;
  line-height: 40px;
}

/deep/.opt-edit {
  display: inline-block;
  padding: 0 6px;
  background: #e6f2ff;
  color: #007cff;
  border-radius: 2px;
  cursor: pointer;
}

/deep/.opt-edit:hover {
  background: #cce5ff;
}

/deep/.opt-del {
  display: inline-block;
  padding: 0 6px;
  background: #fce9e9;
  color: #f04864;
  border-radius: 2px;
  margin-left: 10px;
  cursor: pointer;
}

/deep/.opt-del:hover {
  background: #f3cfd2;
}
/deep/.opt-view {
  margin-right: 10px;
  display: inline-block;
  padding: 0 6px;
  background: rgba(0, 212, 192, 0.5);
  color: #fff;
  border-radius: 2px;
  margin-left: 10px;
  cursor: pointer;
}

/deep/.opt-view:hover {
  background: rgba(0, 212, 192, 0.8);
}
/deep/ .img{
  width: 40px;
  height: 40px;
  object-fit: cover;
}
</style>
