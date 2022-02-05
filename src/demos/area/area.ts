import {
  AppState,
  DataSource,
  GenericItem,
  createChartConfig,
  dataSourceToName,
} from "./area-config"
import {
  DATA_SOURCE_SELECT_ID,
  TOGGLE_BUTTON_ID,
  UPDATE_BUTTON_ID,
  setupChartControls,
} from "./area-controls"
import { AreaChart } from "./chart/area-chart"
import { CONTAINER_ID } from "./ui-constants"

const main = async () => {
  const appState: AppState = {
    source: DataSource.INCOME,
  }

  const chartConfig = await createChartConfig(appState)

  const areaChart = AreaChart.renderChart<GenericItem>(chartConfig.config)

  setupChartControls({
    onToggleVoronoiClick: () => {
      areaChart.toggleVoronoi()
    },
    onUpdateRandomValue: () => {
      chartConfig.onUpdateRandomValue()

      areaChart.refresh()
    },
    onUpdateSelect: (newDataSource: string) => {
      chartConfig.updateSource(newDataSource as DataSource)

      areaChart.refresh(true)
    },
    selectOptions: Object.values(DataSource).map((dataSource) => ({
      inputValue: dataSource,
      label: dataSourceToName[dataSource],
    })),
  })
}

export {
  CONTAINER_ID,
  DATA_SOURCE_SELECT_ID,
  TOGGLE_BUTTON_ID,
  UPDATE_BUTTON_ID,
}

export default main
