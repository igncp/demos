import { EmptyConfigItem, getEmptyConfig } from "./sources/empty-config"
import { IncomeResult, getIncomeConfig } from "./sources/income-config"
import { IncomeItem } from "./sources/income-item-model"
import {
  NobelPrizeItem,
  NobelPrizesResult,
  getNobelPrizesConfig,
} from "./sources/nobel-prizes-config"

enum DataSource {
  INCOME = "income",
  NOBEL_PRIZES = "nobel-prizes",
}

const dataSourceToName: Record<DataSource, string> = {
  [DataSource.INCOME]: "Income",
  [DataSource.NOBEL_PRIZES]: "Nobel Prizes (external API)",
}

type AppState = {
  loaded: {
    [key in DataSource]?: boolean
  }
  source: DataSource
}

type GenericItem = EmptyConfigItem | IncomeItem | NobelPrizeItem

const createChartConfig = ({
  appState,
  onConfigLoad,
  updateState,
}: {
  appState: AppState
  onConfigLoad: () => void
  updateState: (newState: Partial<AppState>) => void
}) => {
  let nobelPrizesResult: NobelPrizesResult | null = null
  let incomeResult: IncomeResult | null = null
  const emptyConfig = getEmptyConfig()

  const loadSource = (source: DataSource) => {
    updateState({
      loaded: {
        ...appState.loaded,
        [source]: true,
      },
    })
    onConfigLoad()
  }

  ;(async () => {
    const _incomeResult = await getIncomeConfig()

    incomeResult = _incomeResult
    loadSource(DataSource.INCOME)
  })()
    // eslint-disable-next-line no-console
    .catch(console.log)
  ;(async () => {
    const _nobelPrizesResult = await getNobelPrizesConfig()

    nobelPrizesResult = _nobelPrizesResult
    loadSource(DataSource.NOBEL_PRIZES)
  })()
    // eslint-disable-next-line no-console
    .catch(console.log)

  const getResult = (source?: DataSource) => {
    switch (source ?? appState.source) {
      case DataSource.NOBEL_PRIZES:
        return nobelPrizesResult ?? emptyConfig
      case DataSource.INCOME:
        return incomeResult ?? emptyConfig

      default:
        throw new Error("Unknown source")
    }
  }

  const getConfig = (source?: DataSource) => getResult(source)!.config

  return {
    config: {
      getAreaPoints: () => getConfig().getAreaPoints(),
      getChartTitle: () => getConfig().getChartTitle(),
      getChartTitleShort: () => getConfig().getChartTitleShort(),
      getItemId: (nodeItem: GenericItem) =>
        // @ts-expect-error
        getConfig(nodeItem.source).getItemId(nodeItem),
      getItemTitle: (nodeItem: GenericItem) =>
        // @ts-expect-error
        getConfig(nodeItem.source).getItemTitle(nodeItem),
      getItemXValue: (nodeItem: GenericItem) =>
        // @ts-expect-error
        getConfig(nodeItem.source).getItemXValue(nodeItem),
      getItemYValue: (nodeItem: GenericItem) =>
        // @ts-expect-error
        getConfig(nodeItem.source).getItemYValue(nodeItem),
      getPointClickHandler: () =>
        getConfig().getPointClickHandler() as
          | ((point: GenericItem) => void)
          | null,
      getRootElId: () => getConfig().getRootElId(),
      getVerticalOffset: () => getConfig().getVerticalOffset(),
      getXAxisFormat: () => getConfig().getXAxisFormat(),
      getYAxisFormat: () => getConfig().getYAxisFormat(),
    },
    onUpdateRandomValue: () => getResult()!.onUpdateRandomValue(),
    updateSource: (source: DataSource) => {
      updateState({ source })
    },
  }
}

export {
  createChartConfig,
  AppState,
  DataSource,
  dataSourceToName,
  GenericItem,
}
