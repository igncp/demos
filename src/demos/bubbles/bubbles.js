const main = function () {
  const width = $("#chart").innerWidth()
  const color = d3.scale.category20b()

  const strToMinutes = function (str) {
    str = str.split(":")

    return 60 * str[0] + 1 * str[1] + str[2] / 60
  }

  const defaultScatterPlot = function () {
    const chart = nv.models.scatterChart()

    chart.margin({
      bottom: 100,
      left: 100,
      right: 100,
      top: 100,
    })
    chart.xAxis.axisLabelDistance(45).tickFormat(d3.format(".1f"))
    chart.yAxis.axisLabelDistance(45).tickFormat(d3.format(".2f"))
    nv.utils.windowResize(chart.update)

    return chart.forceY([4.5, 6.5]).forceX([0, 135])
  }

  const showChart = function (chart, data) {
    d3.select("#chart")
      .append("svg")
      .attr({
        width,
      })
      .datum(data)
      .call(chart)
  }

  d3.json(`${ROOT_PATH}data/d3js/bubbles/data.json`, (_error, jsonData) => {
    const data = []

    jsonData.data.forEach((d, i, arr) => {
      const distance = +d.metricSummary.distance
      const time = strToMinutes(d.metricSummary.duration)
      const pace = time / distance

      data.push({
        color: color(distance),
        size: distance,
        x: arr.length - i,
        y: pace,
      })
    })

    const chartData = [
      {
        key: "Data",
        values: data,
      },
    ]

    const chart = defaultScatterPlot()

    chart.tooltipContent(
      (_key, _x, _y, obj) => `${obj.point.size.toFixed(1)} km`
    )
    chart.xAxis.tickFormat(d3.format("f")).axisLabel("Person Number")
    chart.yAxis.axisLabelDistance(10).axisLabel("Pace (min/km)")

    showChart(chart, chartData, "Pace Trend")
  })
}

export default main
