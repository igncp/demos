import {
  HierarchyNode,
  HierarchyPointLink,
  HierarchyPointNode,
  hierarchy,
  json,
  linkHorizontal,
  select,
  tree as treeD3,
} from "d3"

import * as styles from "./collapsible-tree.module.css"

const CONTAINER_ID = "chart"

type DataNode = {
  _children: Array<HierarchyPointNode<DataNode>> | undefined
  children: DataNode[]
  id: number
  name: string
  x: number
  x0: number
  y: number
  y0: number
}
type HierarchyDataNode = HierarchyNode<DataNode>
type TreeNode = HierarchyPointNode<DataNode>
type TreeLink = HierarchyPointLink<DataNode>

type DiagonalNode = { x: number; y: number }
type DiagonalLink = { source: DiagonalNode; target: DiagonalNode }

const fetchData = async (): Promise<DataNode> =>
  json(`${ROOT_PATH}data/d3js/collapsible-tree/data.json`) as Promise<DataNode>

const margin = {
  bottom: 20,
  left: 120,
  right: 120,
  top: 20,
}

const duration = 750
const height = 800 - margin.top - margin.bottom

type RenderChart = (o: { rootData: DataNode; rootElId: string }) => void

const renderChart: RenderChart = ({ rootData, rootElId }) => {
  const root = hierarchy<DataNode>(rootData)

  const rootEl = document.getElementById(rootElId) as HTMLElement

  rootEl.classList.add(styles.collapsibleTreeChart)

  const width =
    rootEl.getBoundingClientRect().width - margin.right - margin.left

  root.data.x0 = height / 2
  root.data.y0 = 0

  const tree = treeD3<DataNode>().nodeSize([20, 100])

  const rootTree = tree(root)

  rootTree
    .descendants()
    .forEach((...[treeNode, treeNodeIndex]: [TreeNode, number]) => {
      treeNode.data.id = treeNodeIndex
      treeNode.data._children = treeNode.children

      if (treeNode.depth) {
        treeNode.children = undefined
      }
    })

  const diagonal = linkHorizontal<DiagonalLink, DiagonalNode>()
    .x((diagonalNode) => diagonalNode.y)
    .y((diagonalNode) => diagonalNode.x)

  const svg = select<SVGElement, TreeNode>(`#${rootElId}`)
    .append("svg")
    .attr("width", width + margin.right + margin.left)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${height / 2})`)

  const gLink = svg
    .append("g")
    .attr("fill", "none")
    .attr("stroke", "#555")
    .attr("stroke-opacity", 0.4)
    .attr("stroke-width", 1.5)

  const gNode = svg
    .append("g")
    .attr("cursor", "pointer")
    .attr("pointer-events", "all")

  const update = function (source: TreeNode) {
    const nodes = rootTree.descendants().reverse()
    const links = rootTree.links()

    tree(root)

    let left = root
    let right = root

    root.eachBefore((node: HierarchyDataNode) => {
      if (node.data.x < left.data.x) {
        left = node
      }

      if (node.data.x > right.data.x) {
        right = node
      }
    })

    const node = gNode
      .selectAll<SVGGElement, TreeNode>("g")
      .data(nodes, (treeNode) => treeNode.data.id)

    const nodeEnter = node
      .enter()
      .append("g")
      .attr("transform", () => `translate(${source.data.y0},${source.data.x0})`)
      .attr("fill-opacity", 0)
      .attr("stroke-opacity", 0)
      .on("click", (...[, treeNode]) => {
        treeNode.children = treeNode.children
          ? undefined
          : treeNode.data._children

        update(treeNode)
      })

    nodeEnter
      .append("circle")
      .attr("r", 2.5)
      .attr("fill", (treeNode) => (treeNode.data._children ? "#555" : "#999"))
      .attr("stroke-width", 10)

    nodeEnter
      .append("text")
      .attr("dy", "0.31em")
      .attr("x", (treeNode) => (treeNode.data._children ? -6 : 6))
      .attr("text-anchor", (treeNode) =>
        treeNode.data._children ? "end" : "start"
      )
      .text((treeNode) => treeNode.data.name)
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
      .data(links, (treeLink) => treeLink.target.data.id)

    const linkEnter = link
      .enter()
      .append("path")
      .attr("d", () => {
        const o = {
          x: source.data.x0,
          y: source.data.y0,
        }

        return diagonal({ source: o, target: o })
      })

    link.merge(linkEnter).transition().duration(duration).attr("d", diagonal)

    link
      .exit()
      .transition()
      .duration(duration)
      .remove()
      .attr("d", () => {
        const o = { x: source.x, y: source.y }

        return diagonal({ source: o, target: o })
      })

    rootTree.eachBefore((treeNode) => {
      treeNode.data.x0 = treeNode.x
      treeNode.data.y0 = treeNode.y
    })
  }

  update(rootTree)
}

const main = async () => {
  const rootElId = CONTAINER_ID

  const rootData = await fetchData()

  renderChart({
    rootData,
    rootElId,
  })
}

export { CONTAINER_ID }

export default main
