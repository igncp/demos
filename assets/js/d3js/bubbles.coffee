ready = ()->
  width = $('#chart').innerWidth()

  color = d3.scale.category20b()

  strToMinutes = ((str)->
    str = str.split(':')
    60*str[0] + 1*str[1] + str[2]/60
  )

  defaultScatterPlot = (()->
    chart = nv.models.scatterChart()
    chart.margin({top:100, right:100, bottom:100, left:100})
    chart.xAxis.axisLabelDistance(45).tickFormat(d3.format('.1f'))
    chart.yAxis.axisLabelDistance(45).tickFormat(d3.format('.2f'))
    nv.utils.windowResize(chart.update)
    chart.forceY([4.5,6.5]).forceX([0,135])
  )

  showChart = ((chart, data, title)->
    d3.select('#chart').append('svg').attr({width: width}).datum(data).call(chart)
  )

  d3.json("/data/d3js/bubbles/data.json", (error, jsonData)->
    data = []
    
    jsonData.data.forEach((d,i,arr)->
      distance = +d.metricSummary.distance
      time = strToMinutes(d.metricSummary.duration)
      pace = time / distance
      
      data.push({x: arr.length - i, y: pace, size: distance, color: color(distance)});
    )

    data = [{key: "Data", values: data}]
    
    chart = defaultScatterPlot()
    
    chart.tooltipContent((key, x, y, obj)-> obj.point.size.toFixed(1) + ' km' )
    chart.xAxis.tickFormat(d3.format('f')).axisLabel("Person Number")
    chart.yAxis.axisLabelDistance(10).axisLabel("Pace (min/km)")
    
    showChart(chart, data, 'Pace Trend')
  )

$(document).ready(ready)