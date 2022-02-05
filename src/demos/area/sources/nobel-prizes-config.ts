import { format, json } from "d3"

import { ChartConfig } from "../chart/area-chart"
import { ConfigResult, DataSource } from "../config-types"
import { CONTAINER_ID } from "../ui-constants"

type NobelPrizeResponse = {
  laureates: Array<{
    birth?: { date: string }
    familyName: { en: string }
    givenName: { en: string }
    id: string
    knownName: { en: string }
    nobelPrizes?: Array<{ awardYear: string }>
    wikipedia: { english: string }
  }>
  links: {
    next: string
  }
}
type NobelPrizeItem = {
  birthYear: number
  id: number
  link: string
  name: string
  prizeYear: number
  source: DataSource.NOBEL_PRIZES
}

type Config = ChartConfig<NobelPrizeItem>

const getItemXValue: Config["getItemXValue"] = (laureate) => laureate.birthYear
const getItemYValue: Config["getItemYValue"] = (laureate) => laureate.prizeYear
const getItemId: Config["getItemId"] = (laureate) =>
  `${laureate.source}-${laureate.id}`

const getItemTitle: Config["getItemTitle"] = (laureate) =>
  `${laureate.name}\nBorn: ${laureate.birthYear}\nAward: ${laureate.prizeYear}`

const chartTitleShort = "Nobel Prizes (subset)"
const chartTitle = `${chartTitleShort} year of birth (x) vs. year of award (y)`

const fetchSomeLaureates = async () => {
  const initialData = (await json(
    "https://api.nobelprize.org/2.1/laureates?limit=100"
  )) as NobelPrizeResponse
  const secondPage = (await json(initialData.links.next)) as NobelPrizeResponse

  initialData.laureates.push(...secondPage.laureates)

  return initialData
}

type NobelPrizesResult = ConfigResult<NobelPrizeItem>

const pointClickHandler = (laureate: NobelPrizeItem) => {
  if (!laureate.link) {
    return
  }

  window.open(laureate.link, "_blank")
}

const getNobelPrizesConfig = async (): Promise<NobelPrizesResult> => {
  const initialData = await fetchSomeLaureates()

  const birthYears = new Set<number>()

  const dataPoints: NobelPrizeItem[] = initialData.laureates
    .filter((laureate) => laureate.birth && laureate.nobelPrizes)
    .map((laureate) => {
      if (!laureate.nobelPrizes || !laureate.birth) {
        return null
      }

      const birthYear = parseInt(laureate.birth.date.split("-")[0], 10)

      if (birthYears.has(birthYear)) {
        return null
      }

      birthYears.add(birthYear)

      const newItem: NobelPrizeItem = {
        birthYear,
        id: Number(laureate.id),
        link: laureate.wikipedia.english || "",
        name:
          laureate.knownName.en ||
          `${laureate.givenName.en} ${laureate.familyName.en}`,
        prizeYear: Number(laureate.nobelPrizes[0].awardYear),
        source: DataSource.NOBEL_PRIZES,
      }

      return newItem
    })
    .filter((laureate) => !!laureate) as NobelPrizeItem[]

  dataPoints.sort(
    (...[laureateA, laureateB]) => laureateA.birthYear - laureateB.birthYear
  )

  const config = {
    getAreaPoints: () => dataPoints,
    getChartTitle: () => chartTitle,
    getChartTitleShort: () => chartTitleShort,
    getItemId,
    getItemTitle,
    getItemXValue,
    getItemYValue,
    getPointClickHandler: () => pointClickHandler,
    getRootElId: () => CONTAINER_ID,
    getVerticalOffset: () => 15,
    getXAxisFormat: () => format(".0f"),
    getYAxisFormat: () => format(".0f"),
  }

  const onUpdateRandomValue = () => {
    Array.from({ length: 50 }).forEach(() => {
      const randomIndex = Math.floor(Math.random() * dataPoints.length)
      const randomChange = Math.random() * 10 * (Math.random() > 0.5 ? 1 : -1)

      dataPoints[randomIndex].prizeYear =
        dataPoints[randomIndex].prizeYear + randomChange
    })
  }

  return {
    config,
    onUpdateRandomValue,
  }
}

export { getNobelPrizesConfig, NobelPrizeItem }
