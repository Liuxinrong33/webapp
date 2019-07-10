// echarts
const chartStore = {
    pie: null,
    bar: null,
    line: null,
    line2:null,
}

const optionForPie = function(data) {
    let option = {
        title: {
            text: '豆瓣电影 top250 按地区划分',
            x: 'center'
        },
        tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        series: [
            {
                name: '地区',
                type: 'pie',
                radius: '55%',
                center: ['50%', '60%'],
                data: data,
                itemStyle: {
                    emphasis: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                }
            }
        ]
    }

    return option
}

const optionForArea = function(area) {
    let data = _.map(area, (v, k) => {
        let o = {
            name: k,
            value: v.length,
        }
        return o
    })
    let option = optionForPie(data)
    return option
}

const optionForBar = function(data) {
    let option = {
        title: {
            text: '豆瓣电影 top250 按类型划分',
        },
        xAxis: {
            data: data.axis,
            name: '电影类型',
            axisLabel: {
                textStyle: {
                    color: '#000'
                }
            },
            axisTick: {
                show: false
            },
            axisLine: {
                show: false
            },
            z: 10
        },
        yAxis: {
            name: '电影数量',
            axisLine: {
                show: false
            },
            axisTick: {
                show: false
            },
            axisLabel: {
                textStyle: {
                    color: '#999'
                }
            }
        },
        series: [
            {
                type: 'bar',
                itemStyle: {
                    normal: {color: 'rgba(0,0,0,0.05)'}
                },
                barGap:'-100%',
                barCategoryGap:'40%',
                animation: false
            },
            {
                type: 'bar',
                itemStyle: {
                    normal: {
                        color: new echarts.graphic.LinearGradient(
                            0, 0, 0, 1,
                            [
                                {offset: 0, color: '#83bff6'},
                                {offset: 0.5, color: '#188df0'},
                                {offset: 1, color: '#188df0'}
                            ]
                        )
                    },
                    emphasis: {
                        color: new echarts.graphic.LinearGradient(
                            0, 0, 0, 1,
                            [
                                {offset: 0, color: '#2378f7'},
                                {offset: 0.7, color: '#2378f7'},
                                {offset: 1, color: '#83bff6'}
                            ]
                        )
                    }
                },
                data: data.data
            }
        ]
    }
    return option
}

const optionForType = function(type) {
    let data = {
        axis: [],
        data: [],
    }
    _.each(type, (v, k) => {
        data.axis.push(k)
        data.data.push(v.length)
    })
    let option = optionForBar(data)
    return option
}

const optionForLine = function(data) {
    let option = {
        title: {
            text: '豆瓣 top250 平均分数'
        },
        tooltip: {
            trigger: 'axis',
            formatter: function (params) {
                params = params[0]
                let value = params.value
                let s = value[0] + ': ' + value[1]
                return s
            },
            axisPointer: {
                animation: false
            }
        },
        xAxis: {
            name: '上映时间',
            type: 'time',
            splitLine: {
                show: false
            }
        },
        yAxis: {
            type: 'value',
            name: '平均分',
            boundaryGap: [0, '100%'],
            splitLine: {
                show: false
            },
            min: 8,
        },
        series: [{
            name: '模拟数据',
            type: 'line',
            showSymbol: false,
            hoverAnimation: false,
            data: data
        }]
    };
    return option
}

const optionForYear = function(year) {
    let data = _.map(year, (v, k) => {
        let avg = _.meanBy(v, 'score')
        let o = {
            name: k,
            value: [k, avg.toFixed(2)],
        }
        return o
    })
    log('查看year数据', data)
    let option = optionForLine(data)
    return option
}
const get250 = function() {
    let a = []
    for (let i = 1; i < 251; i++) {
        a.push(i)
    }
    return a
}
const optionForNumber = function(number) {
    let a = get250()
    const getnum = function(arry) {
        return arry[0].Number
    }
    let b = _.map(number, getnum)
    log('b = ', b)
    option = {
        title: {
            text: '豆瓣 top250 排名与评论数关系'
        },
        tooltip: {
            trigger: 'axis',
            position: function (pt) {
                return [pt[0], '10%'];
            }
        },
        xAxis: {
            type: 'category',
            data: a,
            name: '排名'
        },
        yAxis: {
            type: 'value',
            name: '评价数'
        },
        series: [{
            data: b,
            type: 'line',
            name:'评价数',

        }]
    };
    return option
}
const renderChart = function(d) {
    let data = d

    let area = _.groupBy(data, 'area')
    let areaOption = optionForArea(area)
    let pie = chartStore.pie
    pie.setOption(areaOption)

    let type = _.groupBy(data, 'type')
    let typeOption = optionForType(type)
    let bar = chartStore.bar
    bar.setOption(typeOption)

    let year = _.groupBy(data, 'year')
    let yearOption = optionForYear(year)
    let line = chartStore.line
    line.setOption(yearOption)

    let number = _.groupBy(data, 'ranking')
    log('看看groupby后的number', number)
    let numberOption = optionForNumber(number)
    let line2 = chartStore.line2
    line2.setOption(numberOption)
}

const fetchMovies = function() {
    let protocol = location.protocol
    // 如果是通过 node 运行的, prototol 是 http
    // 则调用 api 来获取电影数据
    // 否则直接调用 movieJSON 函数获取电影数据
    if (protocol === 'http:') {
        // 使用 ajax 动态获取数据
        api.fetchMovies(function (d) {
            d = JSON.parse(d)
            renderChart(d)
            console.log('因为HTTPajax动态获取')
        })
    } else {
        // 直接使用 JSON 数据 不从后台获取
        let d = movieJSON()
        renderChart(d)
        console.log('直接使用movie_data')
    }
}

const initedChart = function() {
    _.each(chartStore, (v, k) => {
        let selector = '#' + k
        let element = document.querySelector(selector)
        let chart = echarts.init(element)
        chartStore[k] = chart
    })
}

const __main = function() {
    initedChart()
    fetchMovies()
}

// $(document).ready() 这个东西是 jQuery 的回调函数
// 是页面内容(只包括元素, 不包括元素引用的图片)载入完毕之后的回调事件
$(document).ready(function() {
    __main()
})
