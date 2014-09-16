d3utils = {
  middleTitle: ((svg, width, text)->
    element = svg.append('text').attr({class: 'chart-title', 'text-anchor': 'middle', \
      transform: 'translate(' + String(width / 2) + ',-15)'})
      .text(text)
  )

  svg: ((selector, width, height, margin)->
    d3.select(selector).append('svg')
      .attr({width: width + margin.left + margin.right, \
        height: height + margin.top + margin.bottom})
      .append('g').attr({transform: 'translate(' + margin.left + ',' + margin.top + ')'})
  )

  filterBlackOpacity: ((id, svg, deviation, slope)->
    defs = svg.append('defs')
    filter = defs.append('filter').attr({id: 'drop-shadow-' + id, width: '500%', height: '500%', \
      x: '-200%', y: '-200%'})
    filter.append('feGaussianBlur').attr({in: 'SourceAlpha', stdDeviation: deviation})
    filter.append('feOffset').attr({dx: 1, dy: 1})
    filter.append('feComponentTransfer').append('feFuncA').attr({type: 'linear', slope: slope})
    feMerge = filter.append('feMerge')
    feMerge.append('feMergeNode')
    feMerge.append('feMergeNode').attr('in', 'SourceGraphic')
  )
}

window.d3utils = d3utils