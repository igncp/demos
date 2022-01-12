import { json } from "d3"

import { ChartConfig } from "./force-chart"
import { CONTAINER_ID } from "./ui-constants"

type NodeData = {
  name: string
}

type LinkData = {
  name: string
  source: number
  strength: number
  target: number
}

type Config = ChartConfig<NodeData, LinkData>

const fetchForceData = async (): Promise<Config["forceData"]> => {
  const [nodes, links] = (await Promise.all([
    json(`${ROOT_PATH}data/d3js/force/nodes.json`),
    json(`${ROOT_PATH}data/d3js/force/links.json`),
  ])) as [NodeData[], LinkData[]]

  return {
    links,
    nodes,
  } as Config["forceData"]
}

const getNodeText: Config["getNodeText"] = (node) => node.name

const getChartConfig = ({
  forceData,
}: {
  forceData: Config["forceData"]
}): Config => ({
  forceData,
  getNodeText,
  height: 600,
  rootElId: CONTAINER_ID,
})

export { fetchForceData, getChartConfig }
