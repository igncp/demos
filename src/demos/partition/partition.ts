import { PartitionChart } from "./partition-chart"
import {
  PartitionType,
  fetchData,
  getChartConfig,
} from "./partition-chart-config"
import { CONTAINER_ID, TYPE_FORM } from "./ui-constants"

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
