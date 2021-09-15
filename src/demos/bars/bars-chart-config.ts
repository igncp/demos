export const CONTAINER_ID = "chart"

type BarData = number

export const fetchData = async (): Promise<BarData[]> => {
  const rawData = await fetch(`${ROOT_PATH}data/d3js/bars/data.json`)

  return rawData.json()
}

export const createChartConfig = ({ bars }: { bars: BarData[] }) => ({
  bars,
  rootElId: CONTAINER_ID,
})
