d3utils = {
  middleTitle: ((svg, width, text, top = -15)->
    element = svg.append('text').attr({class: 'chart-title', 'text-anchor': 'middle', \
      transform: 'translate(' + String(width / 2) + ',' + top + ')'})
      .text(text).style({'font-weight': 'bold'})
  )

  svg: ((selector, width, height, margin)->
    d3.select(selector).text('').append('svg')
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

  tooltip: ((selector, customOpts = {})->
    defaultOpts = {
      followMouse: false, followElement: false, elementSelector: ''
      leftOffst: 60, topOffst: 40
      tOpts: {container: 'body', viewport: {selector: '#chart svg'}}
    }
    opts = _.merge(defaultOpts, customOpts)

    # Bootstrap tooltip.
    $(selector).tooltip(opts.tOpts)

    # For SVG forms, it's better to position the tooltip manually.
    if opts.followMouse
      $(selector).hover((e)->
        $('.tooltip')
          .css({top: String(e.pageY - opts.topOffst) + 'px', \
            left: String(e.pageX - opts.leftOffst) + 'px'})
      )
    else if opts.followElement
      $(selector).hover((e)->
        $('.tooltip')
          .css({top: String($(opts.elementSelector).position().top - opts.topOffst) + 'px', \
            left: String($(opts.elementSelector).position().left - opts.leftOffst) + 'px'})
      )
  )

  dTooltip: ((svg, element, text)-> # Custom tooltip
    is_previous = d3.selectAll('.dtooltip')
    if is_previous[0].length is 0
      svg.append('g').attr('class', 'dtooltip').append('text').text('hola')
    elements = d3.selectAll(element)
    console.log elements
    elements.on('mouseover', -> console.log text)
  )
}

window.d3utils = d3utils