import { json } from "d3"

import { AreasData, ChartConfig } from "./n-map-chart"
import { CONTAINER_ID } from "./ui-constants"

const UPDATE_BUTTON_ID = "update-button"

type Properties = {
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
  Shape_Area: number
  Shape_Leng: number
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

const widths: Config["widths"] = (() => {
  const widthPeninsula = 0.8
  const widthCanarias = 0.3

  return [widthPeninsula, widthCanarias]
})()

const projectionsCenters: Config["projectionsCenters"] = [
  [12, 31.5],
  [4, 20],
]

const createChartConfig = (areasData: AreasData): Config => ({
  areasData,
  getTitleText,
  projectionsCenters,
  rootElId: CONTAINER_ID,
  widths,
})

const fetchAreasData = () =>
  json(
    `${ROOT_PATH}data/d3js/spain-map/data.json`
  ) as unknown as Promise<AreasData>

export { Properties, UPDATE_BUTTON_ID, createChartConfig, fetchAreasData }
