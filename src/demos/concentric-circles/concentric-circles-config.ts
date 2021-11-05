import { csv } from "d3"

import { ChartConfig } from "./circles-chart"

const CONTAINER_ID = "chart"
const VALUES_SLIDER_ID = "year-slider"

type NamesMetric = {
  count: number
  name: string
  year: string
}

type NamesMetrics = NamesMetric[]

type State = {
  percentage: number
}

const fetchData = async (): Promise<NamesMetrics> => {
  const response = (await csv(
    `${ROOT_PATH}data/d3js/concentric-circles/data.csv`
  )) as unknown as NamesMetrics

  return response.map((nameItem) => ({
    ...nameItem,
    count: +nameItem.count,
  }))
}

type Config = ChartConfig<NamesMetric>

const getCircleValue: Config["getCircleValue"] = (circle) => circle.count
const getCircleId: Config["getCircleId"] = (circle) => circle.name

const getCircleTitle: Config["getCircleTitle"] = (circle) =>
  `${circle.name}: ${circle.count}`

const chartDescription =
  "Circles radius are proportional to order in the ranking"

const getChartConfig = ({
  namesMetrics,
  state,
}: {
  namesMetrics: NamesMetrics
  state: State
}): Config => ({
  chartDescription,
  getCircleId,
  getCircleTitle,
  getCircleValue,
  getCirclesData: () => {
    const addedNames = new Set()

    return namesMetrics
      .sort((...[namesObjA, namesObjB]) => namesObjB.count - namesObjA.count)
      .filter((nameObj) => {
        if (addedNames.has(nameObj.name)) {
          return false
        }

        addedNames.add(nameObj.name)

        return true
      })
      .filter(
        (...[, nameObjIndex, nameObjArr]) =>
          (100 * nameObjIndex) / nameObjArr.length <= state.percentage
      )
      .reverse()
  },
  rootElId: CONTAINER_ID,
})

export { CONTAINER_ID, State, VALUES_SLIDER_ID, fetchData, getChartConfig }
