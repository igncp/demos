ready = ->
  data = {}

  renderGraph = ( ->
    links = data.links.filter((el)-> el.source isnt el.target )
    nodes = data.nodes

    width = $('#chart').innerWidth()
    height = 600

    # Add the curvy lines
    tick = ( ->
      path.attr('d', ((d)->
        dx = d.target.x - d.source.x
        dy = d.target.y - d.source.y
        dr = Math.sqrt(dx * dx + dy * dy)
        return 'M' + d.source.x + ',' +  d.source.y + 'A' +  dr + \
          ',' + dr + ' 0 0,1 ' +  d.target.x + ',' +  d.target.y
      ))
      
      linkLabel.attr('x', ((d)->
        deltaX = d.target.x - d.source.x
        if d.source.y < d.target.y # Source is above target; arrow pointing down
          return d.source.x + deltaX * 0.3 + 15
        else
          return d.source.x + deltaX * 0.3 - 15
      )).attr('y', ((d)->
        deltaY = d.target.y - d.source.y
        return d.source.y + deltaY * 0.3
      )).attr('text-anchor', ((d)->
        if d.source.y < d.target.y
          return 'beginning' # Source is above target; arrow points down
        else
          return 'end'
      ))

      node.attr('transform', (d)-> 'translate(' + d.x + ',' + d.y + ')' )
    )

    force = d3.layout.force().nodes(nodes).links(links)
      .size([width, height]).linkDistance(60).charge(-400).linkStrength((d)-> d.strength )
      .on('tick', tick).start()

    svg = d3.select('#chart').append('svg').attr('width', width).attr('height', height)

    svg.append('svg:defs').selectAll('marker').data(['end'])
      .enter().append('svg:marker').attr('id', String).attr('viewBox', '0 -5 10 10')
      .attr('refX', 15).attr('refY', -1.5).attr('markerWidth', 6)
      .attr('markerHeight', 6).attr('orient', 'auto').append('svg:path')
      .attr('d', 'M0,-5L10,0L0,5')

    links = svg.selectAll('.link').data(force.links()).enter().append('g').attr('class', 'link')

    path = links.append('svg:path').attr('class', 'link').attr('marker-end', 'url(#end)')

    linkLabel = links.append('text').text((d)-> d.name )

    node = svg.selectAll('.node').data(force.nodes()).enter()
      .append('g').attr('class', 'node').call(force.drag)

    node.append('circle').attr('r', 5)

    node.append('text').attr('x', 12).attr('dy', '.35em').text((d)-> d.name)
  )

  async.parallel([
    (next)-> d3.json('/data/d3js/force/nodes.json', (error, root)-> data.nodes = root; next() )
    (next)-> d3.json('/data/d3js/force/links.json', (error, root)-> data.links = root; next() )
  ], renderGraph )

$(document).ready(ready)