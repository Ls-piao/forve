<template>
    <div class="page">
      <el-form size="small" :inline="true" class="query-form" ref="searchForm" :model="searchForm" @keyup.enter.native="refreshList()" @submit.native.prevent>
          <el-form-item prop="title">
            <el-input size="small" v-model="searchForm.title" placeholder="标题" clearable></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="refreshList()" size="small" icon="el-icon-search">查询</el-button>
            <el-button @click="resetSearch()" size="small" icon="el-icon-refresh-right">重置</el-button>
          </el-form-item>
      </el-form>
      <div class="bg-white top">
      <el-row>
        <el-button-group class="pull-right">

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
        prop="title"
        show-overflow-tooltip
        sortable="custom"
        label="标题">
      </el-table-column>
      <el-table-column
        prop="fileType"
        show-overflow-tooltip
        sortable="custom"
        label="文件类型">
      </el-table-column>
    <el-table-column
        prop="lb.name"
        show-overflow-tooltip
        sortable="custom"
        label="文件类别">
      </el-table-column>
    <el-table-column
        prop="state"
        label="状态">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.state === '0'" size="small">待审核</el-tag>
          <el-tag v-else-if="scope.row.state === '1'" size="small">待归档</el-tag>
          <el-tag v-else-if="scope.row.state === '2'" size="small" type="danger">审核退回</el-tag>
          <el-tag v-else-if="scope.row.state === '3'" size="small" type="success">已归档</el-tag>
        </template>
      </el-table-column>
    <el-table-column
        prop="lev"
        show-overflow-tooltip
        sortable="custom"
        label="文件秘密级别">
      </el-table-column>
      <el-table-column
        header-align="center"
        align="center"
        fixed="right"
        :key="Math.random()"
        width="200"
        label="操作">
        <template  slot-scope="scope">
          <el-button type="text" v-if="hasPermission('filemanage:wjxx:wjjbxx:view') || hasPermission('filemanage:wjxx:wjjbxx:edit')" icon="el-icon-view" size="small" @click="detail(scope.row)">查看</el-button>
          <el-button type="text" v-if="scope.row.state === '0' || scope.row.state === '1'" size="small" @click="todo(scope.row)">办理</el-button>
<!--         <el-button  type="text" size="small" @click="trace(scope.row)">进度</el-button>-->
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
    <!-- 附件下载-->
    <el-dialog
      :title="accessoryTitle"
      :close-on-click-modal="false"
      v-dialogDrag
      :visible.sync="accessoryDialog">
      <el-form size="small" v-loading="loading"
               label-width="120px">
        <el-row :gutter="24">
          <el-upload ref="fileUrl"
                     v-if="visible"
                     :disabled="true"
                     :action="`${this.$http.BASE_URL}/sys/file/webupload/upload?uploadPath=/fileManage`"
                     :headers="{token: $cookie.get('token')}"
                     :on-preview="(file, fileList) => {$window.location.href = (file.response && file.response.url) || file.url}"
                     :file-list="fileUrlArra">
          </el-upload>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
      <el-button size="small" @click="accessoryDialog = false"
      >关闭</el-button>
    </span>
    </el-dialog>
<!--      <el-dialog
        title="查看进度"
        :close-on-click-modal="true"
        :visible.sync="visible"
        v-dialogDrag
        width="70%"
        height="600px">

        <flow-chart ref="preview" :processInstanceId="processInstanceId"></flow-chart>
      </el-dialog>-->
  </div>
</template>

<script>
  import pick from 'lodash.pick'
  export default {
    data () {
      return {
        fileUrlArra: [],
        accessoryDialog: false,
        accessoryTitle: '附件下载',
        visible: true,
        taskId: '',
        taskName: '',
        taskDefKey: '',
        procInsId: '',
        procDefId: '',
        procDefKey: '',
        def: '',
        df: '',
        key: '',
        status: '',
        searchForm: {
          title: ''
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
    },
    activated () {
      this.refreshList()
    },
    computed: {
      userName () {
        return JSON.parse(localStorage.getItem('user')).name
      }
    },
    methods: {
      start () {
        // 读取流程表单
        let tabTitle = `发起流程【文件审批】`
        let processTitle = `${this.userName} 在 ${this.moment(new Date()).format('YYYY-MM-DD HH:mm')} 发起了 [文件审批]`
        this.$http.get('/flowable/task/getTaskDef', {params: {
          procDefId: 'Process_1629186347998:19:528fbe7c-017b-11ec-b5dc-f83441b94772',
          status: 'start'
        }}).then(({data}) => {
          if (data.success) {
            this.$router.push({
              path: '/flowable/task/TaskForm',
              query: {procDefId: 'Process_1629186347998:19:528fbe7c-017b-11ec-b5dc-f83441b94772', procDefKey: 'Process_1629186347998', status: 'start', title: tabTitle, formType: data.flow.formType, formUrl: data.flow.formUrl, formTitle: processTitle}
            })
          }
        })
      },
      detail (row) {
        var title1 = ''
        if (row.state === '0') {
          title1 = '标题：' + row.title + '，部门领导审核,发起人：' + row.fqr
        } else if (row.state === '1') {
          title1 = '标题：' + row.title + '，待归档,发起人：' + row.fqr
        } else if (row.state === '2') {
          title1 = '标题：' + row.title + '，部门领导审批退回,发起人：' + row.fqr
        } else {
          title1 = '标题：' + row.title + '，已归档,发起人：' + row.fqr
        }
        this.$http.get('/flowable/task/getTaskDef', {params: {
          taskDefKey: row.key,
          procInsId: row.procInsId,
          procDefId: row.def
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
        this.$http({
          url: '/filemanage/wjjbxx/zhglWjglBasWjglJbxx/listBySp',
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
      todo (row) {
        var title1 = ''
        if (row.state === '0') {
          title1 = '标题：' + row.title + '，部门领导审核,发起人：' + row.fqr
        } else if (row.state === '1') {
          title1 = '标题：' + row.title + '，待归档,发起人：' + row.fqr
        } else if (row.state === '2') {
          title1 = '标题：' + row.title + '，部门领导审批退回,发起人：' + row.fqr
        } else {
          title1 = '标题：' + row.title + '，已归档,发起人：' + row.fqr
        }
        this.$http.get('/flowable/task/getTaskDef', {params: {
          taskId: row.taskId,
          taskName: title1,
          taskDefKey: row.key,
          procInsId: row.procInsId,
          procDefId: row.def,
          procDefKey: row.df,
          status: 'todo'
        }}).then(({data}) => {
          if (data.success) {
            this.$router.push({
              path: '/flowable/task/TaskForm',
              query: {formTitle: title1, title: title1, ...pick(data.flow, 'formType', 'formReadOnly', 'formUrl', 'procDefKey', 'taskDefKey', 'procInsId', 'procDefId', 'taskId', 'status', 'title', 'businessId')}
            })
          }
        })
      },
      resetSearch () {
        this.$refs.searchForm.resetFields()
        this.refreshList()
      }
    }
  }
</script>
