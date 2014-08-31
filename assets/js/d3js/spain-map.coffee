ready = ()->
  data = ''; path = ''; projection = ''; countries = ''

  widthCanarias = $('#chart').innerWidth() / 3.5
  widthPeninsula = $('#chart').innerWidth() - widthCanarias - 10

  height = 500
  margin = {top: 50, bottom: 20}

  strokeWidth = .4


  d3.json('/data/d3js/spain-map/data.json', (error, spain)->
    data = topojson.feature(spain, spain.objects.esp).features
    _.map(data, (d,i)-> d.index = i)

    colorsScheme = ['#323247','#7C7CC9','#72B66C','#429742']
    colorScale = d3.scale.linear().domain([0,spain.objects.esp.geometries.length]).range([0,1])
    colorScaleConversion = d3.scale.linear()
      .domain(d3.range(0, 1, 1.0 / (colorsScheme.length))).range(colorsScheme)
    colorFn = (d)-> colorScaleConversion(colorScale(d.index))
    addDropShadowFilter = ((id, svg, deviation, slope)->
      defs = svg.append('defs')
      filter = defs.append('filter').attr('id', 'drop-shadow-' + id)
      filter.append('feGaussianBlur').attr({in: 'SourceAlpha', stdDeviation: deviation})
      filter.append('feOffset').attr({dx: 1, dy: 1})
      filter.append('feComponentTransfer').append('feFuncA').attr({type: 'linear', slope: slope})
      feMerge = filter.append('feMerge')
      feMerge.append('feMergeNode')
      feMerge.append('feMergeNode').attr('in', 'SourceGraphic')
    )

    svg = d3.select('#chart')
    
    generateSvg = ((width)->
      return svg.append('div').style('display', 'inline-block')
        .style('height', height + margin.top + margin.bottom + 'px')
        .style('width', width + 'px')
        .append('svg:svg').attr('width', width)
        .attr('height', height + margin.top + margin.bottom).append('svg:g')
        .attr('transform', 'translate(' + width / 2 + ',' + String(height / 2 + margin.top) + ')')
    )

    generateProjection = ((center)->
      d3.geo.mercator().center(center).scale(2650)
        .translate([widthPeninsula / 2, height / 2])
    )
    
    generatePath = (projection)-> d3.geo.path().projection(projection)

    mouseover = (d)-> d3.select(this).style({'stroke-width': '1px', fill: '#FFB61A'})
    
    mouseleave = (d)-> d3.select(this).style({'stroke-width': strokeWidth, fill: colorFn})

    generateAreas = ((svg, path, filterId)->
      svg.selectAll('.area').data(data).enter().append('path')
        .attr({d: path})
        .style({fill: colorFn, stroke: '#FFF', 'stroke-width': strokeWidth})
        .style('filter', (d)-> 'url(#drop-shadow-' + filterId + ')')
        .on('mouseover', mouseover).on('mouseleave', mouseleave)
    )

    svgLeft = generateSvg(widthCanarias)
    svgRight = generateSvg(widthPeninsula)

    addDropShadowFilter(1,svgLeft,2,.3)
    addDropShadowFilter(2,svgRight,2,.3)
    
    projectionCanarias = generateProjection([-5, 23])
    projectionPeninsula = generateProjection([12, 35.5])
    
    pathCanarias = generatePath(projectionCanarias)
    pathPeninsula = generatePath(projectionPeninsula)

    areasCanarias = generateAreas(svgLeft, pathCanarias,1)
    areasPeninsula = generateAreas(svgRight, pathPeninsula,2)
  )

$(document).ready(ready)