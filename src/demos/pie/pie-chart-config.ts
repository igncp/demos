import { ChartConfig } from "./pie-chart"
import { TechItem } from "./tech-data-model"
import { CONTAINER_ID } from "./ui-constants"

type Config = ChartConfig<TechItem>

const getSliceValue: Config["getSliceValue"] = (techItem) => techItem.getValue()

const updateSliceValue: Config["updateSliceValue"] = ({
  newValue,
  sliceData: techItem,
}) => {
  techItem.setValue(newValue)
}

const getSliceTitle: Config["getSliceTitle"] = (techItem) =>
  techItem.getSummary()

const createChartConfig = (techItems: TechItem[]): Config => ({
  getSliceTitle,
  getSliceValue,
  pieSlices: techItems,
  rootElId: CONTAINER_ID,
  updateSliceValue,
})

export { createChartConfig }
