// 保护名录
<template>
  <div class="container">
    <div class="top">
      <div class="top-item">
        <div class="data">
          <div class="left">
            <img src="../images/data1.png" alt />
          </div>
          <div class="right">
            <div class="num"><animateInteger value="95" /></div>
            <div class="label">现有条目</div>
          </div>
        </div>
      </div>
      <div class="top-item">
        <div class="data">
          <div class="left">
            <img src="../images/data2.png" alt />
          </div>
          <div class="right">
            <div class="num"><animateInteger value="10" /></div>
            <div class="label">新增条目</div>
          </div>
        </div>
      </div>
      <div class="top-item">
        <div class="data">
          <div class="left">
            <img src="../images/data4.png" alt />
          </div>
          <div class="right">
            <div class="num"><animateInteger value="5" /></div>
            <div class="label">删除条目</div>
          </div>
        </div>
      </div>
    </div>
    <div class="page-header">
      <el-input
        v-model="outParams.zwzm"
        size="mini"
        placeholder="中文种名"
      ></el-input>
      <el-input
        v-model="outParams.zwkm"
        size="mini"
        placeholder="中文科名"
      ></el-input>
      <el-input
        v-model="outParams.zwsm"
        size="mini"
        placeholder="中文属名"
      ></el-input>
      <el-input
        v-model="outParams.ldzm"
        size="mini"
        placeholder="拉丁种名"
      ></el-input>
      <el-input
        v-model="outParams.ldkm"
        size="mini"
        placeholder="拉丁科名"
      ></el-input>
      <el-input
        v-model="outParams.ldsm"
        size="mini"
        placeholder="拉丁属名"
      ></el-input>
      <el-select
        size="mini"
        v-model="outParams.bwcd"
        placeholder="选择濒临等级"
      >
        <el-option
          v-for="v in dangerConfig"
          :key="v.value"
          :label="v.label"
          :value="v.value"
        ></el-option>
      </el-select>
      <el-select
        size="mini"
        v-model="outParams.bhdj"
        placeholder="选择保护等级"
      >
        <el-option
          v-for="v in protectConfig"
          :key="v.value"
          :label="v.label"
          :value="v.value"
        ></el-option>
      </el-select>
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
      </div>
      <MyTable
        class="tables"
        ref="table"
        :fetchFun="tableFetchFun"
        :columnNames="tableColumnNames"
        :outParams="outParams"
        :selections="false"
        :showType="showType"
        :limit="pageSize"
        @selectedDataChange="selectedDataChange"
        rowKey="id"
      ></MyTable>
    </div>
    <preview ref="preview" />
  </div>
</template>

<script>
import animateInteger from '../components/animate-integer/index.vue'
// import tableData from './data.json'
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
      searchForm: {
        bhdj: '',
        bwcd: '',
        ldsm: '',
        ldkm: '',
        ldzm: '',
        zwzm: '',
        zwkm: '',
        zwsm: ''
      },
      dangerConfig: [
        { label: '近危', value: 0 },
        { label: '易危', value: 1 },
        { label: '濒危', value: 2 }
      ],
      protectConfig: [
        { label: '一级', value: 1 },
        { label: '二级', value: 2 },
        { label: '三级', value: 3 },
        { label: '四级', value: 4 }
      ],
      /**
       * 表格相关
       */
      tableColumnNames: [
        'plants_CNzhong',
        'plants_CNke',
        'plants_CNshu',
        'plants_ENzhong',
        'plants_ENke',
        'plants_ENshu',
        'plants_dangerType',
        'plants_protectType',
        'plants_area',
        'plants_point',
        'plants_place',
        'plants_associated',
        'plants_price',
        'plants_protect',
        'plants_huoben',
        'plants_biaoben',
        'control_edit_del'
      ],
      outParams: {
        bhdj: '',
        bwcd: '',
        ldsm: '',
        ldkm: '',
        ldzm: '',
        zwzm: '',
        zwkm: '',
        zwsm: ''
      },
      showType: 'all', // 表格显示数据类型
      selectedData: [], // 选中表格数据
      /**
       * 表格结束
       */
      pageNo: 1,
      pageSize: 15
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
        url: '/hby/bwsj/list',
        method: 'get',
        params
      })
    },
    selectedDataChange (val) {
      this.selectedData = val
    },
    handleSearch () {
      this.$refs.table.pageNo = 1
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
        url: '/hby/bwsj/delete',
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
    },
    // 新增编辑
    add () {
      this.$router.push('/hby/forestry/aMyPage/plants/import')
    },
    // 编辑
    editDialog (scope) {
      this.$router.push('/hby/forestry/aMyPage/plants/import?id=' + scope.id)
    },
    // 查看详情
    // 充值
    reset () {
      this.outParams = cloneDeep(this.searchForm)
      this.$refs.table.initData()
    },
    doSearch () {
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
  background-color: #fff;
  padding: 10px;
  box-sizing: border-box;
  flex:1
}
.tables{
  height: 84%;
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
.top {
  display: flex;
  margin-bottom: 12px;
  .top-item {
    flex: 1;
    margin-right: 24px;
    padding: 0 20px;
    border-radius: 4px;
    position: relative;
    color: rgb(82, 83, 107);
    background: #fff;
    &:last-child {
      margin-right: 0;
    }
    &::after {
      content: "";
      opacity: 0.1;
      position: absolute;
      top: 0;
      left: 0;
      bottom: 0;
      right: 0;
      background-color: rgba(255, 255, 255, 0.5);
      background-image: url("../images/data1.png");
      background-repeat: no-repeat;
      // background-position;
      background-size: 120px 120px;
      background-position: right 40px;
    }
    &:nth-child(1) {
      color: #fff;
      background-image: linear-gradient(45deg, #39b54a, #8dc63f);

      &::after {
        background-image: url("../images/data1.png");
      }
      .data {
        .left {
          background: url("../images/circle-blue.svg") no-repeat;
        }
      }
      .tip {
        color: rgb(0, 124, 255);
        .tip-num {
          color: rgb(0, 124, 255);
        }
      }
    }
    &:nth-child(2) {
      color: #fff;
      background-image: linear-gradient(45deg, #0081ff, #1cbbb4);

      &::after {
        background-image: url("../images/data2.png");
      }
      .data {
        .left {
          background: url("../images/circle-blue.svg") no-repeat;
        }
      }
    }
    &:nth-child(3) {
      color: #fff;
      background-image: linear-gradient(45deg, #0081ff, #1cbbb4);

      &::after {
        background-image: url("../images/data4.png");
      }
      .data {
        .left {
          background: url("../images/circle-blue.svg") no-repeat;
        }
      }
    }

    .data {
      display: flex;
      margin: 20px 0;
      align-items: center;
      .left {
        border-radius: 50%;
        margin-right: 14px;
        width: 70px;
        height: 70px;
        text-align: center;
        line-height: 70px;
        img {
          width: 30px;
          height: 30px;
        }
      }
      .right {
        .num {
          font-weight: 600;
          margin-bottom: 8px;
          font-size: 32px;
        }
        .label {
          font-size: 18px;
        }
      }
    }
    .tip {
      color: rgb(123, 122, 149);
      .label {
        margin-right: 12px;
      }
      img {
        margin-left: 6px;
        width: 15px;
        height: 15px;
      }
      .tip-num {
        color: rgb(82, 83, 107);
      }
    }
  }
}

.checkbtn {
  background-color: rgba(0, 212, 192, 1);
  border: 0;
  margin-bottom: 8px;
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
