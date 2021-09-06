<template>
  <div class="page">
      <el-form size="small" :inline="true" class="query-form" ref="searchForm" :model="searchForm" @keyup.enter.native="refreshList()" @submit.native.prevent>
            <!-- 搜索框-->
         <el-form-item prop="xmmc">
                <el-input size="small" v-model="searchForm.xmmc" placeholder="项目名称" clearable></el-input>
         </el-form-item>
         <el-form-item prop="xmbh">
                <el-input size="small" v-model="searchForm.xmbh" placeholder="项目编号" clearable></el-input>
         </el-form-item>
         <el-form-item prop="lxdw">
                <el-input size="small" v-model="searchForm.lxdw" placeholder="立项单位" clearable></el-input>
         </el-form-item>
          <el-form-item prop="zgbm">
                <el-input size="small" v-model="searchForm.zgbm.name" placeholder="主管部门" clearable></el-input>
         </el-form-item>
         <el-form-item prop="xmfl" v-show="advanced">
            <el-select v-model="searchForm.xmfl" placeholder="项目分类"  style="width: 100%;">
              <el-option
                v-for="item in this.$dictUtils.getDictList('XMFL')"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
         </el-form-item>
         <el-form-item prop="xmfx" v-show="advanced">
            <el-select v-model="searchForm.xmfl" placeholder="项目风险"  style="width: 100%;">
              <el-option
                v-for="item in this.$dictUtils.getDictList('XMFX')"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
         </el-form-item>
        <el-form-item prop="LxrqRange" v-show="advanced">
            <el-date-picker
                v-model="LxrqRange"
                type="daterange"
                size="small"
                align="right"
                value-format="yyyy-MM-dd"
                unlink-panels
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期">
              </el-date-picker>
         </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="refreshList()" size="small" icon="el-icon-search">查询</el-button>
            <el-button @click="resetSearch()" size="small" icon="el-icon-refresh-right">重置</el-button>
            <el-button @click="toggleAdvanced" size="small" icon="el-icon-rank">{{ advanced ? '收起' : '展开' }}</el-button>
          </el-form-item>
      </el-form>
      <div class="bg-white top">
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
        prop="xmmc"
        show-overflow-tooltip
        sortable="custom"
        label="项目名称"
        min-width="100">
        <template slot-scope="scope">
          <el-link  type="primary" :underline="false" v-if="hasPermission('xmgl:xmxx:xmjbxx:edit')" @click="edit(scope.row.id)">{{scope.row.xmmc}}</el-link>
          <el-link  type="primary" :underline="false" v-else-if="hasPermission('xmgl:xmxx:xmjbxx:view')"  @click="view(scope.row.id)">{{scope.row.xmmc}}</el-link>
          <span v-else>{{scope.row.xmmc}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="lxrq"
        show-overflow-tooltip
        sortable="custom"
        label="立项日期" min-width="100">
      </el-table-column>
      <el-table-column
        prop="xmfl"
        show-overflow-tooltip
        sortable="custom"
        label="项目分类" min-width="100">
        <template slot-scope="scope">
          {{$dictUtils.getDictLabel("XMFL", scope.row.xmfl, "")}}
        </template>
      </el-table-column>
      <el-table-column
        prop="xmfx"
        show-overflow-tooltip
        sortable="custom"
        label="项目风险" min-width="100">
        <template slot-scope="scope">
          {{$dictUtils.getDictLabel("XMFX", scope.row.xmfx, "")}}
        </template>
      </el-table-column>
      <el-table-column
        prop="xmjl.name"
        show-overflow-tooltip
        sortable="custom"
        label="项目经理" min-width="100">
      </el-table-column>
      <el-table-column
        prop="zgbm.name"
        show-overflow-tooltip
        sortable="custom"
        label="主管部门" min-width="100">
      </el-table-column>
      <el-table-column
        prop="zfzr.name"
        show-overflow-tooltip
        sortable="custom"
        label="总负债人" min-width="100">
      </el-table-column>
      <el-table-column
        prop="xmzt"
        label="状态" min-width="100">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.xmzt === '0'" size="small">待审核</el-tag>
          <el-tag v-else-if="scope.row.xmzt === '1'" size="small" type="success">部门领导审核通过</el-tag>
          <el-tag v-else-if="scope.row.xmzt === '2'" size="small" type="danger">部门领导退回</el-tag>
          <el-tag v-else-if="scope.row.xmzt === '3'" size="small" type="danger">分管领导退回</el-tag>
          <el-tag v-else-if="scope.row.xmzt === '4'" size="small" type="success">立项</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        header-align="center"
        align="center"
        fixed="right"
        :key="Math.random()"
        width="200"
        label="操作">
        <template  slot-scope="scope">
          <el-button type="text"  icon="el-icon-view" size="small" @click="detail(scope.row)">查看</el-button>
<!--          <el-button type="text" icon="el-icon-view" size="small" @click="view(scope.row.id)">查看</el-button>
          <el-button v-if="'0' === scope.row.xmzt" type="text" icon="el-icon-edit" size="small" @click="edit(scope.row.id)">修改</el-button>
          <el-button v-if="'0' === scope.row.xmzt" type="text"  icon="el-icon-delete" size="small" @click="del(scope.row.id)">删除</el-button>-->
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
<!--    <XmjbxxForm  ref="xmjbxxForm" @refreshDataList="refreshList"></XmjbxxForm>-->
  </div>
</template>

<script>
  import XmjbxxForm from './XmjbxxForm'
  import GridSelect from '@/components/gridSelect'
  import SelectTree from '@/components/treeSelect/treeSelect.vue'
  import pick from 'lodash.pick'
export default {
    data () {
      return {
        advanced: false,
        LxrqRange: [],
        searchForm: {
          beginLxrq: '',
          endLxrq: '',
          xmmc: '',
          xmbh: '',
          lxdw: '',
          lxrq: '',
          xmfl: '',
          xmfx: '',
          zgbm: {
            id: '',
            name: ''
          },
          zfzr: {
            id: '',
            name: ''
          },
          xmjl: {
            id: '',
            name: ''
          }
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
      XmjbxxForm,
      GridSelect,
      SelectTree
    },
    activated () {
      this.refreshList()
    },
    methods: {
      toggleAdvanced () {
        this.advanced = !this.advanced
      },
      detail (row) {
        var key = ''
        var title1 = ''
        if (row.xmzt === '0') {
          key = 'UserTask_15dmjg9'
          title1 = '项目名称：' + row.xmmc + '，新增项目,发起人：' + row.fqr
        } else if (row.xmzt === '1') {
          key = 'UserTask_0xjl2l7'
          title1 = '项目名称：' + row.xmmc + '，分管领导审核,发起人：' + row.fqr
        } else if (row.xmzt === '2') {
          key = 'UserTask_0137rl8'
          title1 = '项目名称：' + row.xmmc + '，重新发起申请,发起人：' + row.fqr
        } else if (row.xmzt === '3') {
          key = 'UserTask_0137rl8'
          title1 = '项目名称：' + row.xmmc + '，重新发起申请,发起人：' + row.fqr
        } else {
          key = 'UserTask_0xjl2l7'
          title1 = '项目名称：' + row.xmmc + '，立项,发起人：' + row.fqr
        }
        this.$http.get('/flowable/task/getTaskDef', {params: {
          taskDefKey: key,
          procInsId: row.procInsId,
          procDefId: 'Process_1629266787018:7:2b147988-017b-11ec-b5dc-f83441b94772'
        }}).then(({data}) => {
          console.log(data)
          if (data.success) {
            this.$router.push({
              path: '/flowable/task/TaskFormDetail',
              query: {readOnly: true, title: title1, formTitle: title1, ...pick(data.flow, 'formType', 'formUrl', 'procDefKey', 'taskDefKey', 'procInsId', 'procDefId', 'taskId', 'status', 'title', 'businessId')}
            })
          }
        })
      },
      // 获取数据列表
      refreshList () {
        this.loading = true
        if (this.LxrqRange.length > 0) {
          this.searchForm.beginLxrq = this.LxrqRange[0]
          this.searchForm.endLxrq = this.LxrqRange[1]
        }
        this.$http({
          url: '/xmgl/xmxx/xmjbxx/list',
          method: 'get',
          params: {
            'pageNo': this.pageNo,
            'pageSize': this.pageSize,
            'orderBy': this.orderBy,
            ...this.searchForm
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
        this.$refs.xmjbxxForm.init('add', '')
      },
      // 修改
      edit (id) {
        id = id || this.dataListSelections.map(item => {
          return item.id
        })[0]
        this.$refs.xmjbxxForm.init('edit', id)
      },
      // 查看
      view (id) {
        this.$refs.xmjbxxForm.init('view', id)
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
            url: '/xmgl/xmxx/xmjbxx/delete',
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
        this.$utils.download('/xmgl/xmxx/xmjbxx/import/template')
      },
      exportExcel () {
        let params = {
          ...this.searchForm
        }
        this.$utils.download('/xmgl/xmxx/xmjbxx/export', params)
      },
      resetSearch () {
        this.$refs.searchForm.resetFields()
        this.LxrqRange = []
        this.searchForm.beginLxrq = ''
        this.searchForm.endLxrq = ''
        this.refreshList()
      }
    }
  }
</script>
