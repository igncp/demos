import { BehaviorSubject } from "rxjs"

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

const main = () => {
  const appState: AppState = {
    loaded: false,
    source: DataSource.INCOME,
  }

  const state$ = new BehaviorSubject(appState)

  const updateState = (newState: Partial<AppState>) => {
    Object.assign(appState, newState)
    state$.next(appState)
  }

  const renderChart = async () => {
    const chartConfig = await createChartConfig({ appState, updateState })

    updateState({
      loaded: true,
    })

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

  renderChart().catch((error) => {
    // eslint-disable-next-line no-console
    console.error(error)
  })

  return { state$ }
}

export {
  CONTAINER_ID,
  DATA_SOURCE_SELECT_ID,
  TOGGLE_BUTTON_ID,
  UPDATE_BUTTON_ID,
}

export default main
