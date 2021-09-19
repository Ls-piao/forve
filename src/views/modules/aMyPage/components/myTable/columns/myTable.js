/*
 * columnName：数组的唯一标识
 * render:表示函数式组件，供渲染
 */
export default function (target) {
  return [
        // 表格测试
        { columnName: 'plants_CNzhong', prop: 'CNzhongName', label: '中文种称', align: 'center', width: 100 },
        { columnName: 'plants_CNke', prop: 'CNkeName', label: '中文科称', align: 'center', width: 100 },
        { columnName: 'plants_CNshu', prop: 'CNshuName', label: '中文属称', align: 'center', width: 100 },
        { columnName: 'plants_ENzhong', prop: 'ENzhongName', label: '拉丁种称', align: 'center', width: 100 },
        { columnName: 'plants_ENke', prop: 'ENkeName', label: '拉丁科名', align: 'center', width: 100 },
        { columnName: 'plants_ENshu', prop: 'ENshuName', label: '拉丁属名', align: 'center', width: 100 },
        { columnName: 'plants_dangerType', prop: 'dangerType', label: '濒危程度', align: 'center', width: 100 },
        { columnName: 'plants_protectType', prop: 'protectType', label: '保护等级', align: 'center', width: 100 },
        { columnName: 'plants_area', prop: 'area', label: '分布地域', align: 'center', width: 100 },
        { columnName: 'plants_point', prop: 'point', label: '形态特征', align: 'center', minWidth: 330 },
        { columnName: 'plants_place', prop: 'place', label: '群落特征', align: 'center', minWidth: 330 },
        { columnName: 'plants_associated', prop: 'associated', label: '伴生种', align: 'center', width: 100 },
        { columnName: 'plants_price', prop: 'price', label: '保护价值', align: 'center', width: 100 },
        { columnName: 'plants_protect', prop: 'protect', label: '保护措施', align: 'center', width: 100 },
    { columnName: 'plants_huoben',
      prop: 'huoben',
      label: '活本图',
      align: 'center',
      width: 100,
      render: function (h, c) {
        if (c.row.huoben.length > 1) {
          return (

                    <img onClick={() => target.preview(c.row, 'huoben')} src={c.row.huoben} class="img" />
          )
        }
      }},
    { columnName: 'plants_biaoben',
      prop: 'biaoben',
      label: '标本图',
      align: 'center',
      width: 100,
      render: function (h, c) {
        if (c.row.biaoben.length > 1) {
          return (

                    <img onClick={() => target.preview(c.row, 'biaoben')} src={c.row.biaoben} class="img" />
          )
        }
      }
    },

    // 林业表格
    { columnName: 'forest_house', prop: 'house', label: '林业局', align: 'center', width: 100 },
    { columnName: 'forest_picId', prop: 'picId', label: '图斑编号', align: 'center', width: 100 },
    { columnName: 'forest_dangerType', prop: 'dangerType', label: '灾害类型', align: 'center', width: 100 },
    { columnName: 'forest_year', prop: 'year', label: '年度', align: 'center', width: 100 },
    { columnName: 'forest_month', prop: 'month', label: '月份', align: 'center', width: 100 },
    { columnName: 'forest_MonitorArea', prop: 'MonitorArea', label: '监测面积', align: 'center', width: 100 },
    { columnName: 'forest_DisasterArea', prop: 'DisasterArea', label: '受灾面积', align: 'center', width: 100 },
    { columnName: 'forest_light', prop: 'light', label: '发生轻度灾害', align: 'center', width: 100 },
    { columnName: 'forest_middle', prop: 'middle', label: '发生中度灾害', align: 'center', width: 100 },
    { columnName: 'forest_height', prop: 'height', label: '发生重度灾害', align: 'center', width: 100 },
    { columnName: 'forest_location', prop: 'location', label: '四至坐标', align: 'center', width: 100 },
    { columnName: 'forest_prospect',
      prop: 'house',
      label: '受灾远景样片',
      align: 'center',
      width: 100,
      render: function (h, c) {
        if (c.row.prospect.length > 1) {
          return (

                <img onClick={() => target.preview(c.row, 'prospect')} src={c.row.prospect} class="img" />
          )
        }
      }
    },
    { columnName: 'forest_close',
      prop: 'house',
      label: '受灾近景样片',
      align: 'center',
      width: 100,
      render: function (h, c) {
        if (c.row.close.length > 1) {
          return (
                <img onClick={() => target.preview(c.row, 'close')} src={c.row.close} class="img" />
          )
        }
      }
    },

    // 人类活动视频
    { columnName: 'human_cameraId', prop: 'cameraId', label: '拍摄相机编号', align: 'center', width: 100 },
    { columnName: 'human_videoId', prop: 'videoId', label: '视频编号', align: 'center', width: 100 },
    { columnName: 'human_result', prop: 'result', label: '判读结果', align: 'center', width: 100 },
    { columnName: 'human_time', prop: 'time', label: '视频时长（分钟）', align: 'center', width: 130 },
    { columnName: 'human_creatTime', prop: 'creatTime', label: '相机拍摄时间', align: 'center', width: 150 },
    { columnName: 'human_type', prop: 'type', label: '类别', align: 'center', width: 100 },
    { columnName: 'human_place', prop: 'place', label: '存储位置', align: 'center', minWidth: 100 },
    { columnName: 'human_des', prop: 'des', label: '备注说明', align: 'center', minWidth: 100 },
    { columnName: 'human_del',
      fixed: 'right',
      prop: 'des',
      label: '记录操作',
      align: 'center',
      width: 100,
      render: (h, c) => {
        return (
            <div>
                <span class="operation delete" onClick={(e) => target.handleDelete(c.row)}><i class='el-icon-delete'></i></span>
            </div>
        )
      } },
    { columnName: 'human_control',
      fixed: 'right',
      label: '视频操作',
      align: 'center',
      width: 140,
      render: (h, c) => {
        if (c.row.isCollect === true) {
          return (
                <div>
                    <span class="operation play" onClick={(e) => target.play(c.row)}><i class='el-icon-video-play'></i></span>
                    <span class="operation collected" v-else={c.row.isCollect} onClick={(e) => target.collect(c.row)}><i class='el-icon-star-on'></i></span>
                </div>
          )
        } else {
          return (
                <div>
                    <span class="operation play" onClick={(e) => target.play(c.row)}><i class='el-icon-video-play'></i></span>
                    <span class="operation collect" v-if={!c.row.isCollect} onClick={(e) => target.collect(c.row)}><i class='el-icon-star-off'></i></span>
                </div>
          )
        }
      }
    }
  ]
}
