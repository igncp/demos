import { renderChart } from "./circles-map-chart"
import { CountriesLayout, MeteoritesData } from "./meteorites-data-model"
import { CONTAINER_ID, createChartConfig } from "./meteorites-map-chart-data"

const main = async () => {
  const [meteoritesData, countriesLayout] = await Promise.all([
    MeteoritesData.createAndFetch(),
    CountriesLayout.createAndFetch(),
  ])
  const chartConfig = createChartConfig({ countriesLayout, meteoritesData })

  renderChart(chartConfig)
}

export { CONTAINER_ID }

export default main
