<template>
  <div class="jp-common-layout page">
    <div class="jp-common-layout-left" style="width: 280px">
      <div class="jp-common-title">
        <el-row :gutter="5">
          <el-col :span="20">
            <el-input
              placeholder="输入关键字进行过滤"
              size="small"
              v-model="filterText">
            </el-input>
          </el-col>
          <el-col :span="4">
            <el-button type="primary" @click="addTreeNode" size="small" icon="el-icon-plus" style="padding: 5px;margin-left: 4px;margin-top: 4px;" circle></el-button>
          </el-col>
        </el-row>
      </div>
      <div class="jp-common-el-tree-scrollbar el-scrollbar">
        <div class="el-scrollbar__wrap">
          <div class="el-scrollbar__view">
            <el-tree
              class="filter-tree"
              :data="photoTreeData"
              :props="{
                  value: 'id',             // ID字段名
                  label: 'name',         // 显示名称
                  children: 'children'    // 子级字段名
                }"
              default-expand-all
              highlight-current
              node-key="id"
              :filter-node-method="filterNode"
              :expand-on-click-node="false"
              @node-click="handleNodeClick"
              ref="carKindTree">
                   <span class="custom-tree-node" slot-scope="{ node, data}">
<!--                     style="font-weight:bold"-->
                    <span >{{ node.label }}</span>
                    <span>
                       <el-button type="text" class="tree-item-button" icon="el-icon-plus" @click="() => addChildTreeNode(data)">
                       </el-button>
                        <el-button type="text" class="tree-item-button" icon="el-icon-edit-outline" @click="() => editTreeNode(data)">
                       </el-button>
                        <el-button type="text" class="tree-item-button" icon="el-icon-delete" @click="() => delTreeNode(data)">
                       </el-button>
                    </span>
                  </span>
            </el-tree>
          </div>
        </div>
      </div>
    </div>
    <div class="jp-common-layout-center jp-flex-main">
      <el-form size="small" :inline="true" class="query-form" ref="searchForm" :model="searchForm" @keyup.enter.native="refreshList()" @submit.native.prevent>
        <el-form-item>
          <el-button  type="primary" @click="uploadPhoto()" size="small">上传照片</el-button>
        </el-form-item>
      </el-form>

      <div class="bg-white top">
<!--        <el-row :gutter="12">
          <el-col :span="8" v-for="data in dataList" :key="data.id" style="width: 25%;">
            <el-card class="box-card no-padding" style="margin-bottom:10px;height: 220px;text-align: center;padding: 0px;">
&lt;!&ndash;              <div v-if="data.title!==''">
                相片名称：{{ data.title }}   相片说明：{{data.content}}
              </div>&ndash;&gt;
&lt;!&ndash;              <div class="actCard" @mouseleave="hideDelBtn(data.id)" @mouseenter="showDelBtn(data.id)">
                <el-image
                  :src="data.photoPath"
                  :preview-src-list="srcList"
                  style="width: 100%;height: 220px" >
                </el-image>
                <div class="delete-img" :class="data.id" >
                  <i  @click="deleteImg(data.id)" ><p style="font-size: 15px;white-space:  nowrap; overflow: hidden; text-overflow: ellipsis;">相片名称：{{ data.title }}   相片说明：{{data.content}}</p>&nbsp;&nbsp;&nbsp;&nbsp;<div class="el-icon-delete"></div></i>
                </div>
              </div>&ndash;&gt;
              <div class="actCard" @mouseleave="hideDelBtn(data.id)" @mouseenter="showDelBtn(data.id)">
                <el-image
                  :src="data.photoPath"
                  :preview-src-list="srcList"
                  style="width: 100%;height: 220px" >
                </el-image>
                <div class="delete-img" :class="data.id" >
                  <i  @click="deleteImg(data.id)"  style="text-align: left;font-size: 15px">
&lt;!&ndash;                    <p style="font-size: 15px;white-space:  nowrap; overflow: hidden; text-overflow: ellipsis;">
                    相片名称：{{ data.title }}
                    相片说明：{{data.content}}
                    </p>&ndash;&gt;
                      <span>相片名称：{{ data.title }}</span><p style="white-space:  nowrap; overflow: hidden; text-overflow: ellipsis;">相片说明：{{data.content}}</p>
                      &nbsp;&nbsp;&nbsp;&nbsp;
                        <div class="el-icon-delete">
                        </div>
                  </i>
                </div>
              </div>
            </el-card>
          </el-col>
        </el-row>-->

        <el-row>
          <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4"  v-for="data in dataList" :key="data.id" style="width: 25%;">
           <el-card style="margin: 8px" :body-style="{ padding: '0px' }" shadow="always">
<!--            <el-card class="box-card no-padding" style="margin-bottom:10px;height: 220px;text-align: center;padding: 0px;">-->
<!--              <img :src="data.photoPath" class="image"
                   :preview-src-list="srcList"
                   style="width: 100%;height: 220px" >-->
             <el-image
               :src="data.photoPath"
               :preview-src-list="srcList"
               style="width: 100%;height: 220px" >
             </el-image>
<!--             <el-popover
               placement="right"
               title=""
               trigger="hover">
               <img :src="data.photoPath"/>
               <img slot="reference" :src="data.photoPath" :alt="data.photoPath" style="width: 100%;height: 220px" >
             </el-popover>-->
              <h3 class="jp-card-label">
                <el-row>
                  <el-col :span="16">
                    <div class="left">{{data.title}}</div>
                  </el-col>
                </el-row>
              </h3>

              <ul class="jp-card-actions">
                <li style="width: 25%">
                  <el-link :underline="false"  @click="deleteImg(data.id)"><i class="el-icon-delete"></i> 删除</el-link>
                </li>
                <li style="width: 25%">
<!--                  <el-link :underline="false"   v-if="hasPermission('xc:xcgl:xpjl:edit')" @click="edit(data.id)"><i class="el-icon-delete"></i> 删除</el-link>-->
                  <el-link :underline="false"  v-if="hasPermission('xc:xcgl:xpjl:edit')" @click="edit(data.id)"><i class="el-icon-edit-outline"></i> 编辑</el-link>
                </li>
<!--                <li style="width: 25%">
                <el-link :underline="false"   ><i class="el-icon-view"></i> 预览</el-link>
                </li>-->
              </ul>
            </el-card>
          </el-col>
        </el-row>

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
    </div>
    <XcBgzxLjflForm ref="xcBgzxLjflForm" @refreshTree="refreshTree"></XcBgzxLjflForm>
    <XpglForm ref="xpglForm" @refreshDataList="refreshList"></XpglForm>
  </div>
</template>

<script>
import XcBgzxLjflForm from './sort/SortForm'
import XpglForm from './AlbumForm'
export default {
  data () {
    return {
      searchForm: {
        flId: ''
      },
      deleteFlag: false,
      filterText: '',
      dataList: [],
      photoTreeData: [],
      srcList: [],
      pageNo: 1,
      pageSize: 12,
      total: 0,
      orderBy: '',
      dataListSelections: [],
      isImportCollapse: false,
      loading: false
    }
  },
  components: {
    XcBgzxLjflForm,
    XpglForm
  },
  activated () {
    this.refreshTree()
    this.refreshList()
  },
  watch: {
    filterText (val) {
      this.$refs.officeTree.filter(val)
    }
  },
  methods: {
    filterNode (value, data) {
      if (!value) return true
      return data.name.indexOf(value) !== -1
    },
    refreshTree () {
      this.$http({
        url: `/zxsq/flb/xcBgzxLjfl/treeData?flag=3`,
        method: 'get'
      }).then(({data}) => {
        this.photoTreeData = data.treeData
      })
    },
    addChildTreeNode (node) {
      this.$refs.xcBgzxLjflForm.init('addChild', {id: '', parent: {id: node.id, name: node.name}})
    },
    // 新增
    addTreeNode () {
      this.$refs.xcBgzxLjflForm.init('add', {id: '', parent: {id: '', name: ''}})
    },
    // 修改
    editTreeNode (data) {
      this.$refs.xcBgzxLjflForm.init('edit', {id: data.id, parent: {id: '', name: ''}})
    },
    // 修改
    edit (id) {
      id = id || this.dataListSelections.map(item => {
        return item.id
      })[0]
      this.$refs.xpglForm.init('edit', id)
    },
    delTreeNode (data) {
      this.$confirm(`确定删除所选项吗?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.loading = true
        this.$http({
          url: '/zxsq/flb/xcBgzxLjfl/delete',
          method: 'delete',
          params: {'id': data.id}
        }).then(({data}) => {
          if (data && data.success) {
            this.$message.success(data.msg)
            this.loading = false
            this.refreshTree()
            this.refreshList()
          }
        })
      })
    },
    // 获取数据列表
    refreshList () {
      this.loading = true
      this.$http({
        url: '/xc/xcgl/xpjl/list',
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
          data.page.list.forEach((item, index) => {
            this.srcList.push(item.photoPath)
          })
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
      if (obj.prop === 'office.name') {
        obj.prop = 'o.name'
      }
      if (obj.prop === 'company.name') {
        obj.prop = 'c.name'
      }
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
    uploadPhoto () {
      if (this.searchForm.flId === '' || this.searchForm.flId === undefined) {
        this.$message.error('请先选择一条相片类型')
      } else {
        this.$refs.xpglForm.init('add', this.searchForm.flId)
      }
    },
    handleSuccess (res, file) {
      if (res.success) {
        this.$message.success({dangerouslyUseHTMLString: true,
          message: res.msg})
      } else {
        this.$message.error(res.msg)
      }
    },
    handleNodeClick (data) {
      this.searchForm.flId = data.id
      this.refreshList()
    },
    resetSearch () {
      this.refreshList()
    },
    // 删除图片
    deleteImg (id) {
      this.$confirm(`您确认要删除此照片吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.loading = true
        this.$http({
          url: '/xc/xcgl/xpjl/delete',
          method: 'delete',
          params: {'id': id}
        }).then(({data}) => {
          this.loading = false
          if (data && data.success) {
            this.$message.success({dangerouslyUseHTMLString: true,
              message: data.msg})
            this.refreshList()
          }
        })
      })
    },
    showDelBtn (id) {
      alert(11111)
    },
    hideDelBtn (id) {
      let div = document.getElementsByClassName(id)[0]
      div.style.display = 'none'
    }
  }
}
</script>
<style lang="scss" scoped>
 .no-padding  ::v-deep .el-card__body {
    overflow: auto;
    padding: 0px;
  }
  // 删除图片
  .delete-img {
    display: none;
    position: absolute;
    width: 23.99%;
    height: 215px;
    line-height: 120px;
    //left: 0.5%;
    margin-top: -222px;
    background: rgba(59, 60, 61, 0.5);
    // box-sizing: content-box;
    z-index: 999;
    cursor: pointer;
    text-align: right;
    i {
      margin: 8px 10px 0 0;
      display: block;
      font-size: 24px;
      color: white;
    }
  }
</style>
