import { timeParse, tsv } from "d3"

import { ChartConfig } from "./trend-line-chart"

const CONTAINER_ID = "chart"

type InitialDataItem = {
  occurred: string
  value: string // eslint-disable-line id-denylist
}

type DataItem = {
  arbitraryValue: number
  occurred: Date
}

const createLinearRegression = (lineData: DataItem[]) => {
  const linearRegression: {
    intercept?: number
    r2?: number
    slope?: number
  } = {}
  const { length: itemsNum } = lineData

  let sumX = 0
  let sumY = 0
  let sumXY = 0
  let sumXX = 0
  let sumYY = 0

  lineData.forEach((lineItem) => {
    sumY += lineItem.arbitraryValue
    sumYY += lineItem.arbitraryValue * lineItem.arbitraryValue
    sumXY += lineItem.occurred.getTime() * lineItem.arbitraryValue

    sumX += lineItem.occurred.getTime()
    sumXX += lineItem.occurred.getTime() * lineItem.occurred.getTime()
  })

  linearRegression.slope =
    (itemsNum * sumXY - sumX * sumY) / (itemsNum * sumXX - sumX * sumX)
  linearRegression.intercept = (sumY - linearRegression.slope * sumX) / itemsNum
  linearRegression.r2 = Math.pow(
    (itemsNum * sumXY - sumX * sumY) /
      Math.sqrt(
        (itemsNum * sumXX - sumX * sumX) * (itemsNum * sumYY - sumY * sumY)
      ),
    2
  )

  return linearRegression
}

const fetchData = async (): Promise<DataItem[]> => {
  const response = (await tsv(
    `${ROOT_PATH}data/d3js/trend-line/data.tsv`
  )) as InitialDataItem[]

  const timeFormat = timeParse("%Y-%m-%d")

  return response.map((responseItem) => ({
    arbitraryValue: +responseItem.value,
    occurred: timeFormat(responseItem.occurred)!,
  }))
}

type Config = ChartConfig<DataItem>

const getFullLineX: Config["getFullLineX"] = (lineItem) => lineItem.occurred
const getFullLineY: Config["getFullLineY"] = (lineItem) =>
  lineItem.arbitraryValue
const getDashedLineX: Config["getDashedLineX"] = (lineItem) => lineItem.occurred

const getChartConfig = ({
  initialZoomed,
  lineData,
}: {
  initialZoomed: boolean
  lineData: DataItem[]
}): Config => {
  const linearRegression = createLinearRegression(lineData)
  const getDashedLineY: Config["getDashedLineY"] = (lineItem) =>
    linearRegression.intercept! + linearRegression.slope! * +lineItem.occurred
  const chartText = `Slope: ${linearRegression.slope!.toExponential(3)}`

  return {
    chartText,
    getDashedLineX,
    getDashedLineY,
    getFullLineX,
    getFullLineY,
    initialZoomed,
    lineData,
    rootElId: CONTAINER_ID,
  }
}

export { CONTAINER_ID, fetchData, getChartConfig }
