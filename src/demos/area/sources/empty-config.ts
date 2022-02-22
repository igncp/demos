import { format } from "d3"

import { ChartConfig } from "../chart/area-chart"
import { ConfigResult } from "../config-types"
import { CONTAINER_ID } from "../ui-constants"

type EmptyConfigItem = void
type Config = ChartConfig<EmptyConfigItem>

const getItemXValue: Config["getItemXValue"] = () => 0
const getItemYValue: Config["getItemYValue"] = () => 0
const getItemId: Config["getItemId"] = () => "_"
const getItemTitle: Config["getItemTitle"] = () => ""
const chartTitle = ""
const chartTitleShort = ""

type EmptyResult = ConfigResult<EmptyConfigItem>

const getEmptyConfig = (): EmptyResult => {
  const config = {
    getAreaPoints: () => [],
    getChartTitle: () => chartTitle,
    getChartTitleShort: () => chartTitleShort,
    getItemId,
    getItemTitle,
    getItemXValue,
    getItemYValue,
    getPointClickHandler: () => null,
    getRootElId: () => CONTAINER_ID,
    getVerticalOffset: () => 0.05,
    getXAxisFormat: () => format(".0f"),
    getYAxisFormat: () => format(".0%"),
  }

  const onUpdateRandomValue = () => {}

  return {
    config,
    onUpdateRandomValue,
  }
}

export { getEmptyConfig, EmptyConfigItem }
