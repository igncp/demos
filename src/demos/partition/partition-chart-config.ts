import { json } from "d3"

import { ChartConfig, Node, PartitionType } from "./partition-chart"
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

const getNodeSize: Config["getNodeSize"] = (node) => node.size
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
  partitionType,
  rootData,
}: {
  partitionType: PartitionType
  rootData: DataNode
}) => ({
  getNodeId,
  getNodeLabel,
  getNodeSize,
  getNodeTitle,
  partitionType,
  rootData,
  rootElId: CONTAINER_ID,
})

export { fetchData, getChartConfig, PartitionType }
