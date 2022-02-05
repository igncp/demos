import { getIncomeConfig } from "./sources/income-config"
import { IncomeItem } from "./sources/income-item-model"
import {
  NobelPrizeItem,
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
  source: DataSource
}

type GenericItem = IncomeItem | NobelPrizeItem

const createChartConfig = async (appState: AppState) => {
  const [incomeResult, nobelPrizesResult] = await Promise.all([
    getIncomeConfig(),
    getNobelPrizesConfig(),
  ])

  const getResult = (source?: DataSource) => {
    switch (source ?? appState.source) {
      case DataSource.NOBEL_PRIZES:
        return nobelPrizesResult
      case DataSource.INCOME:
        return incomeResult

      default:
        throw new Error("Unknown source")
    }
  }

  const getConfig = (source?: DataSource) => getResult(source).config

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
      getRootElId: () => getConfig().getRootElId(),
      getXAxisFormat: () => getConfig().getXAxisFormat(),
      getYAxisFormat: () => getConfig().getYAxisFormat(),
    },
    onUpdateRandomValue: () => getResult().onUpdateRandomValue(),
    updateSource: (source: DataSource) => {
      appState.source = source
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
