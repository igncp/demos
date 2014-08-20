ready = ()->
  width = $('#chart').innerWidth()
  height = 500
  colors = (()-> "#FFF")

  svg = d3.select('#chart').append('svg').attr('width', width).attr('height', height)


  nodes = [
    {id: "A", reflexive: false},
    {id: "B", reflexive: false},
    {id: "C", reflexive: false}
  ]
  lastNodeId = "C".charCodeAt(0)
  links = [
    {source: nodes[0], target: nodes[1], left: false, right: true }
    {source: nodes[1], target: nodes[2], left: false, right: true }
  ]

  tick = (()->
    path.attr('d', (d)->
      deltaX = d.target.x - d.source.x
      deltaY = d.target.y - d.source.y
      dist = Math.sqrt(deltaX * deltaX + deltaY * deltaY)
      normX = deltaX / dist
      normY = deltaY / dist
      sourcePadding = d.left ? 17 : 12
      targetPadding = d.right ? 17 : 12
      sourceX = d.source.x + (sourcePadding * normX)
      sourceY = d.source.y + (sourcePadding * normY)
      targetX = d.target.x - (targetPadding * normX)
      targetY = d.target.y - (targetPadding * normY)
      'M' + sourceX + ',' + sourceY + 'L' + targetX + ',' + targetY
    )

    circle.attr('transform', (d)-> 'translate(' + d.x + ',' + d.y + ')' )
  )

  svg.append('svg:defs').append('svg:marker').attr('id', 'end-arrow').attr('viewBox', '0 -5 10 10')
  .attr('refX', 6).attr('markerWidth', 3).attr('markerHeight', 3).attr('orient', 'auto')
  .append('svg:path').attr('d', 'M0,-5L10,0L0,5').attr('fill', '#000')

  svg.append('svg:defs').append('svg:marker').attr('id', 'start-arrow').attr('viewBox', '0 -5 10 10')
  .attr('refX', 4).attr('markerWidth', 3).attr('markerHeight', 3).attr('orient', 'auto').append('svg:path')
  .attr('d', 'M10,-5L0,0L10,5').attr('fill', '#000')


  drag_line = svg.append('svg:path').attr('class', 'link dragline hidden').attr('d', 'M0,0L0,0')

  path = svg.append('svg:g').selectAll('path')
  circle = svg.append('svg:g').selectAll('g')

  force = d3.layout.force().nodes(nodes).links(links).size([width, height]).linkDistance(150).charge(-500).on('tick', tick)

  selected_node = null
  selected_link = null
  mousedown_link = null
  mousedown_node = null
  mouseup_node = null

  resetMouseVars = (()->
    mousedown_node = null
    mouseup_node = null
    mousedown_link = null
  )

  restart = (()->
    path = path.data(links)
    path.classed('selected', (d)-> d is selected_link ).style('marker-start', (d)-> if d.left then return 'url(#start-arrow)' else return '' )
    .style('marker-end', (d)-> if d.right then return 'url(#end-arrow)' else return '' );

    path.enter().append('svg:path').attr('class', 'link').classed('selected', (d)-> return d is selected_link )
    .style('marker-start', (d)-> if d.left then return 'url(#start-arrow)' else return '')
    .style('marker-end', (d)-> if d.right then return 'url(#end-arrow)' else return '')
    .on('mousedown', (d)->
    
      if d3.event.ctrlKey then return

      mousedown_link = d
      if mousedown_link is selected_link then selected_link = null
      else selected_link = mousedown_link

      selected_node = null
      restart()
    )

    path.exit().remove()

    circle = circle.data(nodes, (d)-> return d.id )

    circle.selectAll('circle').style('fill', (d)-> if d is selected_node then return d3.rgb(colors(d.id)).darker().toString() else return colors(d.id))
    .classed('reflexive', (d)-> d.reflexive)

    g = circle.enter().append('svg:g')

    g.append('svg:circle').attr('class', 'node').attr('r', 12)
    .style('fill', (d)-> if d is selected_node then return d3.rgb(colors(d.id)).brighter().toString() else return colors(d.id))
    .style('stroke', (d)-> d3.rgb(colors(d.id)).darker().toString())
    .classed('reflexive', (d)-> d.reflexive)
    .on('mouseover', (d)->
      if not mousedown_node or d is mousedown_node then return

      d3.select(this).attr('transform', 'scale(1.1)');
    ).on('mouseout', (d)->
      if not mousedown_node or (d is mousedown_node) then return

      d3.select(this).attr('transform', '')
    ).on('mousedown', (d)->
      if d3.event.ctrlKey then return

      mousedown_node = d
      
      if mousedown_node is selected_node then selected_node = null
      else selected_node = mousedown_node
      
      selected_link = null

      drag_line.style('marker-end', 'url(#end-arrow)').classed('hidden', false)
      .attr('d', 'M' + mousedown_node.x + ',' + mousedown_node.y + 'L' + mousedown_node.x + ',' + mousedown_node.y)

      restart();
    ).on('mouseup', (d)->
      if not mousedown_node then return

      drag_line.classed('hidden', true).style('marker-end', '')

      mouseup_node = d
      if mouseup_node is mousedown_node
        resetMouseVars()
        return

      d3.select(this).attr('transform', '')

      if mousedown_node.id < mouseup_node.id
        source = mousedown_node
        target = mouseup_node
        direction = 'right'
      else
        source = mouseup_node
        target = mousedown_node
        direction = 'left'

      link = links.filter((l)->
        return (l.source is source and l.target is target)
      )[0]

      if link
        link[direction] = true
      else 
        link = {source: source, target: target, left: false, right: false}
        link[direction] = true
        links.push(link)

      selected_link = link
      selected_node = null
      restart()
    )

    g.append('svg:text').attr('x', 0).attr('y', 4).attr('class', 'id').text((d)-> d.id )

    circle.exit().remove()

    force.start()
  )

  mousedown = (()->
    svg.classed('active', true)

    if d3.event.ctrlKey or mousedown_node or mousedown_link then return

    point = d3.mouse(this)
    node = {id: String.fromCharCode(++lastNodeId), reflexive: false}
    node.x = point[0]
    node.y = point[1]
    nodes.push(node)

    restart()
  )

  mousemove = (()->
    if not mousedown_node then return

    drag_line.attr('d', 'M' + mousedown_node.x + ',' + mousedown_node.y + 'L' + d3.mouse(this)[0] + ',' + d3.mouse(this)[1]) # update drag line

    restart()
  )

  mouseup = (()->
    if mousedown_node then drag_line.classed('hidden', true).style('marker-end', '') # hide drag line

    svg.classed('active', false) # because :active only works in WebKit?

    resetMouseVars() # clear mouse event vars
  )

  spliceLinksForNode = ((node)->
    toSplice = links.filter((l)-> return l.source is node or l.target is node )
    
    toSplice.map((l)-> links.splice(links.indexOf(l), 1) )
  )


  lastKeyDown = -1

  keydown = (()->
    d3.event.preventDefault()

    if lastKeyDown isnt -1 then return
    lastKeyDown = d3.event.keyCode

    if d3.event.keyCode is 17 # ctrl
      circle.call(force.drag)
      svg.classed('ctrl', true)

    if not selected_node and not selected_link then return
    
    switch d3.event.keyCode
      when 46 # delete
        if selected_node
          nodes.splice(nodes.indexOf(selected_node), 1)
          spliceLinksForNode(selected_node)
        else if selected_link
          links.splice(links.indexOf(selected_link), 1)

        selected_link = null
        selected_node = null
        restart()
      when 66 # B
        # set link direction to both left and right
        if selected_link
          selected_link.left = true
          selected_link.right = true

        restart()

      when 76 # L
        # set link direction to left only
        if selected_link
          selected_link.left = true;
          selected_link.right = false;

        restart()

      when 82 # R
        if selected_node # toggle node reflexivity
          selected_node.reflexive = !selected_node.reflexive
        else if selected_link # set link direction to right only
          selected_link.left = false;
          selected_link.right = true;

        restart()
  )

  keyup = (()->
    lastKeyDown = -1

    if d3.event.keyCode is 17 # ctrl
      circle.on('mousedown.drag', null).on('touchstart.drag', null)
      svg.classed('ctrl', false);
  )

  svg.on('mousedown', mousedown).on('mousemove', mousemove).on('mouseup', mouseup);
  d3.select(window).on('keydown', keydown).on('keyup', keyup)
  restart()

$(document).ready(ready)