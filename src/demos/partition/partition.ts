import { PartitionChart } from "./partition-chart"
import {
  CONTAINER_ID,
  PartitionType,
  TYPE_FORM,
  fetchData,
  getChartConfig,
} from "./partition-chart-config"

const main = async () => {
  const rootData = await fetchData()

  const formEl = document.getElementById(TYPE_FORM) as HTMLFormElement

  const getCurrentSelectedRadio = (): PartitionType => {
    const selectedRadio = Array.from(
      formEl.elements as unknown as HTMLInputElement[]
    ).find((formElement: HTMLInputElement) => formElement.checked)

    return selectedRadio!.value as PartitionType
  }

  const partitionType = getCurrentSelectedRadio()

  const chartConfig = getChartConfig({
    partitionType,
    rootData,
  })

  const chart = new PartitionChart(chartConfig)

  chart.render()

  formEl.addEventListener("change", () => {
    const newPartitionType = getCurrentSelectedRadio()

    chart.updatePartition(newPartitionType)
  })
}

export { CONTAINER_ID, TYPE_FORM }

export default main
