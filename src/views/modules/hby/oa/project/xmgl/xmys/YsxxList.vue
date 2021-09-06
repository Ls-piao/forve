<template>
    <div class="page">
      <el-form size="small" :inline="true" class="query-form" ref="searchForm" :model="searchForm" @keyup.enter.native="refreshList()" @submit.native.prevent>
            <!-- 搜索框-->
         <el-form-item prop="xm.id">
            <GridSelect
                    title="选择项目名称"
                    placeholder="请选择项目名称"
                    labelName = 'xmmc'
                    labelValue = 'id'
                    :value = "searchForm.xm.id"
                    :limit="1"
                    size="small"
                    @getValue='(value) => {searchForm.xm.id=value}'
                    :columns="[
                    {
                      prop: 'xmmc',
                      label: '项目名称'
                    },
                    {
                      prop: 'xmbh',
                      label: '项目编号'
                    },
                    {
                      prop: 'lxdw',
                      label: '立项单位'
                    },
                    {
                      prop: 'lxrq',
                      label: '立项日期'
                    },
                    {
                      prop: 'zfzr.name',
                      label: '总负责人'
                    },
                    {
                      prop: 'xmjl.name',
                      label: '项目经理'
                    }
                    ]"
                    :searchs="[
                    {
                      prop: 'xmmc',
                      label: '项目名称'
                    },
                    {
                      prop: 'xmbh',
                      label: '项目编号'
                    },
                    {
                      prop: 'lxdw',
                      label: '立项单位'
                    },
                    {
                      prop: 'lxrq',
                      label: '立项日期'
                    },
                    {
                      prop: 'xmfl',
                      label: '项目分类'
                    }
                    ]"
                    dataListUrl="/xmgl/xmxx/xmjbxx/list"
                    entityBeanName="xmjbxx"
                    queryEntityUrl="/xmgl/xmxx/xmjbxx/queryById">
                  </GridSelect>
         </el-form-item>
<!--         <el-form-item prop="ysrq">
               <el-date-picker
                    v-model="searchForm.ysrq"
                    type="daterange"
                    size="small"
                    align="right"
                    value-format="yyyy-MM-dd hh:mm:ss"
                    unlink-panels
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期">
                 </el-date-picker>
         </el-form-item>
         <el-form-item prop="yslx">
                  <el-select v-model="searchForm.yslx" placeholder="请选择验收类型" size="small" style="width: 100%;">
                    <el-option
                      v-for="item in $dictUtils.getDictList('XMGL_YSLX')"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
         </el-form-item>
         <el-form-item prop="wdsh">
                <el-checkbox-group
                        v-model="wdshList">
                       <el-checkbox v-for="wdsh in $dictUtils.getDictList('XMGL_YSWD')" :label="wdsh.value" :key="wdsh.value">{{wdsh.label}}</el-checkbox>
                    </el-checkbox-group>
         </el-form-item>
         <el-form-item prop="zjz">
                <el-input size="small" v-model="searchForm.zjz" placeholder="专家组人员" clearable></el-input>
         </el-form-item>
         <el-form-item prop="ysjl">
                <el-input size="small" v-model="searchForm.ysjl" placeholder="验收结论" clearable></el-input>
         </el-form-item>
         <el-form-item prop="ysjg">
                  <el-radio-group v-model="searchForm.ysjg">
                    <el-radio v-for="item in $dictUtils.getDictList('XMGL_YSJG')" :label="item.value" :key="item.value">{{item.label}}</el-radio>
                  </el-radio-group>
         </el-form-item>-->
         <el-form-item prop="ystgdate">
               <el-date-picker
                    v-model="searchForm.ystgdate"
                    type="daterange"
                    size="small"
                    align="right"
                    value-format="yyyy-MM-dd hh:mm:ss"
                    unlink-panels
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期">
                 </el-date-picker>
         </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="refreshList()" size="small" icon="el-icon-search">查询</el-button>
            <el-button @click="resetSearch()" size="small" icon="el-icon-refresh-right">重置</el-button>
          </el-form-item>
      </el-form>
        <!-- 导入导出-->
      <el-dialog  title="导入Excel" :visible.sync="isImportCollapse">
          <el-form size="small" :inline="true" v-show="isImportCollapse"  ref="importForm">
             <el-form-item>
              <el-button type="default" @click="downloadTpl()" size="small">下载模板</el-button>
             </el-form-item>
             <el-form-item prop="loginName">
                <el-upload
                  class="upload-demo"
                  :action="`${this.$http.BASE_URL}/xmgl/xmys/ysxx/import`"
                  :on-success="uploadSuccess"
                   :show-file-list="true">
                  <el-button size="small" type="primary">点击上传</el-button>
                  <div slot="tip" class="el-upload__tip">只允许导入“xls”或“xlsx”格式文件！</div>
                </el-upload>
            </el-form-item>
          </el-form>
      </el-dialog>
      <div class="bg-white top">
      <el-row>
        <el-button v-if="hasPermission('xmgl:xmys:ysxx:add')" type="primary" size="small" icon="el-icon-plus" @click="add()">新建</el-button>
        <el-button v-if="hasPermission('xmgl:xmys:ysxx:edit')" type="warning" size="small" icon="el-icon-edit-outline" @click="edit()"
         :disabled="dataListSelections.length != 1" plain>修改</el-button>
        <el-button v-if="hasPermission('xmgl:xmys:ysxx:del')" type="danger"   size="small" icon="el-icon-delete" @click="del()"
                  :disabled="dataListSelections.length <= 0" plain>删除
        </el-button>
        <el-button-group class="pull-right">
            <el-button v-if="hasPermission('xmgl:xmys:ysxx:import')" type="default" size="small" icon="el-icon-upload2" title="导入" @click="isImportCollapse = !isImportCollapse"></el-button>
            <el-button v-if="hasPermission('xmgl:xmys:ysxx:export')" type="default" size="small" icon="el-icon-download" title="导出" @click="exportExcel()"></el-button>
            <el-button
              type="default"
              size="small"
              icon="el-icon-refresh"
              @click="refreshList">
            </el-button>
        </el-button-group>
      </el-row>
    <el-table
      :data="dataList"
       size="small"
       height="calc(100% - 80px)"
      @selection-change="selectionChangeHandle"
      @sort-change="sortChangeHandle"
      v-loading="loading"
      class="table">
      <el-table-column
        type="selection"
        header-align="center"
        align="center"
        width="50">
      </el-table-column>
      <el-table-column
        prop="xm.xmmc"
        show-overflow-tooltip
        sortable="custom"
        label="项目名称">
            <template slot-scope="scope">
              <el-link  type="primary" :underline="false" v-if="hasPermission('xmgl:xmys:ysxx:edit')" @click="edit(scope.row.id)">{{scope.row.xm.xmmc}}</el-link>
              <el-link  type="primary" :underline="false" v-else-if="hasPermission('xmgl:xmys:ysxx:view')"  @click="view(scope.row.id)">{{scope.row.xm.xmmc}}</el-link>
              <span v-else>{{scope.row.xm.xmmc}}</span>
            </template>
      </el-table-column>
    <el-table-column
        prop="ysrq"
        show-overflow-tooltip
        sortable="custom"
        label="验收日期">
      </el-table-column>
    <el-table-column
        prop="yslx"
        show-overflow-tooltip
        sortable="custom"
        label="验收类型">
        <template slot-scope="scope">
              {{ $dictUtils.getDictLabel("XMGL_YSLX", scope.row.yslx, '-') }}
        </template>
      </el-table-column>
<!--    <el-table-column
        prop="ysnr"
        show-overflow-tooltip
        sortable="custom"
        label="验收内容">
      </el-table-column>-->
    <el-table-column
        prop="wdsh"
        show-overflow-tooltip
        sortable="custom"
        label="文档审核">
        <template slot-scope="scope">
              {{scope.row.wdsh.split(",").map( (item)=> { return $dictUtils.getDictLabel("XMGL_YSWD", item, '-')}).join(",")  }}
        </template>
      </el-table-column>
<!--    <el-table-column
        prop="zjz"
        show-overflow-tooltip
        sortable="custom"
        label="专家组人员">
      </el-table-column>-->
<!--    <el-table-column
        prop="zjyj"
        show-overflow-tooltip
        sortable="custom"
        label="专家组意见">
      </el-table-column>-->
<!--    <el-table-column
        prop="ysjl"
        show-overflow-tooltip
        sortable="custom"
        label="验收结论">
      </el-table-column>-->
<!--    <el-table-column
        prop="ysjg"
        show-overflow-tooltip
        sortable="custom"
        label="验收结果">
        <template slot-scope="scope">
             {{ $dictUtils.getDictLabel("XMGL_YSJG", scope.row.ysjg, '-') }}
        </template>
      </el-table-column>-->
    <el-table-column
        prop="ystgdate"
        show-overflow-tooltip
        sortable="custom"
        label="验收通过日期">
      </el-table-column>
      <el-table-column
        header-align="center"
        align="center"
        fixed="right"
        :key="Math.random()"
        width="200"
        label="操作">
        <template  slot-scope="scope">
          <el-button v-if="hasPermission('xmgl:xmys:ysxx:view')" type="text" icon="el-icon-view" size="small" @click="view(scope.row.id)">查看</el-button>
          <el-dropdown  size="small" style=" margin-left: 10px;" v-if=" scope.row.tjzt === '0'">
            <el-button type="text" size="small"  >
              更多<i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown" >
              <el-dropdown-item ><el-button v-if="hasPermission('xmgl:xmys:ysxx:edit')  " type="text" icon="el-icon-edit" size="small" @click="edit(scope.row.id)">修改</el-button></el-dropdown-item>
                <el-dropdown-item ><el-button v-if="hasPermission('xmgl:xmys:ysxx:del') " type="text"  icon="el-icon-delete" size="small" @click="del(scope.row.id)">删除</el-button></el-dropdown-item>
                  <el-dropdown-item ><el-button    type="text"  icon="el-icon-top" size="small" @click="tj(scope.row.id,scope.row.yslx,scope.row.xm.id)">提交</el-button></el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="sizeChangeHandle"
      @current-change="currentChangeHandle"
      :current-page="pageNo"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="pageSize"
      :total="total"
      background
      layout="total, sizes, prev, pager, next, jumper">
    </el-pagination>
    </div>
        <!-- 弹窗, 新增 / 修改 -->
    <YsxxForm  ref="ysxxForm" @refreshDataList="refreshList"></YsxxForm>
  </div>
</template>

<script>
  import YsxxForm from './YsxxForm'
  import GridSelect from '@/components/gridSelect'
  export default {
    data () {
      return {
        searchForm: {
          xm: {
            id: ''
          },
          ysrq: '',
          yslx: '',
          wdsh: '',
          zjz: '',
          ysjl: '',
          xmid: '',
          ysjg: '',
          ystgdate: ''
        },
        dataList: [],
        pageNo: 1,
        pageSize: 10,
        total: 0,
        orderBy: '',
        dataListSelections: [],
        isImportCollapse: false,
        loading: false
      }
    },
    components: {
      GridSelect,
      YsxxForm
    },
    activated () {
      this.refreshList()
    },
    computed: {
      wdshList: {
        get: function () {
          return this.searchForm.wdsh !== '' ? this.searchForm.wdsh.split(',') : []
        },
        set: function (val) {
          this.searchForm.wdsh = val.join(',')
        }
      }
    },
    methods: {
      // 获取数据列表
      refreshList () {
        this.loading = true
        this.$http({
          url: '/xmgl/xmys/ysxx/list',
          method: 'get',
          params: {
            'pageNo': this.pageNo,
            'pageSize': this.pageSize,
            'orderBy': this.orderBy,
            beginYsrq: this.searchForm.ysrq[0],
            endYsrq: this.searchForm.ysrq[1],
            beginYstgdate: this.searchForm.ystgdate[0],
            endYstgdate: this.searchForm.ystgdate[1],
            ...this.lodash.omit(this.searchForm, 'ysrq', 'ystgdate')
          }
        }).then(({data}) => {
          if (data && data.success) {
            this.dataList = data.page.list
            this.total = data.page.count
            this.loading = false
          }
        })
      },
      // 每页数
      sizeChangeHandle (val) {
        this.pageSize = val
        this.pageNo = 1
        this.refreshList()
      },
      // 当前页
      currentChangeHandle (val) {
        this.pageNo = val
        this.refreshList()
      },
      // 多选
      selectionChangeHandle (val) {
        this.dataListSelections = val
      },

    // 排序
      sortChangeHandle (obj) {
        if (obj.order === 'ascending') {
          this.orderBy = obj.prop + ' asc'
        } else if (obj.order === 'descending') {
          this.orderBy = obj.prop + ' desc'
        } else {
          this.orderBy = ''
        }
        this.refreshList()
      },
      // 新增
      add () {
        this.$refs.ysxxForm.init('add', '')
      },
      // 修改
      edit (id) {
        id = id || this.dataListSelections.map(item => {
          return item.id
        })[0]
        this.$refs.ysxxForm.init('edit', id)
      },
      // 查看
      view (id) {
        this.$refs.ysxxForm.init('view', id)
      },
      // 删除
      del (id) {
        let ids = id || this.dataListSelections.map(item => {
          return item.id
        }).join(',')
        this.$confirm(`确定删除所选项吗?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.loading = true
          this.$http({
            url: '/xmgl/xmys/ysxx/delete',
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
      },
      // 提交
      tj (id, yslx, xmid) {
        this.$confirm(`确定提交验收吗?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.loading = true
          this.$http({
            url: '/xmgl/xmys/ysxx/tj',
            method: 'delete',
            params: {'id': id, 'yslx': yslx, 'xmid': xmid}
          }).then(({data}) => {
            if (data && data.success) {
              this.$message.success(data.msg)
              this.refreshList()
            }
            this.loading = false
          })
        })
      },
      // 导入成功
      uploadSuccess (res, file) {
        if (res.success) {
          this.$message.success({dangerouslyUseHTMLString: true,
            message: res.msg})
        } else {
          this.$message.error(res.msg)
        }
      },
      // 下载模板
      downloadTpl () {
        this.$utils.download('/xmgl/xmys/ysxx/import/template')
      },
      exportExcel () {
        let params = {
          beginYsrq: this.searchForm.ysrq[0],
          endYsrq: this.searchForm.ysrq[1],
          beginYstgdate: this.searchForm.ystgdate[0],
          endYstgdate: this.searchForm.ystgdate[1],
          ...this.lodash.omit(this.searchForm, 'ysrq', 'ystgdate')
        }
        this.$utils.download('/xmgl/xmys/ysxx/export', params)
      },
      resetSearch () {
        this.$refs.searchForm.resetFields()
        this.refreshList()
      }
    }
  }
</script>
