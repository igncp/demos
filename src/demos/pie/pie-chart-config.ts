import { ChartConfig } from "./pie-chart"
import { TechItem } from "./tech-data-model"

export const CONTAINER_ID = "chart"

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

export const createChartConfig = (techItems: TechItem[]): Config => ({
  getSliceTitle,
  getSliceValue,
  pieSlices: techItems,
  rootElId: CONTAINER_ID,
  updateSliceValue,
})
