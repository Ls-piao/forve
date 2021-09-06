<template>
  <div class="el-scrollbar__wrap wrap-white padding-20">
      <el-tabs v-model="activeName" @tab-click="loadTab">
        <!--  考勤规则Tab页开始-->
        <el-tab-pane label="考勤规则" name="kqgz">
          <el-card>
            <el-form size="small" :inline="true" class="searchForm" ref="searchForm" :model="searchForm" @keyup.enter.native="refreshList()" @submit.native.prevent>
                  <!-- 搜索框-->
               <el-form-item prop="flbh.id">
                 <SelectTree
                   ref="flbh.id"
                   :props="{
                                value: 'id',             // ID字段名
                                label: 'name',         // 显示名称
                                children: 'children'    // 子级字段名
                              }"
                   placeholder="请选择分类"
                   size="small"
                   url="/xckqglkqfl/xcKqglKqfl/treeData"
                   :value="searchForm.flbh.id"
                   :clearable="true"
                   :accordion="true"
                   @getValue="(value) => {searchForm.flbh.id=value}"/>
               </el-form-item>
               <el-form-item prop="gzState">
                        <el-select v-model="searchForm.gzState" placeholder="请选择规则使用情况" size="small" style="width: 100%;">
                          <el-option
                            v-for="item in $dictUtils.getDictList('GZSYZT')"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                          </el-option>
                        </el-select>
               </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click="refreshList()" size="small">查询</el-button>
                  <el-button @click="resetSearch()" size="small">重置</el-button>
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
                        :action="`${this.$http.BASE_URL}/xckqglkqgz/xcKqglKqgz/import`"
                        :on-success="uploadSuccess"
                         :show-file-list="true">
                        <el-button size="small" type="primary">点击上传</el-button>
                        <div slot="tip" class="el-upload__tip">只允许导入“xls”或“xlsx”格式文件！</div>
                      </el-upload>
                  </el-form-item>
                </el-form>
            </el-dialog>
            <div class="bg-white top" style="height: 450px">
            <el-row>
              <el-button v-if="hasPermission('xckqglkqgz:xcKqglKqgz:add')" type="primary" size="small" icon="el-icon-plus" @click="add()">新建</el-button>
              <el-button v-if="hasPermission('xckqglkqgz:xcKqglKqgz:edit')" type="warning" size="small" icon="el-icon-edit-outline" @click="edit()"
               :disabled="dataListSelections.length != 1" plain>修改</el-button>
              <el-button v-if="hasPermission('xckqglkqgz:xcKqglKqgz:del')" type="danger"   size="small" icon="el-icon-delete" @click="del()"
                        :disabled="dataListSelections.length <= 0" plain>删除
              </el-button>
              <el-button-group class="pull-right">
                  <el-button v-if="hasPermission('xckqglkqgz:xcKqglKqgz:import')" type="default" size="small" icon="el-icon-upload2" title="导入" @click="isImportCollapse = !isImportCollapse"></el-button>
                  <el-button v-if="hasPermission('xckqglkqgz:xcKqglKqgz:export')" type="default" size="small" icon="el-icon-download" title="导出" @click="exportExcel()"></el-button>
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
              :selectable="selectable"
              width="50">
            </el-table-column>
            <el-table-column
              prop="flbh.name"
              show-overflow-tooltip
              align="center"
              label="考勤分类">
                  <template slot-scope="scope">
<!--                    <el-link  type="primary" :underline="false" v-if="hasPermission('xckqglkqgz:xcKqglKqgz:edit')" @click="edit(scope.row.id)">{{scope.row.flbh.name}}</el-link>-->
<!--                    <el-link  type="primary" :underline="false" v-else-if="hasPermission('xckqglkqgz:xcKqglKqgz:view')"  @click="view(scope.row.id)">{{scope.row.flbh.name}}</el-link>-->
<!--                    <span v-else>{{scope.row.flbh.name}}</span>-->
                    <el-link  type="primary" :underline="false" v-if="hasPermission('xckqglkqgz:xcKqglKqgz:view')"  @click="view(scope.row.id)" title="查看信息">{{scope.row.flbh.name}}</el-link>
                  </template>
            </el-table-column>
          <el-table-column
              prop="dateStart"
              show-overflow-tooltip
              align="center"
              label="开始时间">
              <template slot-scope="scope">
                {{scope.row.dateStart.slice(11, 16)}}
              </template>
            </el-table-column>
          <el-table-column
              prop="dateEnd"
              show-overflow-tooltip
              align="center"
              label="结束时间">
            <template slot-scope="scope">
              {{scope.row.dateEnd.slice(11, 16)}}
            </template>
            </el-table-column>
          <el-table-column
              prop="content"
              show-overflow-tooltip
              align="center"
              label="规则说明">
            </el-table-column>
            <el-table-column
              prop="gzState"
              show-overflow-tooltip
              align="center"
              label="规则使用情况">
              <template slot-scope="scope">
                <el-tag v-if="scope.row.gzState === '1'" type="success" disable-transitions>
                  {{ $dictUtils.getDictLabel("GZSYZT", scope.row.gzState, '-') }}
                </el-tag>
                <el-tag v-if="scope.row.gzState === '2'" type="primary" disable-transitions>
                  {{ $dictUtils.getDictLabel("GZSYZT", scope.row.gzState, '-') }}
                </el-tag>
                <el-tag v-if="scope.row.gzState === '3'" type="warning" disable-transitions>
                  {{ $dictUtils.getDictLabel("GZSYZT", scope.row.gzState, '-') }}
                </el-tag>
                <el-tag v-if="scope.row.gzState === '4'" type="danger" disable-transitions>
                  {{ $dictUtils.getDictLabel("GZSYZT", scope.row.gzState, '-') }}
                </el-tag>
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
<!--                <el-button v-if="hasPermission('xckqglkqgz:xcKqglKqgz:view')" type="text" icon="el-icon-view" size="small" @click="view(scope.row.id)">查看</el-button>-->
                <el-button v-if="hasPermission('xckqglkqgz:xcKqglKqgz:edit')" type="text" icon="el-icon-edit" size="small" @click="edit(scope.row.id)">修改</el-button>
<!--                <el-button v-if="hasPermission('xckqglkqgz:xcKqglKqgz:del')" type="text"  icon="el-icon-delete" size="small" @click="del(scope.row.id)">删除</el-button>-->
                <el-button v-if="scope.row.gzState === '2'" type="text" icon="el-icon-s-promotion" size="small" @click="publish(scope.row.id)">发布 </el-button>
                <el-button v-if="scope.row.gzState === '1'" type="text" icon="el-icon-video-pause" size="small" @click="pause(scope.row.id)">暂停 </el-button>
                <el-button v-if="scope.row.gzState === '1'" type="text" icon="el-icon-error" size="small" @click="close(scope.row.id)">关闭 </el-button>
                <el-button type="text" icon="el-icon-user-solid" size="small" @click="userConfig(scope.row.id)">分配用户</el-button>
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
          <XcKqglKqgzForm  ref="xcKqglKqgzForm" @refreshDataList="refreshList"></XcKqglKqgzForm>
          </el-card>
        </el-tab-pane>
        <!--  考勤规则Tab页结束-->
        <!--  排班设置Tab页开始-->
        <el-tab-pane label="排班设置" name="pbsz">
<!--          <XcKqglPbglForm ref="xcKqglPbglForm"></XcKqglPbglForm>-->
          <pbsz ref="pbsz"></pbsz>
        </el-tab-pane>
        <!--  排班设置Tab页结束-->
        <!--  节假日设置Tab页开始-->
        <el-tab-pane label="节假日设置" name="jjrsz">
          <XcKqglJjrIndex ref="xcKqglJjrIndex"></XcKqglJjrIndex>
        </el-tab-pane>
        <!--  节假日设置Tab页结束-->
      </el-tabs>
    <user-select ref="userSelect" @doSubmit="selectUsersToInput" :selectData="selectData"></user-select>
    </div>
</template>

<script>
  import XcKqglKqgzForm from './XcKqglKqgzForm'
  import XcKqglPbglForm from '../pbsz/XcKqglPbglForm.vue'
  import XcKqglJjrIndex from '../jjr/XcKqglJjrIndex.vue'
  import SelectTree from '@/components/treeSelect/treeSelect.vue'
  import pbsz from '../pbsz/pbsz'
  import userSelect from '@/components/userSelect/UserSelectDialog'
  export default {
    data () {
      return {
        activeName: 'kqgz',
        searchForm: {
          flbh: {
            id: ''
          },
          gzState: '',
          dateStart: '',
          dateEnd: ''
        },
        dataList: [],
        pageNo: 1,
        pageSize: 10,
        total: 0,
        orderBy: '',
        dataListSelections: [],
        isImportCollapse: false,
        loading: false,
        count: 0,
        selectData: [], // 选择的数据
        selectedId: ''  // 分配用户时存储点击的考勤id
      }
    },
    components: {
      SelectTree,
      XcKqglPbglForm,
      XcKqglKqgzForm,
      XcKqglJjrIndex,
      pbsz,
      userSelect
    },
    activated () {
      this.refreshList()
    },
    methods: {
      // 获取数据列表
      refreshList () {
        this.loading = true
        this.$http({
          url: '/xckqglkqgz/xcKqglKqgz/list',
          method: 'get',
          params: {
            'pageNo': this.pageNo,
            'pageSize': this.pageSize,
            'orderBy': this.orderBy,
            beginDateStart: this.searchForm.dateStart[0],
            endDateStart: this.searchForm.dateStart[1],
            beginDateEnd: this.searchForm.dateEnd[0],
            endDateEnd: this.searchForm.dateEnd[1],
            ...this.lodash.omit(this.searchForm, 'dateStart', 'dateEnd')
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
        this.$refs.xcKqglKqgzForm.init('add', '')
      },
      // 修改
      edit (id) {
        id = id || this.dataListSelections.map(item => {
          return item.id
        })[0]
        this.$refs.xcKqglKqgzForm.init('edit', id)
      },
      // 查看
      view (id) {
        this.$refs.xcKqglKqgzForm.init('view', id)
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
            url: '/xckqglkqgz/xcKqglKqgz/delete',
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
        this.$utils.download('/xckqglkqgz/xcKqglKqgz/import/template')
      },
      exportExcel () {
        let params = {
          beginDateStart: this.searchForm.dateStart[0],
          endDateStart: this.searchForm.dateStart[1],
          beginDateEnd: this.searchForm.dateEnd[0],
          endDateEnd: this.searchForm.dateEnd[1],
          ...this.lodash.omit(this.searchForm, 'dateStart', 'dateEnd')
        }
        this.$utils.download('/xckqglkqgz/xcKqglKqgz/export', params)
      },
      resetSearch () {
        this.$refs.searchForm.resetFields()
        this.refreshList()
      },
      // 按需加载后端数据[tab]
      loadTab (tab, event) {
        // console.log(tab, event)
        if (tab.name === 'pbsz') {  // 排版设置
          // this.$refs.xcKqglPbglForm.refreshList()
          this.$refs.pbsz.refreshList()
        } else if (tab.name === 'jjrsz') {  // 节假日设置
          this.$refs.xcKqglJjrIndex.refreshList()
        }
      },
      // 发布 (发布状态为‘1’)
      publish (id) {
        this.$http({
          url: `/xckqglkqgz/xcKqglKqgz/updateGzState`,
          method: 'post',
          params: {
            id: id,
            gzState: '1'
          }
        }).then(({data}) => {
          this.loading = true
          if (data.success) {
            this.$message.success(data.msg)
          }
          this.refreshList()
        })
      },
      // 暂停 （暂停状态为3）
      pause (id) {
        this.$http({
          url: `/xckqglkqgz/xcKqglKqgz/updateGzState`,
          method: 'post',
          params: {
            id: id,
            gzState: '3'
          }
        }).then(({data}) => {
          this.loading = true
          if (data.success) {
            this.$message.success(data.msg)
          }
          this.refreshList()
        })
      },
      // 关闭 （关闭状态为4）
      close (id) {
        this.$http({
          url: `/xckqglkqgz/xcKqglKqgz/updateGzState`,
          method: 'post',
          params: {
            id: id,
            gzState: '4'
          }
        }).then(({data}) => {
          this.loading = true
          if (data.success) {
            this.$message.success(data.msg)
          }
          this.refreshList()
        })
      },
      // 分配用户
      userConfig (id) {
        this.selectData = []
        this.$nextTick(() => {
          this.$http({
            url: `/kqgzconfig/kqgzUser/list`,
            method: 'get',
            params: {kqgz: id, 'pageSize': -1}
          }).then(({data}) => {
            if (data && data.success) {
              let num = data.page.list.length
              this.loading = true
              if (num === 0) {
                this.$refs.userSelect.init()
              } else {
                data.page.list.forEach((kqgz, index) => {
                  this.$http.get(`/sys/user/queryById?id=${kqgz.users}`).then(({data}) => {
                    if (data.user && data.user.id !== '') {
                      this.selectData.push(data.user)
                    }
                    if (index === num - 1) {
                      this.$refs.userSelect.init()
                    }
                  })
                })
              }
              this.loading = false
            }
          })
        })
        this.selectedId = id
      },
      selectUsersToInput (users) {
        this.selectData = users
        let labelValue = users.map(user => { return user.id }).join(',')
        // this.name = users.map(user => { return user.name }).join(',')
        this.loading = true
        this.$nextTick(() => {
          this.$http({
            url: `/kqgzconfig/kqgzUser/save`,
            method: 'post',
            params: {
              kqgz: this.selectedId,
              users: labelValue
            }
          }).then(({data}) => {
            if (data && data.success) {
              this.publish(this.selectedId)
            }
          })
        })
      },
      selectable (row, index) {
        return row.id !== '1'
      }
    }
  }
</script>
<style scoped>
.searchForm {
  background-color: #ffffff;
}
.is-selected {
  color: #1989FA;
}
</style>
