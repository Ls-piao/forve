<template>
  <div class="container">
    <div class="page-header">
      <el-form class="searchbox" :inline="true">
        <el-form-item>
          <el-input placeholder="标题" v-model="outParams.title" size="mini"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input placeholder="发布者" v-model="outParams.create_by" size="mini"></el-input>
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
          class="checkbtn"
          size="mini"
          icon="el-icon-check"
          @click="handleBatch(selectedData)"
          >批量审核</el-button
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
    <batchDialog ref="batchDialog" />
  </div>
</template>

<script>
import viewDialog from './view.vue'

import { cloneDeep } from 'lodash'
import batchDialog from './batchDialog.vue'
export default {
  name: '',
  components: {
    viewDialog,
    batchDialog
  },
  props: {},
  data () {
    return {
      searchParams: {
        id: '',
        name: ''
      },
      tableColumnNames: [
        'message_id',
        'message_title',
        'message_content',
        'message_file',
        'message_user',
        'message_control'
      ],
      outParams: {
        id: '',
        name: ''
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
        url: '/hby/xxgl/xxgl/list',
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

    handleBatch (scope) {
      if (scope instanceof Array) {
      } else {
        scope = [scope]
      }
      if (scope.length === 0) {
        this.$alert('请选择需要审核的数据', '错误提示', { type: 'error' })
        return
      }
      this.$refs.batchDialog.init(scope)
    },
    view (v) {
      this.$refs.viewDialog.init(v)
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
  color: #fff;
  background: rgba(0, 212, 192, 1);
  border: 0;
  margin-bottom: 8px;
  cursor: pointer;
}

.checkbtn:hover {
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
/deep/ .img {
  width: 40px;
  height: 40px;
  object-fit: cover;
}
</style>
