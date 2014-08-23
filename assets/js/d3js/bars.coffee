ready = ()->
  d3.json("/data/d3js/bars/data.json", (error, data)->   
    data = data
    color = d3.scale.category20()  
    height = 300
    width = $('#chart').innerWidth()
    margin = {left: 160, top: 30}
    
    barWidth = 30
    barHeight = 5

    x = d3.scale.linear().domain([0.5,data.length + .5]).range([1,barWidth * data.length])
    y = d3.scale.linear().domain([0, d3.max(data)]).rangeRound([0, -1 * barHeight * d3.max(data)])

    xAxis = d3.svg.axis().scale(x).orient("bottom").ticks(data.length)
    yAxis = d3.svg.axis().scale(y).orient("left").ticks(5)

    chart = d3.select("#chart").append("svg").attr({width: width, height: height})
    .append('g').attr({transform: "translate(" + margin.left + "," + (height - 60) + ")"})
       
    chart.append("g").attr({"transform": "translate(0," + barHeight + ")", class: 'x-axis axis'}).call(xAxis)
    .append("text").attr("transform", "translate(" +barWidth * data.length/2 + " ,0)")
    .attr("y", 40).attr("font-size", "1.3em").style({"text-anchor": "end"})
    .text("Number")

    chart.append("g").attr({"transform": "translate(0,0)", class: 'x-axis axis'}).call(yAxis)
    .append("text").attr("transform", "translate(-30," + -(height - 60)/2 + ")")
    .attr("y", 40).attr("font-size", "1.3em").style({"text-anchor": "end"})
    .text("Value")

    chart.selectAll("rect").data(data).enter().append("rect").attr("x", (d, i)-> barWidth * i)
    .attr("y", (d, i)-> barHeight - d*barHeight).attr("width", barWidth).attr("height", (d)-> d*barHeight)
    .attr("fill", (d)-> color(d))

    redraw = (()->
      chart.selectAll("rect").data(data).transition().duration(500)
      .attr("y", (d)-> barHeight - d*barHeight).attr("height", (d)-> d*barHeight).attr("fill",(d)-> color(d) )
    )

    
    setInterval((()->
        data.unshift data.pop()
        redraw()
    ),1000)
  )


$(document).ready(ready)