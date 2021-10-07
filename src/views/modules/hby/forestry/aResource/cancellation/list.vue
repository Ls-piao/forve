<template>
  <div class="container">
    <div class="page-header">
      <el-form class="searchbox" :inline="true">
        <el-form-item label="申请单编号">
          <el-input v-model="outParams.cameraId" size="mini"></el-input>
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
        <!-- <el-button
          class="checkbtn"
          type="danger"
          size="mini"
          icon="el-icon-delete"
          @click="handleBatch(selectedData)"
          >批量打印</el-button
        > -->
      </div>

      <MyTable
        class="tables"
        ref="table"
        :outerData="tableData"
        :columnNames="tableColumnNames"
        :outParams="outParams"
        :selections="true"
        :showType="showType"
        :limit="15"
        @selectedDataChange="selectedDataChange"
        rowKey="id"
      ></MyTable>
    </div>
    <viewDialog ref="viewDialog" />
  </div>
</template>

<script>
import tableData from '../data.json'
import viewDialog from './viewDialog'
export default {
  name: '',
  components: {
    viewDialog
  },
  props: {},
  data () {
    return {
      searchParams: {
        ID: ''
      },
      tableData: tableData.slice(0, 3),
      tableColumnNames: [
        'apply_ID',
        'apply_qs',
        'apply_createTime',
        'apply_dwgr',
        // 'apply_djql',
        'apply_frdb',
        'apply_txdz',
        'apply_sfzh',
        'apply_ldsyqqlr',
        'apply_ldsyqqlr2',
        'apply_slhlmsyqqlr',
        'apply_slhlmsyqqlr2',
        'cert_control'
      ],
      outParams: {
        ID: ''
      },
      showType: 'all', // 表格显示数据类型
      selectedData: [] // 选中表格数据
    }
  },
  computed: {},
  watch: {},
  created () {},
  mounted () {},
  methods: {
    selectedDataChange (val) {
      this.selectedData = val
    },
    doSearch () {},
    reset () {},
    dels (items) {},
    handleBatch (scope) {
      if (scope instanceof Array) {
      } else {
        scope = [scope]
      }
      if (scope.length === 0) {
        this.$alert('请选择需要打印的数据', '错误提示', { type: 'error' })
        return
      }
      this.print()
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
    transform:perspective
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
.listbar{
  margin-bottom: 10px;;
}
.icon {
  font-size: 14px;
}
.chose {
  margin-right: 8px;
}
.checkbtn {
  background-color: rgba(0, 212, 192, 1);
  border: 0;
  margin-bottom: 8px;
  cursor: pointer;
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
/deep/ .operation {
  &:hover {
    cursor: pointer;
  }
  font-size: 18px;
  margin-right: 8px;
  &:last-child {
    margin-right: 0;
  }
  &.delete {
    color: red;
  }
  &.play {
    color: #3f8ef7;
  }
  &.collected {
    color: #f5ca0b;
  }
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
/deep/.opt-batch {
  display: inline-block;
  padding: 0 6px;
  background: rgba(0, 212, 192, 0.5);
  color: #fff;
  border-radius: 2px;
  margin-left: 10px;
  cursor: pointer;
}

/deep/.opt-batch:hover {
  background: rgba(0, 212, 192, 0.8);
}
</style>
