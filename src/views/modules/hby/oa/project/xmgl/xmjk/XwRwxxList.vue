<template>
  <el-dialog
    :title="title"
    :close-on-click-modal="false"
     v-dialogDrag
    :visible.sync="visible"
    width="75%"
    height="100%">
    <div class="analyze">
      <el-row class="m-3">
        <el-row :gutter="15">
            <el-col :span="6">
                <div class="card-panel">
                    <div class="card-panel-icon-wrapper icon-location">
                        <i class="el-icon-success card-panel-icon"></i>
                    </div>
                    <div class="card-panel-description">
                        <div class="card-panel-text">
                            已完成任务
                        </div>
                        <count-to :start-val="0" :end-val="this.ywcNum"
                                  :duration="3000" class="card-panel-num"/>
                    </div>
                </div>
            </el-col>
            <el-col :span="6" >
                <div class="card-panel">
                    <div class="card-panel-icon-wrapper icon-sell">
                        <i class="el-icon-shopping-cart-2 card-panel-icon"></i>
                    </div>
                    <div class="card-panel-description">
                        <div class="card-panel-text">
                            未完成任务
                        </div>
                        <count-to :start-val="0" :end-val="this.wwcNum"
                                  :duration="3000" class="card-panel-num"/>
                    </div>
                </div>
            </el-col>
            <el-col :span="6">
                <div class="card-panel">
                    <div class="card-panel-icon-wrapper icon-visit">
                        <i class="el-icon-s-order card-panel-icon"></i>
                    </div>
                    <div class="card-panel-description">
                        <div class="card-panel-text">
                            超期未完成任务
                        </div>
                        <count-to :start-val="0" :end-val="this.cqNum"
                                  :duration="3000" class="card-panel-num"/>
                    </div>
                </div>
            </el-col>
            <el-col :span="6">
                <div class="card-panel">
                    <div class="card-panel-icon-wrapper icon-people">
                        <i class="el-icon-user-solid card-panel-icon"></i>
                    </div>
                    <div class="card-panel-description">
                        <div class="card-panel-text">
                            完成任务占比(%)
                        </div>
                        <count-to :start-val="0" :end-val="this.rate"
                                  :duration="3000" class="card-panel-num"/>
                    </div>
                </div>
            </el-col>
        </el-row>
      </el-row>
    </div>
    <div class="page">
      <el-form size="small" :inline="true" class="query-form" ref="searchForm" :model="searchForm" @keyup.enter.native="refreshList()" @submit.native.prevent>
            <!-- 搜索框-->
         <el-form-item prop="rwmc">
                <el-input size="small" v-model="searchForm.rwmc" placeholder="任务名称" clearable></el-input>
         </el-form-item>
         <el-form-item prop="rwdm">
                <el-input size="small" v-model="searchForm.rwdm" placeholder="任务代码" clearable></el-input>
         </el-form-item>
         <el-form-item prop="cc">
                <el-input size="small" v-model="searchForm.cc" placeholder="层次" clearable></el-input>
         </el-form-item>
         
         <el-form-item prop="zrr.name">
            <el-input size="small" v-model="searchForm.zrr.name" placeholder="责任人" clearable></el-input>
         </el-form-item>
         <el-form-item prop="sfGjlj">
           <el-select v-model="searchForm.sfGjlj" placeholder="是否关键路径"  style="width: 100%;">
              <el-option
                v-for="item in this.$dictUtils.getDictList('yes_no')"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
         </el-form-item>
         <el-form-item prop="sfLcb">
            <el-select v-model="searchForm.sfLcb" placeholder="是否里程碑"  style="width: 100%;">
              <el-option
                v-for="item in this.$dictUtils.getDictList('yes_no')"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
         </el-form-item>

          <el-form-item>
            <el-button type="primary" @click="refreshList()" size="small" icon="el-icon-search">查询</el-button>
            <el-button @click="resetSearch()" size="small" icon="el-icon-refresh-right">重置</el-button>
          </el-form-item>
      </el-form>
      <div class="bg-white top">
      <el-row>
        <!-- <el-button v-if="'1' === this.rwStatus" type="primary" size="small" icon="el-icon-plus" @click="add()">新建</el-button> -->
        <!-- <el-button-group class="pull-right">
            <el-button
              type="default"
              size="small"
              icon="el-icon-refresh"
              @click="refreshList">
            </el-button>
        </el-button-group> -->
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
        prop="rwmc"
        show-overflow-tooltip
        sortable="custom"
        label="任务名称">
      </el-table-column>
      <el-table-column
        prop="rwdm"
        show-overflow-tooltip
        sortable="custom"
        label="任务代码">
      </el-table-column>
      <el-table-column
        prop="cc"
        show-overflow-tooltip
        sortable="custom"
        label="层次">
      </el-table-column>
      <el-table-column
        prop="zrr.name"
        show-overflow-tooltip
        sortable="custom"
        label="责任人">
      </el-table-column>
      <el-table-column
        prop="sfGjlj"
        show-overflow-tooltip
        sortable="custom"
        label="是否关键路径">
        <template slot-scope="scope">
          {{$dictUtils.getDictLabel("yes_no", scope.row.sfGjlj, "")}}
        </template>
      </el-table-column>
      <el-table-column
        prop="sfLcb"
        show-overflow-tooltip
        sortable="custom"
        label="是否里程碑">
        <template slot-scope="scope">
          {{$dictUtils.getDictLabel("yes_no", scope.row.sfLcb, "")}}
        </template>
      </el-table-column>
      <el-table-column
        prop="bbh"
        show-overflow-tooltip
        sortable="custom"
        label="版本号">
      </el-table-column>
      <el-table-column
        prop="rwjd"
        show-overflow-tooltip
        sortable="custom"
        width="70"
        label="进度(%)">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.rwjd === 100" size="small" type="success">{{scope.row.rwjd}}</el-tag>
          <el-tag v-else-if="'' != scope.row.rwjd && scope.row.rwjd < 100" size="small">{{scope.row.rwjd}}</el-tag>
          <el-tag v-else size="small">0</el-tag>
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
          <el-button type="text" icon="el-icon-view" size="small" @click="view(scope.row.id)">查看</el-button>
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
    <XwRwxxForm  ref="xwRwxxForm" @refreshDataList="refreshList"></XwRwxxForm>
  </div>
  <span slot="footer" class="dialog-footer">
    <el-button size="small" @click="visible = false">关闭</el-button>
  </span>
  </el-dialog>
</template>

<script>
  import XwRwxxForm from './XwRwxxForm'
  import UserSelect from '@/components/userSelect'
  import CountTo from 'vue-count-to'
  export default {
    data () {
      return {
        ywcNum: 0,
        wwcNum: 0,
        cqNum: 0,
        rate: 0,
        searchForm: {
          rwmc: '',
          cc: '',
          rwdm: '',
          zrr: {
            id: ''
          },
          sfGjlj: '',
          sfLcb: '',
          gq: '',
          xmId: {
            id: '',
            xmmc: ''
          }
        },
        rwStatus: '',
        xmid: '',
        dataList: [],
        pageNo: 1,
        pageSize: 10,
        total: 0,
        orderBy: '',
        dataListSelections: [],
        isImportCollapse: false,
        loading: false,
        title: '任务查看',
        method: '',
        visible: false
      }
    },
    components: {
      UserSelect,
      XwRwxxForm,
      CountTo
    },
    activated () {
      this.refreshList()
    },
    methods: {
      // 获取数据列表
      refreshList () {
        this.loading = true
        this.searchForm.xmId.id = this.xmid
        this.$http({
          url: '/xmgl/xmrwxx/xwRwxx/rwSltj',
          method: 'get',
          params: {
            'pageNo': this.pageNo,
            'pageSize': this.pageSize,
            'orderBy': this.orderBy,
            ...this.searchForm
          }
        }).then(({data}) => {
          if (data && data.success) {
            console.log(data.res)
            this.ywcNum = data.res.ywcNum
            this.wwcNum = data.res.wwcNum
            this.cqNum = data.res.cqNum
            this.rate = data.res.rate
          }
        })
        this.$http({
          url: '/xmgl/xmrwxx/xwRwxx/list',
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
        this.$refs.xwRwxxForm.inputForm.xmId.id = this.xmid
        this.$refs.xwRwxxForm.init('add', '')
      },
      // 修改
      edit (id) {
        id = id || this.dataListSelections.map(item => {
          return item.id
        })[0]
        this.$refs.xwRwxxForm.init('edit', id)
      },
      // 查看
      view (id) {
        this.$refs.xwRwxxForm.init('view', id)
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
            url: '/xmgl/xmrwxx/xwRwxx/delete',
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
      sortChange (row) {
        this.loading = true
        this.$http({
          url: `/xmgl/xmrwxx/xwRwxx/save`,
          method: 'post',
          data: {id: row.id, sort: row.sort}
        }).then(({data}) => {
          if (data && data.success) {
            this.$message({
              message: data.msg,
              type: 'success',
              duration: 1500
            })
          }
          this.loading = false
          this.refreshList()
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
        this.$utils.download('/xmgl/xmrwxx/xwRwxx/import/template')
      },
      exportExcel () {
        let params = {
          ...this.searchForm
        }
        this.$utils.download('/xmgl/xmrwxx/xwRwxx/export', params)
      },
      resetSearch () {
        this.$refs.searchForm.resetFields()
        this.refreshList()
      }
    }
  }
</script>
<style scoped lang="less">
    .analyze {
        
        .top-1 {
            top: 0.55rem;
        }
        .mt-0 {
            margin-top: 0;
        }

        .m-3 {
            margin-bottom: 0.75rem;
        }

        .right-0 {
            right: 200px;
        }
        .absolute {
            position: absolute;
        }
        .float-left {
            float: left;
        }
        .flex {
            display: flex;
        }
        .card-panel {
            height: 108px;
            cursor: pointer;
            font-size: 12px;
            position: relative;
            overflow: hidden;
            color: #666;
            background: #ffffff;
            box-shadow: 4px 4px 40px rgba(0, 0, 0, .05);
            border-color: rgba(0, 0, 0, .05);
            &:hover {
                .card-panel-icon-wrapper {
                    color: #fff;
                }
                .icon-sell {
                    background: #6778fa;
                }
                .icon-people {
                    background: #40c9c6;
                }
                .icon-location {
                    background: #36a3f7;
                }
                .icon-visit {
                    background: #f4516c;
                }
            }
            .icon-sell {
                color: #6778fa;
            }
            .icon-people {
                color: #40c9c6;
            }
            .icon-location {
                color: #36a3f7;
            }
            .icon-visit {
                color: #f4516c;
            }
            .card-panel-icon-wrapper {
                float: left;
                margin: 14px 0 0 14px;
                padding: 16px;
                transition: all 0.38s ease-out;
                border-radius: 6px;
            }
            .card-panel-icon {
                float: left;
                font-size: 48px;
            }
            .card-panel-description {
                float: right;
                font-weight: bold;
                margin: 26px;
                margin-left: 0px;
                .card-panel-text {
                    line-height: 18px;
                    color: rgba(0, 0, 0, 0.45);
                    font-size: 16px;
                    margin-bottom: 12px;
                }
                .card-panel-num {
                    font-size: 20px;
                }
            }
        }
    }
</style>