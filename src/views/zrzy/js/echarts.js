var echarts = require('echarts')

function areaPie () {
  var myChart = echarts.init(document.getElementById('myEchar1'))
  myChart.clear()
  var option
  option = {
    title: {
      text: '各类资源面积占比'
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
        name: '面积',
        type: 'pie',
        radius: [0, 80],
        center: ['50%', '50%'],
        roseType: 'area',
        itemStyle: {
          borderRadius: 8
        },
        data: [
          {value: 40, name: '农田'},
          {value: 38, name: '林地'},
          {value: 32, name: '建设用地'},
          {value: 30, name: '草地'},
          {value: 28, name: '其它'}
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

function areaBar () {
  var myChart = echarts.init(document.getElementById('myEchar2'))
  myChart.clear()
  var option
  option = {
    title: {
      text: '各类资源面积'
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
        data: ['农田', '林地', '建设用地', '草地', '其它'],
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
        barWidth: '60%',
        data: [40, 38, 32, 30, 28]
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
  var base = +new Date(2015, 9, 3)
  var oneDay = 24 * 3600 * 1000
  var date = []
  var data = [Math.random() * 3]
  for (var i = 1; i < 2005; i++) {
    var now = new Date(base += oneDay)
    date.push([now.getFullYear(), now.getMonth() + 1].join('-'))
    data.push(Math.abs(Math.round((Math.random() - 0.5) * 2 + data[i - 1])))
  }
  option = {
    tooltip: {
      trigger: 'axis',
      position: function (pt) {
        return [pt[0], '10%']
      }
    },
    title: {
      left: 'center',
      text: '访问量'
    },
    toolbox: {
      feature: {
        dataZoom: {
          yAxisIndex: 'none'
        },
        restore: {},
        saveAsImage: {}
      }
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: date
    },
    yAxis: {
      type: 'value',
      boundaryGap: [0, '100%']
    },
    dataZoom: {
      type: 'inside',
      start: 0,
      end: 10
    },
    series: [
      {
        name: '访问量',
        type: 'line',
        smooth: true,
        symbol: 'none',
        sampling: 'average',
        itemStyle: {
          color: 'rgb(255, 70, 131)'
        },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
            offset: 0,
            color: 'rgb(255, 158, 68)'
          }, {
            offset: 1,
            color: 'rgb(255, 70, 131)'
          }])
        },
        data: data
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
        data: ['农田', '林地', '建设用地', '草地', '其它'],
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
        barWidth: '60%',
        data: [40, 38, 32, 30, 28]
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
  areaPie,
  areaBar,
  visitLine,
  dataTj,
  stateTj,
  historybh
}
