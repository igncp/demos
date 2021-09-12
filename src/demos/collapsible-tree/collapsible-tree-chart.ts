import {
  D3DragEvent,
  HierarchyPointLink,
  HierarchyPointNode,
  Selection,
  drag,
  hierarchy,
  select,
  tree as treeD3,
} from "d3"

import { LinkUI } from "./collapsible-tree-chart-link-ui"
import { NodeUI } from "./collapsible-tree-chart-node-ui"
import * as styles from "./collapsible-tree.module.css"

const inlineStyles = {
  linkDefaultColor: "#555",
} as const

export type NodeShape<Content> = Content & {
  children?: Array<NodeShape<Content>>
}

export const findNode = <NodeData>({
  getId,
  node,
  nodeId,
}: {
  getId: (node: NodeShape<NodeData>) => number
  node: NodeShape<NodeData>
  nodeId: number
}): NodeShape<NodeData> | null => {
  if (getId(node) === nodeId) {
    return node
  }

  return (node.children ?? []).reduce(
    (...[acc, otherNode]) =>
      acc ?? findNode({ getId, node: otherNode, nodeId }),
    null as NodeShape<NodeData> | null
  )
}

export const findParentNode = <NodeData>({
  getId,
  node,
  nodeId,
}: {
  getId: (node: NodeShape<NodeData>) => number
  node: NodeShape<NodeData>
  nodeId: number
}): NodeShape<NodeData> | null => {
  if (!node.children?.length) {
    return null
  }

  const hasNode = node.children.some((otherNode) => getId(otherNode) === nodeId)

  if (hasNode) {
    return node
  }

  return node.children.reduce(
    (...[acc, otherNode]) =>
      acc ?? findParentNode({ getId, node: otherNode, nodeId }),
    null as NodeShape<NodeData> | null
  )
}

type DataNode<BaseData> = BaseData &
  NodeShape<{
    _children: Array<HierarchyPointNode<DataNode<BaseData>>> | undefined
    x: number
    x0: number
    y: number
    y0: number
  }>

const margin = {
  bottom: 20,
  left: 120,
  right: 120,
  top: 20,
}

const openCloseAnimationDuration = 750
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
  canBeRemoved: (node: DataNode<BaseData>) => boolean
  getNodeId: (node: DataNode<BaseData>) => number
  getNodeLabel: (node: DataNode<BaseData>) => string
  onNodeAdd: (node: DataNode<BaseData>) => NodeShape<BaseData>
  onNodeRemove: (node: DataNode<BaseData>) => NodeShape<BaseData>
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

  const dataNodeRoot = getDataNode(rootData)

  const rootHierarchy = hierarchy<DataNode<BaseData>>(dataNodeRoot)

  rootHierarchy.data.x0 = height / 2
  rootHierarchy.data.y0 = 0

  const buildTree = treeD3<DataNode<BaseData>>().nodeSize([40, 250])

  const rootTree = buildTree(rootHierarchy)

  rootTree.descendants().forEach((treeNode: TreeNode) => {
    treeNode.data._children = treeNode.children

    if (treeNode.depth) {
      treeNode.children = undefined
    }
  })

  const svgG = select<SVGElement, TreeNode>(`#${rootElId}`)
    .append("svg")
    .attr("width", width + margin.right + margin.left)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")

  setupDrag(svgG)

  const commonUIOpts = {
    container: svgG,
    getInitialPosition: (node: TreeNode) => ({
      x: node.data.x0,
      y: node.data.y0,
    }),
    getPosition: (node: TreeNode) => ({ x: node.x, y: node.y }),
    linkDefaultColor: inlineStyles.linkDefaultColor,
    openCloseAnimationDuration,
  }

  const linkUI = new LinkUI<SVGGElement, TreeLink, TreeNode>(commonUIOpts)

  const nodeUI = new NodeUI({
    ...commonUIOpts,
    displayRemoveButton: (treeNode) => chartConfig.canBeRemoved(treeNode.data),
    getNodeId: (treeNode) => chartConfig.getNodeId(treeNode.data),
    getPointingLinkForNode: (treeNode) =>
      linkUI
        .getSelection()
        .filter(
          (link) =>
            chartConfig.getNodeId(link.target.data) ===
            chartConfig.getNodeId(treeNode.data)
        ) as unknown as Selection<SVGElement, unknown, SVGElement, unknown>,
    getText: (treeNode) => chartConfig.getNodeLabel(treeNode.data),
    hasDescendants: (node) => !!node.data.children?.length,
  })

  const update = function (source: TreeNode) {
    const nodes = rootTree.descendants().reverse()
    const links = rootTree.links()

    buildTree(rootHierarchy)

    nodeUI.update({
      getData: () => [
        nodes,
        (treeNode) => chartConfig.getNodeId(treeNode.data),
      ],
      onNodeAdd: (clickedTreeNode) => {
        const newNodeData = chartConfig.onNodeAdd(clickedTreeNode.data)
        const newDataNode = getDataNode(newNodeData)
        const newNodeHirarchy = hierarchy<DataNode<BaseData>>(
          newDataNode
        ) as TreeNode

        // @ts-ignore
        newNodeHirarchy.depth = clickedTreeNode.depth + 1
        newNodeHirarchy.parent = clickedTreeNode

        clickedTreeNode.children =
          clickedTreeNode.children ?? clickedTreeNode.data._children ?? []
        clickedTreeNode.data._children = clickedTreeNode.children
        clickedTreeNode.children.push(newNodeHirarchy)

        clickedTreeNode.data.children = clickedTreeNode.data.children ?? []
        clickedTreeNode.data.children.push(newNodeHirarchy.data)

        update(clickedTreeNode)
      },
      onNodeClick: (treeNode) => {
        treeNode.children = treeNode.children
          ? undefined
          : treeNode.data._children

        update(treeNode)
      },
      onNodeRemove: (clickedTreeNode) => {
        const parentNode = chartConfig.onNodeRemove(clickedTreeNode.data)

        const treeNode = findNode({
          getId: (node) => chartConfig.getNodeId(node.data),
          node: rootHierarchy,
          nodeId: chartConfig.getNodeId(parentNode as DataNode<BaseData>),
        }) as TreeNode

        const nodeIndex = treeNode.children!.findIndex(
          (node) =>
            chartConfig.getNodeId(node.data) ===
            chartConfig.getNodeId(clickedTreeNode.data)
        )

        treeNode.children!.splice(nodeIndex, 1)

        update(treeNode)
      },
      source,
    })

    linkUI.update({
      getData: () => [
        links,
        (treeLink) => chartConfig.getNodeId(treeLink.target.data),
      ],
      source,
    })

    rootTree.eachBefore((treeNode) => {
      treeNode.data.x0 = treeNode.x
      treeNode.data.y0 = treeNode.y
    })
  }

  update(rootTree)
}
