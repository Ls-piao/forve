export default function (target) {
  return [
        { columnName: 'apply_ID', prop: 'bh', label: '申请表编号', align: 'center', minWidth: 100 },
        { columnName: 'apply_qs', prop: 'qs', label: '权属', align: 'center', width: 100 },
        { columnName: 'apply_createTime', prop: 'tbrq', label: '填表日期', align: 'center', width: 130 },
        { columnName: 'apply_dwgr', prop: 'danwei', label: '单位个人', align: 'center', width: 100 },
        { columnName: 'apply_djql', prop: 'djql', label: '登记权力', align: 'center', width: 100 },
        { columnName: 'apply_frdb', prop: 'faren', label: '法人代表', align: 'center', width: 130 },
        { columnName: 'apply_txdz', prop: 'txdz', label: '通讯地址', align: 'center', minWidth: 140 },
        { columnName: 'apply_sfzh', prop: 'idcard', label: '身份证号', align: 'center', width: 150 },
        { columnName: 'apply_ldsyqqlr', prop: 'ldsyq', label: '林地所有权权利人', align: 'center', width: 100 },
        { columnName: 'apply_ldsyqqlr2', prop: 'ldsyqr', label: '林地使用权权利人', align: 'center', width: 100 },
        { columnName: 'apply_slhlmsyqqlr', prop: 'sllmsyqr', label: '森林或林木所有权权利人', align: 'center', width: 100 },
        { columnName: 'apply_slhlmsyqqlr2', prop: 'slsyqr', label: '森林或林木使用权权利人', align: 'center', width: 100 },
    { columnName: 'apply_control',
      width: 220,
      fixed: 'right',
      label: '操作',
      align: 'center',
      render: (h, c) => {
        return (
                <div>
                     <span class='opt-edit' onClick={() => target.edit(c.row)}><i class='el-icon-edit'>&nbsp;</i>编辑</span>
                     <span class='opt-submit' onClick={() => target.handleSubmit(c.row)}><i class='el-icon-circle-check'>&nbsp;</i>提交</span>
                        <span class="opt-del" onClick={() => target.handleDelete(c.row)}><i class='el-icon-delete'>&nbsp;</i>删除</span>
                   </div>
        )
      }
    },
    { columnName: 'apply_batch_control',
      width: 180,
      fixed: 'right',
      label: '操作',
      align: 'center',
      render: (h, c) => {
        return (
                <div>
                        <span class="opt-edit" onClick={() => target.view(c.row)}><i class='el-icon-view'>&nbsp;</i>查阅</span>
                     <span class='opt-batch' onClick={() => target.handleBatch(c.row)}><i class='el-icon-circle-check'>&nbsp;</i>审核</span>
                   </div>
        )
      }
    },
    { columnName: 'cert_status',
      prop: 'status',
      label: '打印状态',
      align: 'center',
      width: 100,
      render: (h, c) => {
        return <span style={`color:${c.row.status === 1 ? '#67C23A' : '#F56C6C'}`}>{c.row.status === 1 ? '成功' : '失败'}</span>
      }
    },

    { columnName: 'cert_control',
      width: 100,
      fixed: 'right',
      label: '操作',
      align: 'center',
      render: (h, c) => {
        return (
                <div>
                        <span class="opt-edit" onClick={() => target.view(c.row)}><i class='el-icon-view'>&nbsp;</i>查阅</span>
                     {/* <span class='opt-batch' onClick={() => target.handleBatch(c.row)}><i class='el-icon-circle-check'>&nbsp;</i>打印</span> */}
                   </div>
        )
      }
    }
  ]
}
