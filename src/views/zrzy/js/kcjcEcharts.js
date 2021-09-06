var echarts = require('echarts')

function numberPie () {
  var myChart = echarts.init(document.getElementById('myEchar1'))
  myChart.clear()
  var option
  option = {
    title: {
      text: '各类资源占比'
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
          {value: 40, name: '再生资源'},
          {value: 38, name: '非再生资源'},
          {value: 32, name: '其它'}
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
      text: '各盟市矿产资源'
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
      text: '金属矿产占比'
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
        // roseType: 'area',
        itemStyle: {
          borderRadius: 8
        },
        data: [
          {value: 40, name: '黑色金属矿产'},
          {value: 38, name: '有色金属矿产'},
          {value: 32, name: '贵金属矿产'},
          {value: 32, name: '稀有金属矿产'}
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

function dataTj () {
  var myChart = echarts.init(document.getElementById('myEchar4'))
  myChart.clear()
  var option
  option = {
    title: {
      text: '矿产资源占比'
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
        // roseType: 'area',
        itemStyle: {
          borderRadius: 8
        },
        data: [
          {value: 40, name: '金属矿产'},
          {value: 38, name: '非金属矿产'},
          {value: 32, name: '宝玉石材料'},
          {value: 32, name: '可燃性有机岩矿产'}
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
