export default function (target) {
  return [
      // 森林资源管理
        { columnName: 'forestry_BSM', prop: 'BSM', label: '标识码', align: 'center', width: 100 },
        { columnName: 'forestry_YSDM', prop: 'YSDM', label: '要素代码', align: 'center', width: 100 },
        { columnName: 'forestry_TBBH', prop: 'TBBH', label: '图斑编号', align: 'center', width: 100 },
        { columnName: 'forestry_LBBH', prop: 'LBBH', label: '林班编号', align: 'center', width: 100 },
        { columnName: 'forestry_XBBH', prop: 'XBBH', label: '小班编号', align: 'center', width: 100 },
        { columnName: 'forestry_DLBM', prop: 'DLBM', label: '一级地类编码', align: 'center', minWidth: 100 },
        { columnName: 'forestry_DLMC', prop: 'DLMC', label: '一级地类名称', align: 'center', minWidth: 100 },
        { columnName: 'forestry_DLBM2', prop: 'DLBM2', label: '二级地类编码', align: 'center', minWidth: 100 },
        { columnName: 'forestry_DLMC2', prop: 'DLMC2', label: '二级地类名称', align: 'center', minWidth: 100 },
        { columnName: 'forestry_QSXZ', prop: 'QSXZ', label: '权属性质', align: 'center', width: 100 },
        { columnName: 'forestry_QSDWDM', prop: 'QSDWDM', label: '权属单位代码', align: 'center', minWidth: 100 },
        { columnName: 'forestry_QSDWMC', prop: 'QSDWMC', label: '权属单位名称', align: 'center', minWidth: 100 },
        { columnName: 'forestry_ZLDWDM', prop: 'ZLDWDM', label: '坐落单位代码', align: 'center', minWidth: 100 },
        { columnName: 'forestry_ZLDWMC', prop: 'ZLDWMC', label: '坐落单位名称', align: 'center', minWidth: 100 },
        { columnName: 'forestry_TBMJ', prop: 'TBMJ', label: '图斑面积', align: 'center', width: 100 },
        { columnName: 'forestry_LZ', prop: 'LZ', label: '林种', align: 'center', width: 100 },
        { columnName: 'forestry_YBD', prop: 'YBD', label: '郁闭度', align: 'center', width: 100 }
  ]
}
