import { json } from "d3"

import { ChartConfig, Node } from "./partition-chart"
import { ColorMethod, FormState, PartitionType } from "./partition-controls"
import { CONTAINER_ID } from "./ui-constants"

type DataBase = {
  name: string
  size?: number
}

type DataNodeBase = Node<DataBase>

type DataNode = Node<
  DataBase & {
    id: number
  }
>

const fetchData = async (): Promise<DataNode> => {
  const apiResult = (await json(
    `${ROOT_PATH}data/d3js/partition/flare.json`
  )) as DataNodeBase

  let currentId = 0

  const recursiveFn = (node: DataNodeBase): DataNode => {
    currentId += 1

    const id = currentId

    const children = "children" in node ? node.children!.map(recursiveFn) : null

    return {
      ...node,
      ...(children && {
        children,
      }),
      id,
    } as DataNode
  }

  return recursiveFn(apiResult)
}

type Config = ChartConfig<DataNode>

const getNodeLabel: Config["getNodeLabel"] = (node) => node.name
const getNodeTitle: Config["getNodeTitle"] = ({ nodeData, valueNum }) =>
  `Name: "${nodeData.name}"\nSize: ${
    typeof nodeData.size === "number"
      ? nodeData.size.toLocaleString("en-GB")
      : "-"
  }\nValue: ${
    typeof valueNum === "number" ? valueNum.toLocaleString("en-GB") : "-"
  }`
const getNodeId: Config["getNodeId"] = (node) => node.id

const getChartConfig = ({
  rootData,
  state,
}: {
  rootData: DataNode
  state: FormState
}): Config => {
  const allIds = new Set<number>()

  const getIdsRecursive = (node: DataNode) => {
    const { id } = node

    allIds.add(id)

    if ("children" in node) {
      node.children?.forEach(getIdsRecursive)
    }
  }

  getIdsRecursive(rootData)

  const getHierarchySum: Config["getHierarchySum"] = (node) =>
    state.partitionType === PartitionType.count ? 1 : node.size ?? 0

  const getColorOptions: Config["getColorOptions"] = ({ depths }) =>
    state.colorMethod === ColorMethod.depth ? depths : Array.from(allIds)

  const getNodeColorOption: Config["getNodeColorOption"] = ({ depth, node }) =>
    state.colorMethod === ColorMethod.depth ? depth : node.id

  return {
    getColorOptions,
    getHierarchySum,
    getNodeColorOption,
    getNodeId,
    getNodeLabel,
    getNodeTitle,
    rootData,
    rootElId: CONTAINER_ID,
  }
}

export { fetchData, getChartConfig }
