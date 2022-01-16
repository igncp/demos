import { PartitionChart } from "./chart/partition-chart"
import { fetchData, getChartConfig } from "./partition-chart-config"
import { setupControls } from "./partition-controls"
import { COLOR_METHOD, CONTAINER_ID, TYPE_FORM } from "./ui-constants"

const main = async () => {
  const { formState, onStateChangeHandler } = setupControls()

  const rootData = await fetchData()

  const chartConfig = getChartConfig({
    rootData,
    state: formState,
  })

  const chart = new PartitionChart(chartConfig)

  chart.render()

  onStateChangeHandler(() => {
    chart.update()
  })
}

export { CONTAINER_ID, TYPE_FORM, COLOR_METHOD }

export default main
