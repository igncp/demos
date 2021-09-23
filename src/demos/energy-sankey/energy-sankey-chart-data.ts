import { format as formatD3, json } from "d3"

import { ChartConfig } from "./energy-sankey-chart"

const CONTAINER_ID = "chart"

type EnergyDataLink = {
  source: string
  target: string
  value: number // eslint-disable-line id-denylist
}

type EnergyDataNode = {
  category: string
  name: string
}

type EnergyData = {
  links: EnergyDataLink[]
  nodes: EnergyDataNode[]
  units: string
}

const fetchData = () =>
  json(`${ROOT_PATH}data/d3js/energy-sankey/data.json`) as Promise<EnergyData>

type Config = ChartConfig<EnergyDataNode, EnergyDataLink>

const getNodeId: Config["getNodeId"] = (energyNode) => energyNode.name
const getNodeText: Config["getNodeText"] = (energyNode) => energyNode.name

const createChartConfig = ({
  energySankeyData,
  onNodeClick,
}: {
  energySankeyData: EnergyData
  onNodeClick: Config["onNodeClick"]
}): Config => {
  const format = (numberValue: number) => {
    const formatFn = formatD3(",.0f")

    return `${formatFn(numberValue)} ${energySankeyData.units}`
  }

  const getNodeTitle: Config["getNodeTitle"] = ({ nodeValue, sankeyNode }) =>
    [
      sankeyNode.category === sankeyNode.name ? "" : sankeyNode.category,
      sankeyNode.name,
      format(nodeValue),
    ]
      .filter(Boolean)
      .join("\n")

  const getLinkTitle: Config["getLinkTitle"] = ({
    sankeyLink,
    sankeyLinkSource,
    sankeyLinkTarget,
  }) =>
    `${sankeyLinkSource.name} → ${sankeyLinkTarget.name}\n${format(
      sankeyLink.value
    )}`

  return {
    chartLinks: energySankeyData.links,
    chartNodes: energySankeyData.nodes,
    getLinkTitle,
    getNodeId,
    getNodeText,
    getNodeTitle,
    onNodeClick,
    rootElId: CONTAINER_ID,
  }
}

export { CONTAINER_ID, createChartConfig, fetchData }
