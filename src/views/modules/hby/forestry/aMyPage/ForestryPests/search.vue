// 保护名录
<template>
  <div class="container">
    <div class="left">
      <div class="map">
        <img
          src="../images/test.png"
          style="width: 100%; height: 100%; object-fit: cover"
          alt=""
        />
      </div>
      <div class="tableBox" :style="{ height: show ? '40%' : 0 }">
        <div class="listbar" v-if="show">
          <el-button
            class="checkbtn"
            type="primary"
            icon="el-icon-plus"
            size="mini"
            @click="add"
            >新增</el-button
          >
          <el-radio-group v-model="showType" size="mini" class="fl mr10">
            <el-radio-button size="mini" label="all">全部</el-radio-button>
            <el-radio-button size="mini" label="selected"
              >选中({{ selectedData.length }})</el-radio-button
            >
          </el-radio-group>
          <el-button
            @click="show = false"
            size="mini"
            style="float: right"
            icon="el-icon-circle-close"
          >
          </el-button>
        </div>
        <MyTable
          v-if="show"
          class="tables"
          ref="table"
          :fetchFun="tableFetchFun"
          :columnNames="tableColumnNames"
          :outParams="outParams"
          :selections="true"
          :showType="showType"
          :limit="4"
          @selectedDataChange="selectedDataChange"
          rowKey="id"
        ></MyTable>
      </div>
      <el-button
        v-if="!show"
        icon="el-icon-caret-top"
        class="toShow"
        @click="show = true"
      ></el-button>
    </div>
    <div class="right">
      <div class="page-header">
        <el-form label-width="80px">
          <el-form-item label="受灾类型">
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
          </el-form-item>
          <el-form-item label="年度">
            <div style="display: flex">
             <el-date-picker
                v-model="outParams.year"
                type="year"
                size="mini"
                format="yyyy"
                value-format="yyyy"
              >
              </el-date-picker>
           
            </div>
          </el-form-item>
          <el-form-item label="月份">
            <!-- <el-date-picker
              size="mini"
              v-model="outParams.month"
              type="monthrange"
              range-separator="至"
              start-placeholder="开始"
              end-placeholder="结束"
            >
            </el-date-picker> -->
            <el-select v-model="outParams.month" size="mini">
                <el-option v-for="v in 12" :value="v" :label="v" :key="v"></el-option>
              </el-select>
          </el-form-item>
          <el-form-item label="受灾程度">
            <el-checkbox
              :indeterminate="isIndeterminate"
              v-model="checkAll"
              @change="choseAll"
              >全选</el-checkbox
            >
            <div style="margin: 15px 0"></div>
            <el-checkbox-group v-model="checkValues" @change="check">
              <el-checkbox
                v-for="v in degreeConfig"
                :label="v.value"
                :key="v.value"
                >{{ v.label }}</el-checkbox
              >
            </el-checkbox-group>
          </el-form-item>
          <el-form-item label="受灾面积">
            <el-input
              size="mini"
              type="number"
              v-model="outParams.szmj"
            ></el-input>
          </el-form-item>
          <el-form-item>
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
          </el-form-item>
        </el-form>
      </div>
    </div>
    <preview  ref="preview" />
  </div>
</template>

<script>
import animateInteger from '../components/animate-integer/index.vue'
import { cloneDeep } from 'lodash'

import preview from '../components/preview'
import Preview from '../components/preview.vue'
export default {
  name: '',
  components: {
    animateInteger,
    preview,
    Preview
  },
  props: {},
  data () {
    return {
      checkAll: false,
      checkValues: [],
      isIndeterminate: true,
      show: false,
      searchParams: {
        zhtype: '',
        year: '',
        month: '',
        szmj: ''
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
        'forest_del'
      ],
      outParams: {
        zhtype: '',
        year: '',
        month: '',
        szmj: ''
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
      return this.initData
    }
  },
  watch: {},
  created () {},
  mounted () {},
  methods: {
    initData (params) {
      return this.$http({
        url: '/hbylyyh/lyyh/list',
        method: 'get',
        params
      })
    },
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
      this.$http({
        url: '/hbylyyh/lyyh/delete',
        method: 'delete',
        params: {
          ids: scope.id
        }
      }).then(({data}) => {
        if (data.code === 200) {
          this.$message.success('操作成功')
          this.$refs.table.initData() // 刷新表格
        }
      })
      this.$message.success('操作成功')
      this.$refs.table.initData() // 刷新表格
    },
    // 新增编辑
    add () {
      this.$router.push('/hby/forestry/aMyPage/ForestryPests/import')
    },
    // 编辑
    editDialog (scope) {
      this.$router.push('/hby/forestry/aMyPage/ForestryPests/import?id=' + scope.ID)
    },
    // 查看详情
    // 充值
    reset () {
      this.outParams = cloneDeep(this.searchParams)
      this.$refs.table.table()
    },
    doSearch () {
      this.show = true
      this.$refs.table.initData()
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
  overflow: scroll;
  padding: 10px;
  box-sizing: border-box;
  width: 100%;
  height: 50%;
  position: absolute;
  left: 0;
  bottom: 0;
  transition: all 1s;
}
.tables{
    height:75%;
}
.toShow {
  height: 30px;
  position: absolute;
  left: 50%;
  bottom: 0;
  transform: translateX(-50%);
}

.tableBox tbody tr {
  height: 40px;
  line-height: 40px;
}
.container {
  height: 100%;

  width: 100%;
  display: flex;
  .left {
    position: relative;
    width: 79%;
    margin-right: 10px;
    .map {
      width: 100%;
      height: 100%;
    }
  }
  .right {
    flex: 1;
    height: 100%;
    background-color: #fff;
  }
}
.page-header {
  position: relative;
  margin-bottom: 12px;
  background-color: #fff;
  min-height: 30px;
  box-sizing: border-box;
  padding: 8px;
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
  margin-right:8px;
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
