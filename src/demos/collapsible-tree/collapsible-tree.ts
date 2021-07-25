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

type DataNode = {
  _children: TreeNode[] | undefined
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

const fetchData = async (): Promise<DataNode> => {
  const data = (await json(
    `${ROOT_PATH}data/d3js/collapsible-tree/data.json`
  )) as DataNode

  return data
}

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

  rootTree.descendants().forEach((d: TreeNode, i: number) => {
    d.data.id = i
    d.data._children = d.children

    if (d.depth) {
      d.children = undefined
    }
  })

  const diagonal = linkHorizontal<DiagonalLink, DiagonalNode>()
    .x((d: DiagonalNode) => d.y)
    .y((d: DiagonalNode) => d.x)

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
      if (node.data.x < left.data.x) left = node
      if (node.data.x > right.data.x) right = node
    })

    const toggleFn = () => {
      svg.dispatch("toggle")
    }

    const transition = svg
      .transition()
      .duration(duration)
      .tween(
        "resize",
        (window.ResizeObserver as unknown) ? null : ((() => toggleFn) as any)
      )

    const node = gNode
      .selectAll<SVGElement, TreeNode>("g")
      .data(nodes, (d: TreeNode) => d.data.id)

    const nodeEnter = node
      .enter()
      .append("g")
      .attr("transform", () => `translate(${source.data.y0},${source.data.x0})`)
      .attr("fill-opacity", 0)
      .attr("stroke-opacity", 0)
      .on("click", (_event, d: TreeNode) => {
        d.children = d.children ? undefined : d.data._children

        update(d)
      })

    nodeEnter
      .append("circle")
      .attr("r", 2.5)
      .attr("fill", (d: TreeNode) => (d.data._children ? "#555" : "#999"))
      .attr("stroke-width", 10)

    nodeEnter
      .append("text")
      .attr("dy", "0.31em")
      .attr("x", (d: TreeNode) => (d.data._children ? -6 : 6))
      .attr("text-anchor", (d: TreeNode) =>
        d.data._children ? "end" : "start"
      )
      .text((d: TreeNode) => d.data.name)
      .clone(true)
      .lower()
      .attr("stroke-linejoin", "round")
      .attr("stroke-width", 3)
      .attr("stroke", "white")

    node
      .merge(nodeEnter as any)
      .transition(transition as any)
      .attr("transform", (d: TreeNode) => `translate(${d.y},${d.x})`)
      .attr("fill-opacity", 1)
      .attr("stroke-opacity", 1)

    node
      .exit()
      .transition(transition as any)
      .remove()
      .attr("transform", () => `translate(${source.y},${source.x})`)
      .attr("fill-opacity", 0)
      .attr("stroke-opacity", 0)

    const link = gLink
      .selectAll<SVGPathElement, TreeLink>("path")
      .data(links, (d: TreeLink) => d.target.data.id)

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

    link
      .merge(linkEnter as any)
      .transition(transition as any)
      .attr("d", diagonal)

    link
      .exit()
      .transition(transition as any)
      .remove()
      .attr("d", () => {
        const o = { x: source.x, y: source.y }

        return diagonal({ source: o, target: o })
      })

    rootTree.eachBefore((d: TreeNode) => {
      d.data.x0 = d.x
      d.data.y0 = d.y
    })
  }

  update(rootTree)
}

const main = async () => {
  const rootElId = "chart"

  const rootData = await fetchData()

  renderChart({
    rootData,
    rootElId,
  })
}

export default main
