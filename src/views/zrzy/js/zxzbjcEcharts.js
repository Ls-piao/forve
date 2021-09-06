var echarts = require('echarts')

function numberPie () {
  var myChart = echarts.init(document.getElementById('myEchar1'))
  myChart.clear()
  var option
  option = {
    title: {
      text: '植被类型占比'
    },
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b} : {c} ({d}%)'
    },
    legend: {
      top: 'bottom'
    },
    toolbox: {
      show: true,
      feature: {
        // mark: {show: true},
        // dataView: {show: true, readOnly: false},
        // restore: {show: true},
        saveAsImage: {show: true}
      }
    },
    series: [
      {
        name: '种数',
        type: 'pie',
        radius: [0, 80],
        center: ['50%', '50%'],
        roseType: 'area',
        itemStyle: {
          borderRadius: 8
        },
        data: [
          {value: 40, name: '被子植物门'},
          {value: 38, name: '蕨类植物门'},
          {value: 32, name: '裸子植物门'}
        ]
      }
    ]
  }
  option && myChart.setOption(option)
  myChart.resize()
  window.addEventListener('resize', function () {
    myChart.resize()
  })
}

function number () {
  var myChart = echarts.init(document.getElementById('myEchar2'))
  myChart.clear()
  var option
  option = {
    title: {
      text: '各盟市珍惜植物种数'
    },
    color: ['#3398DB'],
    tooltip: {
      trigger: 'axis',
      axisPointer: {            // 坐标轴指示器，坐标轴触发有效
        type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: [
      {
        type: 'category',
        data: ['呼和浩特市', '包头市', '乌海市', '赤峰市', '鄂尔多斯市', '通辽市', '呼伦贝尔市', '巴彦淖尔市', '乌兰察布市', '兴安盟', '锡林郭勒盟', '阿拉善盟'],
        axisTick: {
          alignWithLabel: true
        }
      }
    ],
    yAxis: [
      {
        type: 'value',
        name: '种'
      }
    ],
    series: [
      {
        name: '种数',
        type: 'bar',
        barWidth: '60%',
        data: [40, 38, 32, 30, 28, 33, 18, 21, 30, 21, 11, 9]
      }
    ]
  }
  option && myChart.setOption(option)
  myChart.resize()
  window.addEventListener('resize', function () {
    myChart.resize()
  })
}

function visitLine () {
  var myChart = echarts.init(document.getElementById('myEchar3'))
  myChart.clear()
  var option
  option = {
    title: {
      text: '生活型统计',
      left: 'center'
    },
    color: ['#3398DB'],
    tooltip: {
      trigger: 'axis'
    },
    toolbox: {
      feature: {
        saveAsImage: {}
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: 50,
      containLabel: true
    },
    xAxis: [
      {
        type: 'category',
        data: ['半灌木', '多年生草本', '一、二年生草本', '灌木'],
        axisTick: {
          alignWithLabel: true
        }
      }
    ],
    yAxis: [
      {
        type: 'value'
      }
    ],
    series: [
      {
        name: '个数',
        type: 'bar',
        barWidth: '50',
        data: [20, 30, 15, 33],
        itemStyle: {
          normal: {
            color: function (params) {
              var colorList = [
                '#C1232B',
                '#B5C334',
                '#E87C25',
                '#27727B',
                '#FE8463',
                '#9BCA63',
                '#FAD860',
                '#F3A43B',
                '#60C0DD'
              ]
              return colorList[params.dataIndex]
            }
          }
        }
      }
    ]
  }
  option && myChart.setOption(option)
  myChart.resize()
  window.addEventListener('resize', function () {
    myChart.resize()
  })
}

function dataTj () {
  var myChart = echarts.init(document.getElementById('myEchar4'))
  myChart.clear()
  var option
  option = {
    title: {
      text: '保护等级统计',
      left: 'center'
    },
    color: ['#3398DB'],
    tooltip: {
      trigger: 'axis'
    },
    toolbox: {
      feature: {
        saveAsImage: {}
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: 50,
      containLabel: true
    },
    xAxis: [
      {
        type: 'category',
        data: ['一级', '二级', '未列入', '其它'],
        axisTick: {
          alignWithLabel: true
        }
      }
    ],
    yAxis: [
      {
        type: 'value'
      }
    ],
    series: [
      {
        name: '个数',
        type: 'bar',
        barWidth: '50',
        data: [20, 30, 15, 33]
      }
    ]
  }
  option && myChart.setOption(option)
  myChart.resize()
  window.addEventListener('resize', function () {
    myChart.resize()
  })
}

function stateTj () {
  var myChart = echarts.init(document.getElementById('myEchar5'))
  myChart.clear()
  var option
  option = {
    // title: {
    //   text: '各类资源面积'
    // },
    color: ['#3398DB'],
    tooltip: {
      trigger: 'axis',
      axisPointer: {            // 坐标轴指示器，坐标轴触发有效
        type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: [
      {
        type: 'category',
        data: ['类型1', '类型2', '类型3', '类型4', '类型5'],
        axisTick: {
          alignWithLabel: true
        }
      }
    ],
    yAxis: [
      {
        type: 'value',
        name: '万亩'
      }
    ],
    series: [
      {
        name: '面积',
        type: 'bar',
        barWidth: 50,
        data: [3.2, 4.43, 1.9, 2.2, 4.1]
      }
    ]
  }
  option && myChart.setOption(option)
  myChart.resize()
  window.addEventListener('resize', function () {
    myChart.resize()
  })
}

function historybh () {
  var myChart = echarts.init(document.getElementById('myEchar6'))
  myChart.clear()
  var option
  option = {
    title: {
      text: '土地资源变化'
    },
    tooltip: {
      trigger: 'axis'
    },
    legend: {
      data: ['农田', '林地', '建设用地', '草地', '其它']
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    toolbox: {
      feature: {
        saveAsImage: {}
      }
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: ['2015', '2016', '2017', '2018', '2019', '2020', '2021']
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        name: '农田',
        type: 'line',
        stack: '总量',
        data: [120, 132, 101, 134, 90, 230, 210]
      },
      {
        name: '林地',
        type: 'line',
        stack: '总量',
        data: [220, 182, 191, 234, 290, 330, 310]
      },
      {
        name: '建设用地',
        type: 'line',
        stack: '总量',
        data: [150, 232, 201, 154, 190, 330, 410]
      },
      {
        name: '草地',
        type: 'line',
        stack: '总量',
        data: [320, 332, 301, 334, 390, 330, 320]
      },
      {
        name: '其它',
        type: 'line',
        stack: '总量',
        data: [82, 93, 90, 93, 129, 133, 132]
      }
    ]
  }
  option && myChart.setOption(option)
  myChart.resize()
  window.addEventListener('resize', function () {
    myChart.resize()
  })
}

export {
  numberPie,
  number,
  visitLine,
  dataTj,
  stateTj,
  historybh
}
