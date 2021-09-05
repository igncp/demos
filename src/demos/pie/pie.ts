import { createChart } from "./pie-chart"
import { CONTAINER_ID, createChartConfig } from "./pie-chart-config"
import { BUTTON_ID, setupChartControls } from "./pie-chart-controls"
import { TechItem } from "./tech-data-model"

const main = async () => {
  const techItems = await TechItem.fetchAndCreateCollection()
  const chartConfig = createChartConfig(techItems)

  const chart = createChart(chartConfig)

  setupChartControls((newValue) => {
    chart.update(newValue)
  })
}

export { BUTTON_ID, CONTAINER_ID }

export default main
