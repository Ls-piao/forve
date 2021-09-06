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
        label="项目名称">
            <template slot-scope="scope">
              <el-link  type="primary" :underline="false" v-if="hasPermission('xmgl:xmxx:xmjbxx:edit')" @click="edit(scope.row.id)">{{scope.row.xmmc}}</el-link>
              <el-link  type="primary" :underline="false" v-else-if="hasPermission('xmgl:xmxx:xmjbxx:view')"  @click="view(scope.row.id)">{{scope.row.xmmc}}</el-link>
              <span v-else>{{scope.row.xmmc}}</span>
            </template>
      </el-table-column>
    <el-table-column
        prop="xmbh"
        show-overflow-tooltip
        sortable="custom"
        label="项目编号">
      </el-table-column>
    <el-table-column
        prop="lxdw"
        show-overflow-tooltip
        sortable="custom"
        label="立项单位">
      </el-table-column>
    <el-table-column
        prop="lxrq"
        show-overflow-tooltip
        sortable="custom"
        label="立项日期">
      </el-table-column>
    <el-table-column
        prop="xmfl"
        show-overflow-tooltip
        sortable="custom"
        label="项目分类">
        <template slot-scope="scope">
          {{$dictUtils.getDictLabel("XMFL", scope.row.xmfl, "")}}
        </template>
      </el-table-column>
    <el-table-column
        prop="xmfx"
        show-overflow-tooltip
        sortable="custom"
        label="项目风险">
         <template slot-scope="scope">
          {{$dictUtils.getDictLabel("XMFX", scope.row.xmfx, "")}}
        </template>
      </el-table-column>
    <el-table-column
        prop="xmjl.name"
        show-overflow-tooltip
        sortable="custom"
        label="项目经理">
      </el-table-column>
    <el-table-column
        prop="zgbm.name"
        show-overflow-tooltip
        sortable="custom"
        label="主管部门">
      </el-table-column>
    <el-table-column
        prop="zfzr.name"
        show-overflow-tooltip
        sortable="custom"
        label="总负债人">
      </el-table-column>
    <el-table-column
        prop="xmzt"
        label="状态">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.xmzt === '0'" size="small">待审核</el-tag>
          <el-tag v-else-if="scope.row.xmzt === '1'" size="small" type="success">部门领导审核通过</el-tag>
          <el-tag v-else-if="scope.row.xmzt === '2'" size="small" type="danger">部门领导退回</el-tag>
          <el-tag v-else-if="scope.row.xmzt === '3'" size="small" type="danger">分管领导退回</el-tag>
          <el-tag v-else-if="scope.row.rwStatus != '1' && scope.row.rwStatus != '2' && scope.row.xmzt === '4'" size="small" type="success">立项</el-tag>
          <el-tag v-else-if="scope.row.rwStatus === '1'" size="small" type="success">进行中</el-tag>
          <el-tag v-else-if="scope.row.rwStatus === '2'" size="small" type="success">完成</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        header-align="center"
        align="center"
        fixed="right"
        :key="Math.random()"
        width="250"
        label="操作">
        <template  slot-scope="scope">
          <el-button type="text" v-if="'4' ===scope.row.xmzt" icon="el-icon-view" size="small" @click="detail(scope.row)">查看</el-button>
          <el-button type="text" v-if="'4' ===scope.row.xmzt"  icon="el-icon-view" size="small" @click="rwhis(scope.row)">任务历史版本</el-button>
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
    <XwRwxxList  ref="XwRwxxList" ></XwRwxxList>
  </div>
</template>

<script>
  import XmjbxxForm from './XmForm'
  import XwRwxxList from './XwRwxxList'
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
      SelectTree,
      XwRwxxList
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
        if (row.xmzt === '0') {
          key = 'UserTask_15dmjg9'
        } else if (row.xmzt === '1') {
          key = 'UserTask_0xjl2l7'
        } else if (row.xmzt === '2') {
          key = 'UserTask_0137rl8'
        } else if (row.xmzt === '3') {
          key = 'UserTask_0137rl8'
        } else {
          key = 'UserTask_0xjl2l7'
        }
        this.$http.get('/flowable/task/getTaskDef', {params: {
          taskDefKey: key,
          procInsId: row.procInsId,
          procDefId: 'Process_1629266787018:5:a8b317d9-fffd-11eb-8b4e-f83441b94772'
        }}).then(({data}) => {
          console.log(data)
          if (data.success) {
            this.$router.push({
              path: '/flowable/task/TaskFormDetail',
              query: {readOnly: true, title: row.title, formTitle: row.title, ...pick(data.flow, 'formType', 'formUrl', 'procDefKey', 'taskDefKey', 'procInsId', 'procDefId', 'taskId', 'status', 'title', 'businessId')}
            })
          }
        })
      },
      rwhis (row) {
        this.$refs.XwRwxxList.xmid = row.id
        this.$refs.XwRwxxList.rwStatus = row.rwStatus
        this.$refs.XwRwxxList.refreshList()
        this.$refs.XwRwxxList.visible = true
      },
      // 获取数据列表
      refreshList () {
        this.loading = true
        if (this.LxrqRange.length > 0) {
          this.searchForm.beginLxrq = this.LxrqRange[0]
          this.searchForm.endLxrq = this.LxrqRange[1]
        }
        this.$http({
          url: '/xmgl/xmxx/xmjbxx/list?xmzt=4&rwStatus=1',
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
