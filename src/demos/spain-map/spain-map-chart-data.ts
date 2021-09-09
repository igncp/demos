import { json } from "d3"

import { AreasData, ChartConfig } from "./spain-map-chart"

export const CONTAINER_ID = "chart"

export type Properties = {
  ENGTYPE_3: string // e.g. Comarca
  HASC_3: string
  ID_0: number
  ID_1: number
  ID_2: number
  ID_3: number
  ISO: string // e.g. ESP
  NAME_0: string // e.g. Spain
  NAME_1: string // e.g. Castilla y Leon
  NAME_2: string // e.g. Leon
  NAME_3: string // Sometimes not defined, with 'n.a.'
  NL_NAME_3: string
  REMARKS_3: string
  Shape_Area: number // eslint-disable-line camelcase
  Shape_Leng: number // eslint-disable-line camelcase
  TYPE_3: string // e.g. Comarca
  VALIDFR_3: string
  VALIDTO_3: string
}

type Config = ChartConfig<Properties>

const getTitleText: Config["getTitleText"] = (areaProperties) =>
  [
    (areaProperties.NAME_3 || "").includes("n.a.") ? "" : areaProperties.NAME_3,
    areaProperties.NAME_2,
    areaProperties.NAME_1,
  ]
    .filter((v) => !!v)
    .join(", ")

const getWidths: Config["getWidths"] = (chartWidth) => {
  const widthCanarias = chartWidth / 3.5
  const widthPeninsula = chartWidth - widthCanarias - 10

  return [widthCanarias, widthPeninsula]
}

const projectionsCenters: Config["projectionsCenters"] = [
  [-13, 23],
  [10, 35.5],
]

export const createChartConfig = (areasData: AreasData): Config => ({
  areasData,
  getTitleText,
  getWidths,
  projectionsCenters,
  rootElId: CONTAINER_ID,
})

export const fetchAreasData = () =>
  json(
    `${ROOT_PATH}data/d3js/spain-map/data.json`
  ) as unknown as Promise<AreasData>
