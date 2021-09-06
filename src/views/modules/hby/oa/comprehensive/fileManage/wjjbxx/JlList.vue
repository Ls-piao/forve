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
        <!-- <el-button v-if="hasPermission('filemanage:wjxx:wjjbxx:add')" type="primary" size="small" icon="el-icon-plus" @click="add()">新建</el-button> -->
        <!-- <el-button v-if="hasPermission('filemanage:wjxx:wjjbxx:edit')" type="warning" size="small" icon="el-icon-edit-outline" @click="edit()"
         :disabled="dataListSelections.length != 1" plain>修改</el-button> -->
        <!-- <el-button v-if="hasPermission('filemanage:wjxx:wjjbxx:del')" type="danger"   size="small" icon="el-icon-delete" @click="del()"
                  :disabled="dataListSelections.length <= 0" plain>删除
        </el-button> -->
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
    methods: {
      detail (row) {
        var key = ''
        var title1 = ''
        if (row.state === '0') {
          key = 'UserTask_190qewr'
          title1 = '标题：' + row.title + '，部门领导审核,发起人：' + row.fqr
        } else if (row.state === '1') {
          key = 'UserTask_0tt6mbc'
          title1 = '标题：' + row.title + '，待归档,发起人：' + row.fqr
        } else if (row.state === '2') {
          key = 'UserTask_19stvr6'
          title1 = '标题：' + row.title + '，部门领导审批退回,发起人：' + row.fqr
        } else {
          key = 'UserTask_0tt6mbc'
          title1 = '标题：' + row.title + '，已归档,发起人：' + row.fqr
        }
        this.$http.get('/flowable/task/getTaskDef', {params: {
          taskDefKey: key,
          procInsId: row.procInsId,
          procDefId: 'Process_1629186347998:19:528fbe7c-017b-11ec-b5dc-f83441b94772'
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
          url: '/filemanage/wjjbxx/zhglWjglBasWjglJbxx/list',
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

      resetSearch () {
        this.$refs.searchForm.resetFields()
        this.refreshList()
      }
    }
  }
</script>
