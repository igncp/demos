/* global d3 */
import { rgb, select } from "d3"

const colors = () => "#fff"
const height = 500

// @TODO: Remove when ported

const getInitialData = () => {
  const nodes = [
    {
      id: "A",
      reflexive: false,
    },
    {
      id: "B",
      reflexive: false,
    },
    {
      id: "C",
      reflexive: false,
    },
  ]
  const links = [
    {
      left: false,
      right: true,
      source: nodes[0],
      target: nodes[1],
    },
    {
      left: false,
      right: true,
      source: nodes[1],
      target: nodes[2],
    },
  ]

  return {
    links,
    nodes,
  }
}

const setupSVG = (svg) => {
  svg
    .append("svg:defs")
    .append("svg:marker")
    .attr("id", "end-arrow")
    .attr("viewBox", "0 -5 10 10")
    .attr("refX", 6)
    .attr("markerWidth", 3)
    .attr("markerHeight", 3)
    .attr("orient", "auto")
    .append("svg:path")
    .attr("d", "M0,-5L10,0L0,5")
    .attr("fill", "#000")

  svg
    .append("svg:defs")
    .append("svg:marker")
    .attr("id", "start-arrow")
    .attr("viewBox", "0 -5 10 10")
    .attr("refX", 4)
    .attr("markerWidth", 3)
    .attr("markerHeight", 3)
    .attr("orient", "auto")
    .append("svg:path")
    .attr("d", "M10,-5L0,0L10,5")
    .attr("fill", "#000")
}

const renderChart = ({ rootElId }) => {
  const rootEl = document.getElementById(rootElId)

  rootEl.classList.add("vectors-chart")

  const { width } = rootEl.getBoundingClientRect()

  const svg = d3
    .select(`#${rootElId}`)
    .append("svg")
    .attr("width", width)
    .attr("height", height)

  const { links, nodes } = getInitialData()

  let lastNodeId = "C".charCodeAt(0)
  let lastKeyDown = -1

  let selectedNode = null
  let selectedLink = null
  let mousedownLink = null
  let mousedownNode = null
  let mouseupNode = null

  const resetMouseVars = () => {
    mousedownNode = null
    mouseupNode = null
    mousedownLink = null
  }

  const tick = () => {
    path.attr("d", (d) => {
      const deltaX = d.target.x - d.source.x
      const deltaY = d.target.y - d.source.y
      const dist = Math.sqrt(deltaX * deltaX + deltaY * deltaY)
      const normX = deltaX / dist
      const normY = deltaY / dist
      const sourcePadding = d.left ? 17 : 12
      const targetPadding = d.right ? 17 : 12
      const sourceX = d.source.x + sourcePadding * normX
      const sourceY = d.source.y + sourcePadding * normY
      const targetX = d.target.x - targetPadding * normX
      const targetY = d.target.y - targetPadding * normY

      return `M${sourceX},${sourceY}L${targetX},${targetY}`
    })

    circle.attr("transform", (d) => `translate(${d.x},${d.y})`)
  }

  setupSVG(svg)

  const dragLine = svg
    .append("svg:path")
    .attr("class", "link dragline hidden")
    .attr("d", "M0,0L0,0")

  let path = svg.append("svg:g").selectAll("path")
  let circle = svg.append("svg:g").selectAll("g")

  const force = d3.layout
    .force()
    .nodes(nodes)
    .links(links)
    .size([width, height])
    .linkDistance(150)
    .charge(-500)
    .on("tick", tick)

  const restart = () => {
    path = path.data(links)
    path
      .classed("selected", (d) => d === selectedLink)
      .style("marker-start", (d) => {
        if (d.left) {
          return "url(#start-arrow)"
        }

        return ""
      })
      .style("marker-end", (d) => {
        if (d.right) {
          return "url(#end-arrow)"
        }

        return ""
      })

    path
      .enter()
      .append("svg:path")
      .attr("class", "link")
      .classed("selected", (d) => d === selectedLink)
      .style("marker-start", (d) => {
        if (d.left) {
          return "url(#start-arrow)"
        }

        return ""
      })
      .style("marker-end", (d) => {
        if (d.right) {
          return "url(#end-arrow)"
        }

        return ""
      })
      .on("mousedown", (d) => {
        if (d3.event.ctrlKey) {
          return
        }

        mousedownLink = d

        if (mousedownLink === selectedLink) {
          selectedLink = null
        } else {
          selectedLink = mousedownLink
        }

        selectedNode = null

        restart()
      })
    path.exit().remove()
    circle = circle.data(nodes, (d) => d.id)
    circle
      .selectAll("circle")
      .style("fill", (d) => {
        if (d === selectedNode) {
          return rgb(colors(d.id)).darker().toString()
        }

        return colors(d.id)
      })
      .classed("reflexive", (d) => d.reflexive)

    const g = circle.enter().append("svg:g")

    g.append("svg:circle")
      .attr("class", "node")
      .attr("r", 12)
      .style("fill", (d) => {
        if (d === selectedNode) {
          return rgb(colors(d.id)).brighter().toString()
        }

        return colors(d.id)
      })
      .style("stroke", (d) => rgb(colors(d.id)).darker().toString())
      .classed("reflexive", (d) => d.reflexive)
      .on("mouseover", function (d) {
        if (!mousedownNode || d === mousedownNode) {
          return
        }

        select(this).attr("transform", "scale(1.1)")
      })
      .on("mouseout", function (d) {
        if (!mousedownNode || d === mousedownNode) {
          return
        }

        select(this).attr("transform", "")
      })
      .on("mousedown", (d) => {
        if (d3.event.ctrlKey) {
          return
        }

        mousedownNode = d

        if (mousedownNode === selectedNode) {
          selectedNode = null
        } else {
          selectedNode = mousedownNode
        }

        selectedLink = null
        dragLine
          .style("marker-end", "url(#end-arrow)")
          .classed("hidden", false)
          .attr(
            "d",
            `M${mousedownNode.x},${mousedownNode.y}L${mousedownNode.x},${mousedownNode.y}`
          )

        restart()
      })
      .on("mouseup", function (d) {
        let direction = null
        let source = null
        let target = null

        if (!mousedownNode) {
          return
        }

        dragLine.classed("hidden", true).style("marker-end", "")
        mouseupNode = d

        if (mouseupNode === mousedownNode) {
          resetMouseVars()

          return
        }

        select(this).attr("transform", "")

        if (mousedownNode.id < mouseupNode.id) {
          source = mousedownNode
          target = mouseupNode
          direction = "right"
        } else {
          source = mouseupNode
          target = mousedownNode
          direction = "left"
        }

        let link = links.filter(
          (l) => l.source === source && l.target === target
        )[0]

        if (link) {
          link[direction] = true
        } else {
          link = {
            left: false,
            right: false,
            source,
            target,
          }
          link[direction] = true
          links.push(link)
        }

        selectedLink = link
        selectedNode = null

        restart()
      })

    g.append("svg:text")
      .attr("x", 0)
      .attr("y", 4)
      .attr("class", "id")
      .text((d) => d.id)

    circle.exit().remove()

    force.start()
  }

  const mousedownSVG = function () {
    svg.classed("active", true)

    if (d3.event.ctrlKey || mousedownNode || mousedownLink) {
      return
    }

    const point = d3.mouse(this)

    lastNodeId += 1

    const node = {
      id: String.fromCharCode(lastNodeId),
      reflexive: false,
    }

    node.x = point[0]
    node.y = point[1]
    nodes.push(node)

    restart()
  }

  const mousemoveSVG = function () {
    if (!mousedownNode) {
      return
    }

    dragLine.attr(
      "d",
      `M${mousedownNode.x},${mousedownNode.y}L${d3.mouse(this)[0]},${
        d3.mouse(this)[1]
      }`
    )

    restart()
  }

  const mouseupSVG = function () {
    if (mousedownNode) {
      dragLine.classed("hidden", true).style("marker-end", "")
    }

    svg.classed("active", false)

    resetMouseVars()
  }

  const spliceLinksForNode = (node) => {
    const toSplice = links.filter((l) => l.source === node || l.target === node)

    return toSplice.map((l) => links.splice(links.indexOf(l), 1))
  }

  const keydown = function (ev) {
    ev.preventDefault()

    if (lastKeyDown !== -1) {
      return
    }

    lastKeyDown = ev.keyCode

    if (lastKeyDown === 17) {
      circle.call(force.drag)
      svg.classed("ctrl", true)
    }

    if (!selectedNode && !selectedLink) {
      return
    }

    switch (lastKeyDown) {
      case 46:
        if (selectedNode) {
          nodes.splice(nodes.indexOf(selectedNode), 1)
          spliceLinksForNode(selectedNode)
        } else if (selectedLink) {
          links.splice(links.indexOf(selectedLink), 1)
        }

        selectedLink = null
        selectedNode = null

        restart()

        return
      case 66:
        if (selectedLink) {
          selectedLink.left = true
          selectedLink.right = true
        }

        restart()

        return
      case 76:
        if (selectedLink) {
          selectedLink.left = true
          selectedLink.right = false
        }

        restart()

        return
      case 82:
        if (selectedNode) {
          selectedNode.reflexive = !selectedNode.reflexive
        } else if (selectedLink) {
          selectedLink.left = false
          selectedLink.right = true
        }

        restart()
    }
  }

  const keyup = function (ev) {
    lastKeyDown = -1

    if (ev.keyCode === 17) {
      circle.on("mousedown.drag", null).on("touchstart.drag", null)

      svg.classed("ctrl", false)
    }
  }

  svg
    .on("mousedown", mousedownSVG)
    .on("mousemove", mousemoveSVG)
    .on("mouseup", mouseupSVG)

  select(window).on("keydown", keydown).on("keyup", keyup)

  restart()
}

const main = () => {
  const rootElId = "chart"

  renderChart({ rootElId })
}

export default main
