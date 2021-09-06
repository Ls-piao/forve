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
                                立项中项目
                            </div>
                            <count-to :start-val="0" :end-val="this.lxz"
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
                                进行中项目
                            </div>
                            <count-to :start-val="0" :end-val="this.jxz"
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
                                已完毕项目
                            </div>
                            <count-to :start-val="0" :end-val="this.ywc"
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
                                完毕项目占比(%)
                            </div>
                            <count-to :start-val="0" :end-val="this.rate"
                                      :duration="3000" class="card-panel-num"/>
                        </div>
                    </div>
                </el-col>
            </el-row>
          </el-row>
           <!-- 项目金额 -->
          <el-row class="m-3">
            <el-row :gutter="15">
                <el-col :span="6">
                    <div class="card-panel">
                        <div class="card-panel-icon-wrapper icon-people">
                            <i class="el-icon-document-checked card-panel-icon"></i>
                        </div>
                        <div class="card-panel-description">
                            <div class="card-panel-text">
                                项目合同金额
                            </div>
                            <count-to :start-val="0" :end-val="this.htje"
                                      :duration="3000" class="card-panel-num"/>
                        </div>
                    </div>
                </el-col>
                <el-col :span="6" >
                    <div class="card-panel">
                        <div class="card-panel-icon-wrapper icon-location">
                            <i class="el-icon-sell card-panel-icon"></i>
                        </div>
                        <div class="card-panel-description">
                            <div class="card-panel-text">
                                项目收入
                            </div>
                            <count-to :start-val="0" :end-val="this.xmsr"
                                      :duration="3000" class="card-panel-num"/>
                        </div>
                    </div>
                </el-col>
                <el-col :span="6">
                    <div class="card-panel">
                        <div class="card-panel-icon-wrapper icon-visit">
                            <i class="el-icon-sold-out card-panel-icon"></i>
                        </div>
                        <div class="card-panel-description">
                            <div class="card-panel-text">
                                项目支出
                            </div>
                            <count-to :start-val="0" :end-val="this.xmzc"
                                      :duration="3000" class="card-panel-num"/>
                        </div>
                    </div>
                </el-col>
                <el-col :span="6">
                    <div class="card-panel">
                        <div class="card-panel-icon-wrapper  icon-sell">
                            <i class="el-icon-shopping-bag-1 card-panel-icon"></i>
                        </div>
                        <div class="card-panel-description">
                            <div class="card-panel-text">
                                项目收支差额
                            </div>
                            <count-to :start-val="0" :end-val="this.xmsz"
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
                        <h3 style="padding-left:10px;padding-top:10px">进行中项目列表</h3>
                        <el-table
                        :data="tableData"
                        border
                        height="350px"
                        style="width: 100%;margin-top:10px">
                            <el-table-column
                            prop="xmmc"
                            label="项目名称"
                            width="450">
                            </el-table-column>
                            <el-table-column
                            prop="jd"
                            label="项目进度(%)"
                            width="175">
                            </el-table-column>
                        </el-table>
                    </div>
                </el-col>
                 <!-- 项目状态饼图 -->
                <el-col :span="12"> 
                    <div class="card-panel" style="height:400px">
                        <h3 style="padding-left:10px;padding-top:10px">项目状态统计</h3>
                        <ve-pie :data="chartData"></ve-pie>
                    </div>
                </el-col>
            </el-row>
          </el-row>
         <!-- 项目收支状态 -->
          <el-row class="m-3">
            <el-row :gutter="15">
              <el-col :span="24">
                <div class="card-panel" style="height:400px">
                    <h3 style="padding-left:10px;padding-top:10px">项目收支列表</h3>
                    <el-table
                    :data="szData"
                    border
                    height="380px"
                    style="width: 100%;margin-top:10px">
                    <el-table-column
                        prop="xmmc"
                        label="项目名称"
                        width="450">
                    </el-table-column>
                    <el-table-column
                        prop="htje"
                        label="合同金额(元)"
                        width="280">
                    </el-table-column>
                    <el-table-column
                        prop="sr"
                        label="项目收入(元)"
                        width="180">
                    </el-table-column>
                    <el-table-column
                        prop="zc"
                        label="项目支出(元)"
                        width="180">
                    </el-table-column>
                    <el-table-column
                        prop="sz"
                        label="项目收支差额(元)"
                        width="180">
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
    import QuotaExplain from './QuotaExplain'
    import ChartCard from './ChartCard'
    import CellNum from './CellNum'
    import VisitNum from './VisitNum'

    export default {
      name: 'Analysis',
      components: {
        CountTo,
        CellNum,
        VisitNum,
        QuotaExplain,
        ChartCard
      },
      data () {
        return {
          lxz: 0,
          jxz: 0,
          ywc: 0,
          rate: 0,
          htje: 0,
          xmsr: 0,
          xmzc: 0,
          xmsz: 0,
          chartData: {},
          tableData: [],
          szData: []
        }
      },
      activated () {
        this.$http.get('/xmgl/xmxx/xmjbxx/xmztTjChartData').then(({data}) => {
          console.log(data.res)
          this.chartData = data.res
        })
        this.$http.get('/xmgl/xmxx/xmjbxx/syJbqk').then(({data}) => {
          console.log(data.res)
          this.lxz = data.res.lxz
          this.jxz = data.res.jxz
          this.ywc = data.res.ywc
          this.rate = data.res.rate
          this.htje = data.res.htje
          this.xmsr = data.res.xmsr
          this.xmzc = data.res.xmzc
          this.xmsz = data.res.xmsz
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
