// 保护名录
<template>
  <div class="container">
    <div class="page-header">
      <el-select
        size="mini"
        v-model="outParams.dangerType"
        placeholder="选择受灾类型"
      >
        <el-option
          v-for="v in dangerConfig"
          :key="v.value"
          :label="v.label"
          :value="v.value"
        ></el-option>
      </el-select>
        <el-date-picker
          v-model="outParams.year"
           placeholder="选择年度"
          type="year"
          size="mini"
          format="yyyy"
          value-format="yyyy"
        >
        </el-date-picker>
      <el-date-picker
       placeholder="选择月份"
        size="mini"
        v-model="outParams.month"
        type="month"
      >
      </el-date-picker>
      <el-input
        size="mini"
        type="number"
        placeholder="输入受灾面积"
        v-model="outParams.DisasterArea"
      ></el-input>
      <el-button
        @click="doSearch"
        icon="el-icon-search"
        type="primary"
        size="mini"
        >查询</el-button
      >
      <el-button @click="reset" icon="el-icon-refresh" size="mini"
        >重置</el-button
      >
    </div>
    <div class="tableBox">
      <div class="listbar">
        <el-button
          class="checkbtn"
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="add"
          >新增</el-button
        >
        <!-- <el-radio-group v-model="showType" size="mini" class="fl mr10">
            <el-radio-button size="mini" label="all">全部</el-radio-button>
            <el-radio-button size="mini" label="selected"
              >选中({{ selectedData.length }})</el-radio-button
            >
          </el-radio-group> -->
      </div>
      <MyTable
        class="tables"
        ref="table"
        :outerData="tableData"
        :fetchFun="tableFetchFun"
        :columnNames="tableColumnNames"
        :outParams="outParams"
        :selections="false"
        :showType="showType"
        :limit="15"
        @selectedDataChange="selectedDataChange"
        rowKey="id"
      ></MyTable>
    </div>
    <preview ref="preview" />
  </div>
</template>

<script>
import animateInteger from '../components/animate-integer/index.vue'
import tableData from './data.json'
import { cloneDeep } from 'lodash'
import preview from '../components/preview'
export default {
  name: '',
  components: {
    animateInteger,
    preview
  },
  props: {},
  data () {
    return {
      checkAll: false,
      checkValues: [],
      isIndeterminate: true,
      show: false,
      searchParams: {
        dangerType: '',
        startYear: '',
        endYear: '',
        month: '',
        DisasterArea: '',
        light: '',
        middle: '',
        height: ''
      },
      dangerConfig: [
        { label: '森林火灾', value: 1 },
        { label: '病虫害', value: 2 },
        { label: '野生动物疫源疾病', value: 3 },
        { label: '有害植物入侵', value: 4 }
      ],
      degreeConfig: [
        { label: '轻度', value: 1 },
        { label: '中度', value: 2 },
        { label: '重度', value: 3 }
      ],
      /**
       * 表格相关
       */
      tableData,
      tableColumnNames: [
        'forest_house',
        'forest_picId',
        'forest_dangerType',
        'forest_year',
        'forest_month',
        'forest_MonitorArea',
        'forest_DisasterArea',
        'forest_light',
        'forest_middle',
        'forest_height',
        'forest_location',
        'forest_prospect',
        'forest_close',
        'control_edit_del'
      ],
      outParams: {
        dangerType: '',
        startYear: '',
        endYear: '',
        month: '',
        DisasterArea: '',
        light: '',
        middle: '',
        height: ''
      },
      showType: 'all', // 表格显示数据类型
      selectedData: [] // 选中表格数据
      /**
       * 表格结束
       */
    }
  },
  computed: {
    tableFetchFun () {

    }
  },
  watch: {},
  created () {},
  mounted () {},
  methods: {
    check (val) {
      let checkedCount = val.length
      this.checkAll = checkedCount === this.degreeConfig.length
      this.isIndeterminate =
        checkedCount > 0 && checkedCount < this.degreeConfig.length
    },
    choseAll (val) {
      this.checkValues = val ? this.degreeConfig : []
      this.isIndeterminate = false
    },
    selectedDataChange (val) {
      this.selectedData = val
    },
    handleSearch () {
      this.$refs.table.page = 1
      this.$refs.table.initData()
    },
    handleDelete (scope) {
      this.$confirm('确认删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.deleteCommit(scope)
        })
        .catch(() => {})
    },
    // 删除
    async deleteCommit (scope) {
      let i = this.tableData.findIndex((v) => v.ID === scope.ID)
      this.tableData.splice(i, 1)
      this.$message.success('操作成功')
      this.$refs.table.initData() // 刷新表格
    },
    // 新增编辑
    add () {
      this.$router.push('/aMyPage/ForestryPests/import')
    },
    // 编辑
    editDialog (scope) {
      this.$router.push('/aMyPage/ForestryPests/import?id=' + scope.ID)
    },
    // 查看详情
    // 充值
    reset () {
      this.outParams = cloneDeep(this.searchParams)
      this.$refs.table.table()
    },
    doSearch () {
      this.show = true
      this.$refs.table.table()
    },
    preview (v, prop) {
      this.$refs.preview.init(v, prop)
    }
  }
}
</script>

<style scoped lang="less">
.tableBox {
  margin-top: 10px;
  background-color: #fff;
  padding: 10px;
  box-sizing: border-box;
  width: 100%;
  flex:1
}
.tableBox tbody tr {
  height: 40px;
  line-height: 40px;
}
.container {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
 
}
.page-header {
  position: relative;
  margin-bottom: 12px;
  background-color: #fff;
  min-height: 30px;
  box-sizing: border-box;
  border-left: #127efc 4px solid;
  padding: 8px;
  display: flex;
  .el-input,
  .el-cascader,
  .el-date-editor,
  .el-select {
    margin-right: 12px;
    width: 100%;
  }
}

.checkbtn {
  background-color: rgba(0, 212, 192, 1);
  border: 0;
  margin-bottom: 8px;
  margin-right: 8px;
  cursor: pointer;
}

.checkbtn:hover {
  background: #47dfd0;
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
/deep/ .img{
  width: 40px;
  height: 40px;
  object-fit: cover;
}
</style>
