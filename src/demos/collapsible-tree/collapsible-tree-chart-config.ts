import { json } from "d3"

import { ChartConfig, NodeShape } from "./collapsible-tree-chart"

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

export const fetchData = async (): Promise<BaseNode> => {
  const rawNode = (await json(
    `${ROOT_PATH}data/d3js/collapsible-tree/data.json`
  )) as RawNode

  return getBaseNode({ context: { id: 0 }, rawNode })
}

type Config = ChartConfig<BaseData>

const getNodeLabel: Config["getNodeLabel"] = (node) => node.name
const getNodeId: Config["getNodeId"] = (node) => node.id

export const createChartConfig = (rootData: BaseNode): Config => ({
  getNodeId,
  getNodeLabel,
  rootData,
  rootElId: CONTAINER_ID,
})
