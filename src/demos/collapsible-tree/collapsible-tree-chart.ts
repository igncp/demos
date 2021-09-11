import {
  D3DragEvent,
  HierarchyNode,
  HierarchyPointLink,
  HierarchyPointNode,
  Selection,
  drag,
  hierarchy,
  linkHorizontal,
  select,
  tree as treeD3,
} from "d3"

import * as styles from "./collapsible-tree.module.css"

export type NodeShape<Content> = Content & {
  children?: Array<NodeShape<Content>>
}

type DataNode<BaseData> = BaseData &
  NodeShape<{
    _children: Array<HierarchyPointNode<DataNode<BaseData>>> | undefined
    x: number
    x0: number
    y: number
    y0: number
  }>

type DiagonalNode = { x: number; y: number }
type DiagonalLink = { source: DiagonalNode; target: DiagonalNode }

const margin = {
  bottom: 20,
  left: 120,
  right: 120,
  top: 20,
}

const duration = 750
const height = 800 - margin.top - margin.bottom

const getDataNode = <BaseData>(
  initialNode: NodeShape<BaseData>
): DataNode<BaseData> => ({
  ...initialNode,
  _children: undefined,
  children: (initialNode.children ?? []).map((subNode) => getDataNode(subNode)),
  x: 0,
  x0: 0,
  y: 0,
  y0: 0,
})

const setupDrag = <SelectionData>(
  svgG: Selection<SVGGElement, SelectionData, HTMLElement, unknown>
) => {
  const translateOffset = {
    x: margin.left,
    y: height / 2,
  } as const

  const draggedState = {
    x: 0,
    y: 0,
  }

  const dragHandler = drag<SVGSVGElement, unknown>().on(
    "drag",
    (dragEvent: D3DragEvent<SVGSVGElement, unknown, unknown>) => {
      draggedState.x += dragEvent.dx
      draggedState.y += dragEvent.dy

      svgG.attr(
        "transform",
        `translate(${translateOffset.x + draggedState.x},${
          translateOffset.y + draggedState.y
        })`
      )
    }
  )

  svgG.attr("transform", `translate(${translateOffset.x},${translateOffset.y})`)

  const svg = select(svgG.node()!.parentNode as SVGSVGElement)

  svg.style("cursor", "move").call(dragHandler)
}

export type ChartConfig<BaseData> = {
  getNodeId: (node: DataNode<BaseData>) => number
  getNodeLabel: (node: DataNode<BaseData>) => string
  rootData: NodeShape<BaseData>
  rootElId: string
}

export const renderChart = <BaseData>(chartConfig: ChartConfig<BaseData>) => {
  const { rootData, rootElId } = chartConfig

  const rootEl = document.getElementById(rootElId) as HTMLElement

  rootEl.classList.add(styles.collapsibleTreeChart)

  const width =
    rootEl.getBoundingClientRect().width - margin.right - margin.left

  type TreeNode = HierarchyPointNode<DataNode<BaseData>>
  type TreeLink = HierarchyPointLink<DataNode<BaseData>>
  type HierarchyDataNode = HierarchyNode<DataNode<BaseData>>

  const dataNodeRoot = getDataNode(rootData)

  const rootHierarchy = hierarchy<DataNode<BaseData>>(dataNodeRoot)

  rootHierarchy.data.x0 = height / 2
  rootHierarchy.data.y0 = 0

  const tree = treeD3<DataNode<BaseData>>().nodeSize([40, 250])

  const rootTree = tree(rootHierarchy)

  rootTree.descendants().forEach((treeNode: TreeNode) => {
    treeNode.data._children = treeNode.children

    if (treeNode.depth) {
      treeNode.children = undefined
    }
  })

  const diagonal = linkHorizontal<DiagonalLink, DiagonalNode>()
    .x((diagonalNode) => diagonalNode.y)
    .y((diagonalNode) => diagonalNode.x)

  const svgG = select<SVGElement, TreeNode>(`#${rootElId}`)
    .append("svg")
    .attr("width", width + margin.right + margin.left)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")

  setupDrag(svgG)

  const gLink = svgG
    .append("g")
    .attr("fill", "none")
    .attr("stroke", "#555")
    .attr("stroke-opacity", 0.4)
    .attr("stroke-width", 1.5)

  const gNode = svgG.append("g").attr("pointer-events", "all")

  const update = function (source: TreeNode) {
    const nodes = rootTree.descendants().reverse()
    const links = rootTree.links()

    tree(rootHierarchy)

    let left = rootHierarchy
    let right = rootHierarchy

    rootHierarchy.eachBefore((node: HierarchyDataNode) => {
      if (node.data.x < left.data.x) {
        left = node
      }

      if (node.data.x > right.data.x) {
        right = node
      }
    })

    const node = gNode
      .selectAll<SVGGElement, TreeNode>("g")
      .data(nodes, (treeNode) => chartConfig.getNodeId(treeNode.data))

    const circleDefaultFill = (treeNode: TreeNode) =>
      treeNode.data._children ? "green" : "red"

    const nodeEnter = node
      .enter()
      .append("g")
      .attr("transform", () => `translate(${source.data.y0},${source.data.x0})`)
      .attr("cursor", (treeNode) =>
        treeNode.data._children ? "pointer" : "default"
      )
      .attr("fill-opacity", 0)
      .attr("stroke-opacity", 0)
      .on("click", (...[, treeNode]) => {
        treeNode.children = treeNode.children
          ? undefined
          : treeNode.data._children

        update(treeNode)
      })
      .on("mouseenter", function () {
        select<SVGGElement, TreeNode>(this)
          .select<SVGCircleElement>("circle")
          .attr("fill", (treeNode) =>
            treeNode.data._children ? "blue" : circleDefaultFill(treeNode)
          )
      })
      .on("mouseleave", function () {
        select<SVGGElement, TreeNode>(this)
          .select<SVGCircleElement>("circle")
          .attr("fill", circleDefaultFill)
      })

    nodeEnter
      .append("circle")
      .attr("r", 10)
      .attr("fill", circleDefaultFill)
      .attr("stroke-width", 10)

    nodeEnter
      .append("text")
      .attr("dy", "5px")
      .attr("dx", (treeNode) => (treeNode.data._children ? "-10px" : "10px"))
      .attr("x", (treeNode) => (treeNode.data._children ? -6 : 6))
      .style("font-size", "20px")
      .attr("text-anchor", (treeNode) =>
        treeNode.data._children ? "end" : "start"
      )
      .text((treeNode) => chartConfig.getNodeLabel(treeNode.data))
      .clone(true)
      .lower()
      .attr("stroke-linejoin", "round")
      .attr("stroke-width", 3)
      .attr("stroke", "white")

    node
      .merge(nodeEnter)
      .transition()
      .duration(duration)
      .attr("transform", (treeNode) => `translate(${treeNode.y},${treeNode.x})`)
      .attr("fill-opacity", 1)
      .attr("stroke-opacity", 1)

    node
      .exit()
      .transition()
      .duration(duration)
      .remove()
      .attr("transform", () => `translate(${source.y},${source.x})`)
      .attr("fill-opacity", 0)
      .attr("stroke-opacity", 0)

    const link = gLink
      .selectAll<SVGPathElement, TreeLink>("path")
      .data(links, (treeLink) => chartConfig.getNodeId(treeLink.target.data))

    const linkEnter = link
      .enter()
      .append("path")
      .attr("d", () => {
        const diagonalNode = {
          x: source.data.x0,
          y: source.data.y0,
        }
        const diagonalLink = { source: diagonalNode, target: diagonalNode }

        return diagonal(diagonalLink)
      })

    link.merge(linkEnter).transition().duration(duration).attr("d", diagonal)

    link
      .exit()
      .transition()
      .duration(duration)
      .remove()
      .attr("d", () => {
        const diagonalNode = {
          x: source.x,
          y: source.y,
        }
        const diagonalLink = { source: diagonalNode, target: diagonalNode }

        return diagonal(diagonalLink)
      })

    rootTree.eachBefore((treeNode) => {
      treeNode.data.x0 = treeNode.x
      treeNode.data.y0 = treeNode.y
    })
  }

  update(rootTree)
}
