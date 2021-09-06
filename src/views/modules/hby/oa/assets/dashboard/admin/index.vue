<template>
    <div class="el-scrollbar__wrap">
      <div class="el-scrollbar__view">
        <div class="analyze">
          <!-- 任务卡片 -->
          <el-row class="m-3">
            <el-row :gutter="15">
                <el-col :span="6">
                    <div class="card-panel">
                        <div class="card-panel-icon-wrapper icon-location">
                            <i class="el-icon-s-management card-panel-icon"></i>
                        </div>
                        <div class="card-panel-description">
                            <div class="card-panel-text">
                                正常使用资产数量
                            </div>
                            <count-to :start-val="0" :end-val="normal"
                                      :duration="3000" class="card-panel-num"/>
                        </div>
                    </div>
                </el-col>
                <el-col :span="6" >
                    <div class="card-panel">
                        <div class="card-panel-icon-wrapper icon-sell">
                            <i class="el-icon-reading card-panel-icon"></i>
                        </div>
                        <div class="card-panel-description">
                            <div class="card-panel-text">
                                闲置资产数量
                            </div>
                            <count-to :start-val="0" :end-val="idle"
                                      :duration="3000" class="card-panel-num"/>
                        </div>
                    </div>
                </el-col>
                <el-col :span="6">
                    <div class="card-panel">
                        <div class="card-panel-icon-wrapper icon-people">
                            <i class="el-icon-finished card-panel-icon"></i>
                        </div>
                        <div class="card-panel-description">
                            <div class="card-panel-text">
                                维修资产数量
                            </div>
                            <count-to :start-val="0" :end-val="maintain"
                                      :duration="3000" class="card-panel-num"/>
                        </div>
                    </div>
                </el-col>
                <el-col :span="6">
                    <div class="card-panel">
                        <div class="card-panel-icon-wrapper icon-visit">
                            <i class="el-icon-s-operation card-panel-icon"></i>
                        </div>
                        <div class="card-panel-description">
                            <div class="card-panel-text">
                              报废报损资产数量
                            </div>
                            <count-to :start-val="0" :end-val="scrapped"
                                      :duration="3000" class="card-panel-num"/>
                        </div>
                    </div>
                </el-col>
            </el-row>
          </el-row>
          <!-- 项目状态 -->
          <el-row class="m-3">
            <el-row :gutter="15">

                <!-- 进行中项目列表 -->
                <el-col :span="12">
                    <div class="card-panel" style="height:400px">
                        <h3 style="padding-left:10px;padding-top:10px">报废审批</h3>
                      <el-table
                        :data="dataList1"
                        v-loading="loading1"
                        size="small"
                        class="table">
                        <el-table-column
                          prop="bfNo"
                          show-overflow-tooltip
                          label="报废编号">
                        </el-table-column>
                        <el-table-column
                          prop="sqr.name"
                          show-overflow-tooltip
                          label="申请人">
                        </el-table-column>
                        <el-table-column
                          prop="dept"
                          show-overflow-tooltip
                          label="部门">
                        </el-table-column>
                        <el-table-column
                          prop="office"
                          show-overflow-tooltip
                          label="单位">
                        </el-table-column>
                        <el-table-column
                          prop="jbr.name"
                          show-overflow-tooltip
                          label="经办人">
                        </el-table-column>
                        <el-table-column
                          prop="bfContent"
                          show-overflow-tooltip
                          label="报废原因">
                        </el-table-column>
                        <el-table-column
                          prop="rwStatus"
                          show-overflow-tooltip
                          label="报废状态">
                          <template slot-scope="scope">
                            <el-tag  :type="scope.row.level"   effect="dark" size="small">{{scope.row.rwStatus}} </el-tag>
                          </template>
                        </el-table-column>
                      </el-table>
                      <h3 style="padding-left:10px;padding-top:10px">维修审批</h3>
                      <el-table
                        :data="dataList2"
                        v-loading="loading2"
                        size="small"
                        class="table">
                        <el-table-column
                          prop="sqr.name"
                          show-overflow-tooltip
                          label="申请人">
                        </el-table-column>
                        <el-table-column
                          prop="dept"
                          show-overflow-tooltip
                          label="部门">
                        </el-table-column>
                        <el-table-column
                          prop="office"
                          show-overflow-tooltip
                          label="单位">
                        </el-table-column>
                        <el-table-column
                          prop="wxNo"
                          show-overflow-tooltip
                          label="维修编号">
                        </el-table-column>
                        <el-table-column
                          prop="sqDate"
                          show-overflow-tooltip
                          label="申请时间">
                        </el-table-column>
                        <el-table-column
                          prop="yjhj"
                          show-overflow-tooltip
                          label="原价合计">
                        </el-table-column>
                        <el-table-column
                          prop="rwStatus"
                          show-overflow-tooltip
                          label="报废状态">
                          <template slot-scope="scope">
                            <el-tag  :type="scope.row.level"   effect="dark" size="small">{{scope.row.rwStatus}} </el-tag>
                          </template>
                        </el-table-column>
                      </el-table>
                    </div>
                </el-col>
                 <!-- 项目状态饼图 -->
                <el-col :span="12">
                    <div class="card-panel" style="height:400px">
<!--                        <h3 style="padding-left:10px;padding-top:10px">资产状态统计</h3>-->
<!--                        <ve-pie :data="chartData"></ve-pie>-->
                      <state-statistics :type="1" :height="'400px'" ></state-statistics>
                    </div>
                </el-col>
            </el-row>
          </el-row>
         <!-- 项目收支状态 -->
          <el-row class="m-3">
            <el-row :gutter="15">
              <el-col :span="24">
                <div class="card-panel" style="height:400px">
                    <h3 style="padding-left:10px;padding-top:10px">借领审批列表</h3>
                  <el-table
                    :data="dataList3"
                    size="small"
                    v-loading="loading3"
                    class="table">
                    <el-table-column
                      prop="zc.name"
                      show-overflow-tooltip
                      label="资产名称">
                    </el-table-column>
                    <el-table-column
                      prop="sqr.name"
                      show-overflow-tooltip
                      label="申请人">
                    </el-table-column>
                    <el-table-column
                      prop="type"
                      show-overflow-tooltip
                      label="申请类型">
                      <template slot-scope="scope">
                        {{ $dictUtils.getDictLabel("jlzt", scope.row.type, '-') }}
                      </template>
                    </el-table-column>
                    <el-table-column
                      prop="yjghDate"
                      show-overflow-tooltip
                      label="预计归还">
                    </el-table-column>
                    <el-table-column
                      prop="dept.id"
                      show-overflow-tooltip
                      label="部门">
                    </el-table-column>
                    <el-table-column
                      prop="office.id"
                      show-overflow-tooltip
                      label="单位">
                    </el-table-column>
                    <el-table-column
                      prop="jcNo"
                      show-overflow-tooltip
                      label="借领单号">
                    </el-table-column>
                    <el-table-column
                      prop="jsr.name"
                      show-overflow-tooltip
                      label="经手人">
                    </el-table-column>
                    <el-table-column
                      prop="zdr.name"
                      show-overflow-tooltip
                      label="制单人">
                    </el-table-column>
                    <el-table-column
                      prop="jysm"
                      show-overflow-tooltip
                      label="借领说明">
                    </el-table-column>
                    <el-table-column
                      prop="rwStatus"
                      show-overflow-tooltip
                      label="借领状态">
                      <template slot-scope="scope">
                        <el-tag  :type="scope.row.level"   effect="dark" size="small">{{scope.row.rwStatus}} </el-tag>
                      </template>
                    </el-table-column>
                  </el-table>
                </div>
              </el-col>
            </el-row>
          </el-row>
        </div>
      </div>
    </div>
</template>

<script>
    import CountTo from 'vue-count-to'
    import stateStatistics from './../../gdzc/statistics/stateStatistics'
    import SpBfZcList from '@/views/modules/hby/oa/assets/gdzc/zcbf/SpBfZcList'
export default {
      name: 'Analysis',
      components: {
        CountTo,
        stateStatistics,
        SpBfZcList
      },
      data () {
        return {
          chartData: {},
          dataList1: [],
          dataList2: [],
          dataList3: [],
          tableData: [],
          szData: [],
          idle: 0,
          maintain: 0,
          normal: 0,
          scrapped: 0,
          loading1: true,
          loading2: true,
          loading3: true
        }
      },
      activated () {
        // 借领审批数据
        this.$http({
          url: '/zcjl/bgxtZcjl/listBySh',
          method: 'get',
          params: {
            'pageNo': 1,
            'pageSize': 5
          }
        }).then(({data}) => {
          if (data && data.success) {
            this.dataList3 = data.page.list
            this.loading3 = false
          }
        })
        // 报废审批数据
        this.$http({
          url: '/zcbf/bgxtGdzcBf/listBySh',
          method: 'get',
          params: {
            'pageNo': 1,
            'pageSize': 5,
            params: {
              sqr: {
                id: ''
              }
            }
          }
        }).then(({data}) => {
          if (data && data.success) {
            this.dataList1 = data.page.list
            this.loading1 = false
          }
        })
        // 维修审批数据
        this.$http({
          url: '/zcwx/bgxtGdzcZcwx/listBySh',
          method: 'get',
          params: {
            'pageNo': 1,
            'pageSize': 5,
            params: {
              sqr: {
                id: ''
              }
            }
          }
        }).then(({data}) => {
          if (data && data.success) {
            this.dataList2 = data.page.list
            this.loading2 = false
          }
        })
        // 获取第一行数据
        this.$http.get('/zcfl/bgxtGdzcInfo/statisticsIndex').then(({data}) => {
          if (data && data.success) {
            this.normal = parseInt(data.normal)
            this.idle = parseInt(data.idle)
            this.maintain = parseInt(data.maintain)
            this.scrapped = parseInt(data.scrapped)
          }
        })
        this.$http.get('/xmgl/xmxx/xmjbxx/xmjdList').then(({data}) => {
          console.log(data.list)
          this.tableData = data.list
        })
        this.$http.get('/xmgl/xmxx/xmjbxx/xmszList').then(({data}) => {
          console.log(data.list)
          this.szData = data.list
        })
      },
      methods: {
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
