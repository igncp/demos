import { extent, scalePow } from "d3"

import { FishEyeChart } from "./fish-eye-chart"
import { RANDOM_UPDATE_ID, fetchData, getChartConfig } from "./fish-eye-config"
import { CONTAINER_ID } from "./ui-constants"

const main = async () => {
  const incomeMetrics = await fetchData()
  const chartConfig = getChartConfig(incomeMetrics)

  const chart = new FishEyeChart(chartConfig)

  document.getElementById(RANDOM_UPDATE_ID)?.addEventListener("click", () => {
    const getCommonExtent = (
      property: "income" | "lifeExpectancy" | "population"
    ) =>
      extent(chartConfig.chartItems, (chartItem) => chartItem[property]) as [
        number,
        number
      ]

    const populationExtent = getCommonExtent("population")
    const incomeExtent = getCommonExtent("income")
    const lifeExpectancyExtent = getCommonExtent("lifeExpectancy")

    const populationScale = scalePow().exponent(20).range(populationExtent)
    const incomeScale = scalePow().exponent(5).range(incomeExtent)
    const lifeExpectancyScale = scalePow()
      .exponent(2)
      .range(lifeExpectancyExtent)

    chartConfig.chartItems.forEach((incomeMetric) => {
      if (Math.random() < 0.1) {
        incomeMetric.population = populationScale(Math.random())
        incomeMetric.income = incomeScale(Math.random())
        incomeMetric.lifeExpectancy = lifeExpectancyScale(Math.random())
      }
    })

    chart.refresh()
  })
}

export { CONTAINER_ID, RANDOM_UPDATE_ID }

export default main
