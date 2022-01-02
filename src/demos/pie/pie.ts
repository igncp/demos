import { createChart } from "./pie-chart"
import { createChartConfig } from "./pie-chart-config"
import { BUTTON_ID, setupChartControls } from "./pie-chart-controls"
import { TechItem } from "./tech-data-model"
import { CONTAINER_ID } from "./ui-constants"

const main = async () => {
  const techItems = await TechItem.fetchAndCreateCollection()
  const chartConfig = createChartConfig(techItems)

  const chart = createChart(chartConfig)

  setupChartControls({
    getChartValues: () => techItems,
    onUpdateChart: (updateValue) => {
      chart.update(updateValue)
    },
  })
}

export { BUTTON_ID, CONTAINER_ID }

export default main
