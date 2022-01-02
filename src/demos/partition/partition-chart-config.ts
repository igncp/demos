import { json } from "d3"

import { ChartConfig, Node, PartitionType } from "./partition-chart"
import { CONTAINER_ID } from "./ui-constants"

const TYPE_FORM = "type-form"

type DataNode = Node<{
  name: string
  size?: number
}>

const fetchData = () =>
  json(
    `${ROOT_PATH}data/d3js/partition/flare.json`
  ) as unknown as Promise<DataNode>

type Config = ChartConfig<DataNode>

const getNodeSize: Config["getNodeSize"] = (node) => node.size
const getNodeLabel: Config["getNodeLabel"] = (node) => node.name
const getNodeTitle: Config["getNodeTitle"] = ({ nodeData, valueNum }) =>
  `${nodeData.name}\n${valueNum}`

const getChartConfig = ({
  partitionType,
  rootData,
}: {
  partitionType: PartitionType
  rootData: DataNode
}) => ({
  getNodeLabel,
  getNodeSize,
  getNodeTitle,
  partitionType,
  rootData,
  rootElId: CONTAINER_ID,
})

export { TYPE_FORM, fetchData, getChartConfig, PartitionType }
