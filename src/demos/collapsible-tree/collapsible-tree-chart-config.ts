import { json } from "d3"

import {
  ChartConfig,
  NodeShape,
  findNode,
  findParentNode,
} from "./collapsible-tree-chart"

export const CONTAINER_ID = "chart"

type RawData = {
  name: string
}

type BaseData = RawData & {
  id: number
}

type RawNode = NodeShape<BaseData>
type BaseNode = NodeShape<BaseData>

const getBaseNode = ({
  context,
  rawNode,
}: {
  context: { id: number }
  rawNode: RawNode
}): BaseNode => {
  const { id: nodeId } = context

  context.id += 1

  return {
    ...rawNode,
    children: (rawNode.children ?? []).map((rawNodeChildren) =>
      getBaseNode({ context, rawNode: rawNodeChildren })
    ),
    id: nodeId,
  }
}

const findMaxId = (node: BaseNode): BaseNode["id"] =>
  (node.children ?? []).reduce(
    (...[acc, childrenNode]) => Math.max(findMaxId(childrenNode), acc),
    node.id
  )

export const fetchData = async (): Promise<BaseNode> => {
  const rawNode = (await json(
    `${ROOT_PATH}data/d3js/collapsible-tree/data.json`
  )) as RawNode

  return getBaseNode({ context: { id: 0 }, rawNode })
}

type Config = ChartConfig<BaseData>

const getNodeLabel: Config["getNodeLabel"] = (node) => node.name
const getNodeId: Config["getNodeId"] = (node) => node.id
const canBeRemoved: Config["canBeRemoved"] = (node) => node.id !== 0

export const createChartConfig = (rootData: BaseNode): Config => {
  const onNodeAdd: Config["onNodeAdd"] = (clickedNode) => {
    const maxId = findMaxId(rootData)
    const baseNode = findNode({
      getId: (node) => node.id,
      node: rootData,
      nodeId: clickedNode.id,
    })

    if (!baseNode) {
      throw new Error("Node not found")
    }

    const newId = maxId + 1

    baseNode.children = baseNode.children ?? []

    const newNode = {
      id: newId,
      name: `New Node id: ${newId}`,
    }

    baseNode.children.push(newNode)

    return newNode
  }

  const onNodeRemove: Config["onNodeRemove"] = (clickedNode) => {
    const parentNode = findParentNode({
      getId: (node) => node.id,
      node: rootData,
      nodeId: clickedNode.id,
    })

    if (!parentNode) {
      throw new Error("No parent node")
    }

    const nodeIndex = parentNode.children!.findIndex(
      (node) => node.id === clickedNode.id
    )

    parentNode.children!.splice(nodeIndex, 1)

    return parentNode
  }

  return {
    canBeRemoved,
    getNodeId,
    getNodeLabel,
    onNodeAdd,
    onNodeRemove,
    rootData,
    rootElId: CONTAINER_ID,
  }
}
