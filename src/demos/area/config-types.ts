import { ChartConfig } from "./chart/area-chart"

export type ConfigResult<ConfigData> = {
  config: ChartConfig<ConfigData>
  onUpdateRandomValue: () => void
}

export enum DataSource {
  INCOME = "income",
  NOBEL_PRIZES = "nobel-prizes",
}
