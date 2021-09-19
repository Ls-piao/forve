export default function (target) {
  return [
      // 能源基地
        { columnName: 'energy_BSM', prop: 'BSM', label: '标识码', align: 'center', width: 100 },
        { columnName: 'energy_YSDM', prop: 'YSDM', label: '要素代码', align: 'center', minWidth: 100 },
        { columnName: 'energy_JDBH', prop: 'JDBH', label: '基地编号', align: 'center', width: 100 },
        { columnName: 'energy_JDMC', prop: 'JDMC', label: '基地名称', align: 'center', width: 100 },
        { columnName: 'energy_SZXZQ', prop: 'SZXZQ', label: '所在行政区', align: 'center', width: 100 },
        { columnName: 'energy_JDMJ', prop: 'JDMJ', label: '基地面积', align: 'center', width: 100 },
        { columnName: 'energy_GDZB', prop: 'GDZB', label: '拐点坐标', align: 'center', width: 100 },
        { columnName: 'energy_ZYKCDM', prop: 'ZYKCDM', label: '主要矿产代码', align: 'center', width: 100 },
        { columnName: 'energy_ZYKCMC', prop: 'ZYKCMC', label: '主要矿产名称', align: 'center', width: 100 },
        { columnName: 'energy_YSTKQZS', prop: 'YSTKQZS', label: '已设探矿权总数', align: 'center', minWidth: 140 },
        { columnName: 'energy_NSTKQZS', prop: 'NSTKQZS', label: '拟设探矿权总数', align: 'center', minWidth: 140 },
        { columnName: 'energy_YSCKQZS', prop: 'YSCKQZS', label: '已设采矿权总数', align: 'center', minWidth: 140 },
        { columnName: 'energy_YSKCGM', prop: 'YSKCGM', label: '已设采矿权设计开采规模', align: 'center', minWidth: 180 },
        { columnName: 'energy_BZ', prop: 'BZ', label: '备注', align: 'center', width: 100 },
        { columnName: 'energy_GHQ', prop: 'GHQ', label: '规划期', align: 'center', width: 100 },
        { columnName: 'energy_GHBZJB', prop: 'GHBZJB', label: '规划编制级别', align: 'center', width: 100 }

  ]
}
