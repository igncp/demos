ready = ()->
  height = 500
  width = $('#chart').innerWidth() / 2 - 20 # The width of each div
  margin = {top: 50, bottom: 20}
  r1 = Math.min(width, height) / 2 - 4
  r0 = r1 - 20
  format = d3.format(",.3r")

  debits = []
  credits = []

  arc = d3.svg.arc().innerRadius(r0).outerRadius(r1)

  chord = d3.svg.chord().radius(r0)

  svg = d3.select("#chart")

  charts = svg.selectAll("div").data([debits, credits]).enter().append("div").style("display", "inline-block")
  .style("width", width + "px").style("height", height + margin.top + margin.bottom + "px").append("svg:svg").attr("width", width)
  .attr("height", height + margin.top + margin.bottom).append("svg:g")
  .attr("transform", "translate(" + width / 2 + "," + String(height / 2 + margin.top) + ")")

  leftChart = charts.filter((d,i)-> i is 0)
  rightChart = charts.filter((d,i)-> i is 1)

  setLabel = (chart, label)->
    chart.append('text').text(label).attr('transform','translate(0,' + ((-1) * height/2 - 10) + ')').attr('class', 'chart-title').attr("text-anchor", "middle")

  setLabel(leftChart, 'Debits')
  setLabel(rightChart, 'Credits')

  d3.csv("/data/d3js/chord/data.csv", (data)->
    countries = {}
    array = []
    n = 0

    # Memoize the specified country, computing a unique id.
    country = ((d)->
      if not countries[d]
        countries[d] = {
          name: d
          id: n++
        }
      return countries[d]
    )

    # Converts a debit object to its primitive numeric value.
    value = (()-> +this.amount)

    data.forEach((d)->
      d.creditor = country(d.creditor)
      d.debtor = country(d.debtor)
      d.debtor.risk = d.risk
      d.valueOf = value
    )

    # Initialize a square matrix of debits and credits.
    for i in [0...n]
      debits[i] = []
      credits[i] = []
      for j in [0...n]
        debits[i][j] = 0
        credits[i][j] = 0

    # Populate the matrices, and stash a map from id to country.
    data.forEach((d)->
      debits[d.creditor.id][d.debtor.id] = d
      credits[d.debtor.id][d.creditor.id] = d
      array[d.creditor.id] = d.creditor
      array[d.debtor.id] = d.debtor
    )

    layout = d3.layout.chord().sortGroups(d3.descending).sortSubgroups(d3.descending).sortChords(d3.descending).padding(.04)
    
    addDropShadowFilter = ((id, deviation, slope)->
      defs = charts.append("defs")
      filter = defs.append("filter").attr("id", "drop-shadow-" + id)
      filter.append('feOffset').attr({result: 'offOut', in: 'SourceGraphic', dx: .5, dy:.5})
      filter.append("feGaussianBlur").attr({result: 'blurOut', in: 'offOut', stdDeviation: deviation})
      filter.append("feBlend").attr({in: 'SourceGraphic', in2: 'blurOut', mode: 'normal'})
      filter.append("feComponentTransfer").append('feFuncA').attr({type: 'linear', slope: slope})
    )
    addDropShadowFilter('chords', 2, .4)
    addDropShadowFilter('headings', 3, .5)

    colours = ["#39B347","#C92E47","#DB704D","#FFA22C","#5E92AA", "#F8EDD3"]
    c = d3.scale.linear().domain(d3.extent([0,n-1])).range([0,1])
    heatmapColour = d3.scale.linear().domain(d3.range(0, 1, 1.0 / (colours.length))).range(colours)
    fill = (d)-> heatmapColour(c(d))

    charts.each((matrix, j)->
      svg = d3.select(this)

      layout.matrix(matrix) # Compute the chord layout.

      svg.selectAll("path.chord").data(layout.chords).enter().append("svg:path")
      .attr("class", "chord").style("fill", (d,i)-> fill(d.target.index))
      .style("filter","url(#drop-shadow-chords)")
      .style("stroke", (d)-> d3.rgb(fill(d.target.index)).darker())
      .style("stroke-width", 2)
      .attr("d", chord).append("svg:title")
      .text((d)-> d.source.value.debtor.name + " owes " + d.source.value.creditor.name + " $" + format(d.source.value) + "B.")

      g = svg.selectAll("g.group").data(layout.groups).enter().append("svg:g").attr("class", "group")

      g.append("svg:path").style("fill", (d)-> fill(d.index))
      .attr("id", (d, i)-> "group" + d.index + "-" + j ).attr("d", arc)
      .style("filter", (d)-> "url(#drop-shadow-headings)")
      .append("svg:title")
      .text((d)-> array[d.index].name + " " + (if j then "owes" else "is owed") + " $" + format(d.value) + "B.")

      g.append("svg:text").attr("x", 6).attr("dy", 15).filter((d)-> d.value > 150)
      .append("svg:textPath").attr("xlink:href", (d)-> "#group" + d.index + "-" + j)
      .text((d)-> array[d.index].name).attr('class', 'heading-title')
    )
  )


$(document).ready(ready)