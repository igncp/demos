ready = ()->
  data = [4, 8, 15, 16, 23, 42, 8, 15, 16, 23, 42, 8, 15, 16, 23, 42, 8, 15, 16,10,6,25,2,10]
  
  height = 300
  width = $('#chart').innerWidth()
  margin = {left: 30, top: 30}
  
  barWidth = 40
  barHeight = 160

  x = d3.scale.linear().domain([0.5,data.length + .5]).range([1,barWidth * data.length])
  y = d3.scale.linear().domain([0, 100]).rangeRound([0, barHeight])

  xAxis = d3.svg.axis().scale(x).orient("bottom").ticks(data.length)
#  yAxis = d3.svg.axis().scale(y).orient("left")

  chart = d3.select("#chart").append("svg").attr({width: width, height: height})
  .append('g').attr({transform: "translate(" + margin.left + "," + margin.top + ")"})
     
  chart.append("g").attr("transform", "translate(0," + barHeight + ")").call(xAxis)
  .append("text").attr("transform", "translate(" +barWidth * data.length/2 + " ,0)")
  .attr("y", 40).attr("font-size", "1.3em").style("text-anchor", "end")
  .text("Number")

#   svg.append("g")
#       .attr("class", "y axis")
#       .attr("transform", "translate("+ height +",-180px)")
#       .style("text-anchor", "end")
#       .call(yAxis)
#    .append("text")
#       .attr("transform", "rotate(-90)")
#       .attr("y", -40)
#       .attr("dy", ".41em")
#       .attr("font-size", "1.3em")
#       .style("text-anchor", "end")
#       .text("CPU%");


  chart.selectAll("rect").data(data).enter().append("rect").attr("x", (d, i)-> barWidth * i)
  .attr("y", (d, i)-> barHeight - y(d) - .5).attr("width", barWidth).attr("height", (d)-> y(d))

  redraw = (()->
    chart.selectAll("rect").data(data).transition().duration(500)
    .attr("y", (d)-> barHeight - y(d) - .5).attr("height", (d)-> y(d))
  )

  
  setInterval((()->
      data.push data.shift()
      redraw()
  ),1000)


$(document).ready(ready)