import { scaleLinear, scalePoint, scaleSqrt, tsv } from "d3"
import qs from "query-string"

import { ChartConfig, Dimension, DimensionType } from "./lines-chart"

const CONTAINER_ID = "chart"

type ProjectionItem = {
  "Acc. 40º 150%": string
  "Angular": string
  "Areal": string
  "Scale": string
  "name": string
}

type Config = ChartConfig<ProjectionItem>

const fetchData = () =>
  tsv(`${ROOT_PATH}data/d3js/map-distorsions/data.tsv`) as unknown as Promise<
    ProjectionItem[]
  >

enum DimensionName {
  Acc40 = "Acc. 40º 150%",
  Angular = "Angular",
  Areal = "Areal",
  Scale = "Scale",
}

const getTooltipText: Config["getTooltipText"] = (
  projectionItem: ProjectionItem
) => {
  const dimensionsNames = [
    DimensionName.Acc40,
    DimensionName.Scale,
    DimensionName.Areal,
    DimensionName.Angular,
  ] as Array<keyof ProjectionItem>
  const valuesWithDimension = dimensionsNames.map(
    (dimensionName) =>
      `${Number(projectionItem[dimensionName]).toFixed(2)} (${dimensionName})`
  )

  return `${projectionItem.name}: ${valuesWithDimension.join(", ")}`
}

const chartTitle =
  "Comparison of 41 map projections by four different types of distortion. Lower is better."

const chartSmallTitle = "Lower is better."

const onLineClick: Config["onLineClick"] = (...[, projectionItem]) => {
  window.open(
    `https://www.google.com/search?${qs.stringify({
      q: `${projectionItem.name} map projection`,
      tbm: "isch", // Google Images
    })}`
  )
}

const dimensions: Dimension[] = [
  {
    name: "name",
    scale: scalePoint(),
    type: DimensionType.String,
  },
  {
    name: DimensionName.Acc40,
    scale: scaleLinear(),
    type: DimensionType.Number,
  },
  {
    name: DimensionName.Scale,
    scale: scaleLinear(),
    type: DimensionType.Number,
  },
  {
    name: DimensionName.Areal,
    scale: scaleSqrt(),
    type: DimensionType.Number,
  },
  {
    name: DimensionName.Angular,
    scale: scaleLinear(),
    type: DimensionType.Number,
  },
]

const getChartConfig = async (): Promise<Config> => {
  const mapsDistorsions = (await fetchData()).sort(
    (...[{ name: nameA }, { name: nameB }]) => {
      if (nameA === nameB) {
        return 0
      }

      return nameA < nameB ? -1 : 1
    }
  )
  const rootElId = CONTAINER_ID

  return {
    chartSmallTitle,
    chartTitle,
    dimensions,
    getTooltipText,
    lines: mapsDistorsions,
    onLineClick,
    rootElId,
  }
}

export { CONTAINER_ID, getChartConfig }
