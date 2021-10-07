import dictUtils from '@/utils/dictUtils'
export default function (target) {
  return [
        { columnName: 'shop_id', prop: 'id', label: '商铺编号', align: 'center', width: 100 },
        { columnName: 'shop_name', prop: 'shname', label: '店名', align: 'center', minWidth: 100 },
        { columnName: 'shop_commnuity', prop: 'sqname', label: '所属社区', align: 'center', width: 100 },
        { columnName: 'shop_number', prop: 'mph', label: '门牌号', align: 'center', width: 100 },
        { columnName: 'shop_place', prop: 'wz', label: '商户位置', align: 'center', minWidth: 100 },
        { columnName: 'shop_license', prop: 'yyzz', label: '营业执照', align: 'center', minWidth: 100 },
        { columnName: 'shop_legalPerson', prop: 'frname', label: '法人姓名', align: 'center', width: 100 },
        { columnName: 'shop_legalPersonJob', prop: 'frsf', label: '法人身份', align: 'center', width: 100 },
        { columnName: 'shop_legalPersonForm', prop: 'frhj', label: '法人户籍', align: 'center', minWidth: 100 },
        { columnName: 'shop_type', prop: 'fwxz', label: '房间性质', align: 'center', width: 100 },
    { columnName: 'shop_industry',
      prop: 'cszy',
      label: '从事行业',
      align: 'center',
      minWidth: 100,
      render: (h, c) => {
        return <span>{dictUtils.getDictLabel('ZRZY_SQFW_HYFL', c.row.cszy)}</span>
      }
    },
        { columnName: 'shop_area', prop: 'mj', label: '面积', align: 'center', width: 100 },
        { columnName: 'shop_desc', prop: 'remarks', label: '备注', align: 'center', minWidth: 100 },
    { columnName: 'shop_control',
      fixed: 'right',
      prop: 'desc',
      label: '操作',
      align: 'center',
      width: 220,
      render: (h, c) => {
        return (
                    <div>
                            <span class="opt-view" onClick={() => target.view(c.row)}><i class='el-icon-view'>&nbsp;</i>查阅</span>
                            <span class="opt-edit" onClick={() => target.edit(c.row)}><i class='el-icon-edit'>&nbsp;</i>编辑</span>
                            <span class='opt-del' onClick={() => target.handleDelete(c.row)}><i class='el-icon-delete'>&nbsp;</i>删除</span>
                    </div>
        )
      }
    },

        // 社区活动
        { columnName: 'service_id', prop: 'id', label: '活动编号', align: 'center', width: 100 },
        { columnName: 'service_title', prop: 'hdname', label: '活动名称', align: 'center', minWidth: 100 },
        { columnName: 'service_tip', prop: 'zy', label: '摘要', align: 'center', minWidth: 100 },
        { columnName: 'service_type', prop: 'type', label: '类型', align: 'center', width: 100 },
    { columnName: 'service_avatar',
      prop: 'pic',
      label: '封面图片',
      align: 'center',
      width: 100,
      render: (h, c) => {
        return <span> <img src={c.row.pic} class="img" onClick={() => target.preview(c.row, 'pic')}></img> </span>
      }
    },

        // 咨询管理
        { columnName: 'community_id', prop: 'id', label: '咨询编号', align: 'center', width: 100 },
        { columnName: 'community_title', prop: 'zxmc', label: '咨询名称', align: 'center', minWidth: 100 },
        { columnName: 'community_time', prop: 'zxsj', label: '咨询时间', align: 'center', minWidth: 100 },
        { columnName: 'community_accept', prop: 'bzxr', label: '被咨询人', align: 'center', width: 100 },
        { columnName: 'community_person', prop: 'zxr', label: '咨询人', align: 'center', width: 100 },
        // { columnName: 'community_status', prop: 'status', label: '状态', align: 'center', width: 100 },

        // 残疾人管理
        { columnName: 'disable_id', prop: 'id', label: '残疾人编号', align: 'center', width: 100 },
        { columnName: 'disable_name', prop: 'name', label: '姓名', align: 'center', width: 100 },
        { columnName: 'disable_age', prop: 'age', label: '年龄', align: 'center', width: 100 },
        { columnName: 'disable_community', prop: 'sqname', label: '所属社区', align: 'center', width: 100 },
        { columnName: 'disable_building', prop: 'ld', label: '楼栋', align: 'center', minWidth: 100 },
        { columnName: 'disable_unit', prop: 'dw', label: '单位', align: 'center', width: 100 },
        { columnName: 'disable_number', prop: 'mph', label: '门牌号', align: 'center', width: 100 },
        { columnName: 'disable_status', prop: 'type', label: '状态', align: 'center', width: 100 },
        { columnName: 'disable_desc', prop: 'remarks', label: '描述', align: 'center', minWidth: 100 },

        // 消息咨询管理
        { columnName: 'message_id', prop: 'id', label: '消息编号', align: 'center', width: 100 },
        { columnName: 'message_title', prop: 'title', label: '标题', align: 'center', width: 120 },
        { columnName: 'message_content', prop: 'nr', label: '内容', align: 'center', minWidth: 100 },
        { columnName: 'message_file', prop: 'fj', label: '附件', align: 'center', width: 100 },
        { columnName: 'message_view', prop: 'view', label: '查阅', align: 'center', width: 100 },
        { columnName: 'message_user', prop: 'create_by', label: '发布者', align: 'center', width: 100 },
        { columnName: 'message_status', prop: 'status', label: '状态', align: 'center', width: 100 },

    { columnName: 'message_control',
      fixed: 'right',
      prop: 'desc',
      label: '操作',
      align: 'center',
      width: 220,
      render: (h, c) => {
        return (
                <div>
                        <span class="opt-view" onClick={() => target.handleBatch(c.row)}><i class='el-icon-circle-check'>&nbsp;</i>审核</span>
                        <span class="opt-edit" onClick={() => target.view(c.row)}><i class='el-icon-view'>&nbsp;</i>查阅</span>
                </div>
        )
      }
    },
    { columnName: 'message_commit_control',
      fixed: 'right',
      prop: 'desc',
      label: '操作',
      align: 'center',
      width: 220,
      render: (h, c) => {
        return (
                <div>
                        <span class="opt-view" onClick={() => target.fabu(c.row)}><i class='el-icon-thumb'>&nbsp;</i>发布</span>
                        <span class="opt-edit" onClick={() => target.view(c.row)}><i class='el-icon-view'>&nbsp;</i>查阅</span>
                </div>
        )
      }
    },

          // 房屋管理
          { columnName: 'house_id', prop: 'id', label: '房屋编号', align: 'center', width: 100 },
          { columnName: 'house_community', prop: 'sqname', label: '社区名称', align: 'center', minWidth: 100 },
          { columnName: 'house_xiaoqu', prop: 'xqname', label: '小区名称', align: 'center', minWidth: 100 },
          { columnName: 'house_building', prop: 'ldId', label: '楼栋号', align: 'center', minWidth: 100 },
          { columnName: 'house_unit', prop: 'dy', label: '单元号', align: 'center', width: 100 },
          { columnName: 'house_number', prop: 'mph', label: '门牌号', align: 'center', width: 100 },
          { columnName: 'house_houseType', prop: 'fwxz', label: '房屋性质', align: 'center', width: 100 },
          { columnName: 'house_isUse', prop: 'isrz', label: '是否入住', align: 'center', width: 100 },
          { columnName: 'house_floatPerson', prop: 'isld', label: '流动人口', align: 'center', width: 100 },
          { columnName: 'house_point', prop: 'zdrk', label: '重点人口', align: 'center', width: 100 },
          { columnName: 'house_hostName', prop: 'hzname', label: '户主', align: 'center', width: 100 },
          { columnName: 'house_hostNumber', prop: 'cqzh', label: '产权证号', align: 'center', minWidth: 100 },

          // 居民管理
          { columnName: 'resident_id', prop: 'id', label: '房屋编号', align: 'center', width: 80 },
          { columnName: 'resident_community', prop: 'sqname', label: '社区名称', align: 'center', minWidth: 80 },
          { columnName: 'resident_xiaoqu', prop: 'xqname', label: '小区名称', align: 'center', minWidth: 80 },
          { columnName: 'resident_building', prop: 'ldId', label: '楼栋号', align: 'center', minWidth: 80 },
          { columnName: 'resident_unit', prop: 'dy', label: '单元号', align: 'center', width: 80 },
          { columnName: 'resident_number', prop: 'mph', label: '门牌号', align: 'center', width: 80 },
          { columnName: 'resident_name', prop: 'name', label: '姓名', align: 'center', width: 80 },
          { columnName: 'resident_sex', prop: 'sax', label: '性别', align: 'center', width: 80 },
          { columnName: 'resident_relation', prop: 'cygx', label: '成员关系', align: 'center', width: 80 },
          { columnName: 'resident_phone', prop: 'phone', label: '电话', align: 'center', minWidth: 100 },
          { columnName: 'resident_work', prop: 'gzdw', label: '工作单位', align: 'center', width: 80 },
          { columnName: 'resident_isReligious', prop: 'isxj', label: '是否信教', align: 'center', width: 80 },
          { columnName: 'resident_isLow', prop: 'isdbh', label: '是否低保户', align: 'center', width: 100 },
          { columnName: 'resident_idCard', prop: 'cardid', label: '身份证号码', align: 'center', minWidth: 160 },
          { columnName: 'resident_born', prop: 'datecs', label: '出生日期', align: 'center', minWidth: 80 },
          { columnName: 'resident_mz', prop: 'mz', label: '民族', align: 'center', width: 80 },
          { columnName: 'resident_isFloat', prop: 'isld', label: '是否流动人员', align: 'center', width: 120 },
          { columnName: 'resident_jyqk', prop: 'jyqk', label: '就业情况', align: 'center', width: 80 },
          { columnName: 'resident_whcd', prop: 'whcd', label: '文化程度', align: 'center', width: 80 },
          { columnName: 'resident_health', prop: 'jkzk', label: '健康状况', align: 'center', width: 80 },
          { columnName: 'resident_jycs', prop: 'jycs', label: '节孕措施', align: 'center', width: 80 },
          { columnName: 'resident_hj', prop: 'hjdz', label: '户籍地址', align: 'center', minWidth: 140 },
          { columnName: 'resident_zzmm', prop: 'zzmm', label: '政治面貌', align: 'center', width: 80 },
          { columnName: 'resident_hyzk', prop: 'hyzk', label: '婚姻状况', align: 'center', width: 80 },
          { columnName: 'resident_cjlb', prop: 'cjlb', label: '残疾类别', align: 'center', width: 80 },
          { columnName: 'resident_desc', prop: 'remarks', label: '备注', align: 'center', minWidth: 150 },
    { columnName: 'resident_avatar',
      prop: 'pic',
      label: '照片',
      align: 'center',
      minWidth: 80,
      render: (h, c) => {
        return <span> <img src={c.row.pic} class="img" onClick={() => target.preview(c.row, 'pic')}></img> </span>
      }
    }

  ]
}
