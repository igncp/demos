import { json } from "d3"
import hotkeys from "hotkeys-js"
import qs from "query-string"

import { ChartConfig } from "./population-circles-chart"

type PopulationRecord = {
  count: number
  date: string
}

export type Municipality = {
  name: string
  values: {
    females: PopulationRecord[]
    males: PopulationRecord[]
    total: PopulationRecord[]
  }
}

type PopulationType = keyof Municipality["values"]

type State = {
  populationRange: [number, number]
  populationType: PopulationType
  timeRangeIndex: number
}

export const createState = (): State => ({
  populationRange: [0, 1],
  populationType: "total",
  timeRangeIndex: 0,
})

export const fetchData = () =>
  (json(
    `${ROOT_PATH}data/d3js/population-circles/data.json`
  ) as unknown) as Promise<Municipality[]>

const formatPopulation = (populationNum: number) =>
  Number(populationNum.toFixed(0)).toLocaleString(undefined, {
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  })

const typeNouns: Record<string, string> = {
  females: "females",
  males: "males",
  total: "people",
}

const getYearStr = (dateStr: string) => new Date(dateStr).getFullYear()

export const createChartConfig = (
  municipalities: Municipality[],
  state: State
): ChartConfig<Municipality> => {
  type Config = ChartConfig<Municipality>

  const colorDomain = municipalities.map((municipality) => municipality.name)
  const getStringForColor = (municipality: Municipality) => municipality.name

  const getEmptyItem = (): Municipality => ({
    name: "",
    values: {
      females: [],
      males: [],
      total: [],
    },
  })

  const getItemMetric: Config["getItemMetric"] = (
    municipality: Municipality
  ) => {
    if (!(municipality.values as unknown)) {
      return 1
    }

    const {
      values: {
        [state.populationType]: { [state.timeRangeIndex]: valueItem },
      },
    } = municipality

    return !(valueItem as unknown) ? 0 : valueItem.count
  }

  const getChartItems: Config["getChartItems"] = () => {
    const { populationRange, populationType, timeRangeIndex } = state
    const itemsWithCount = municipalities.filter((municipality) => {
      const {
        values: {
          [populationType]: { [timeRangeIndex]: valueItem },
        },
      } = municipality

      return !!(valueItem as unknown)
    })

    const dataValues = itemsWithCount.map((municipality) => {
      const {
        values: {
          [populationType]: { [timeRangeIndex]: dataItem },
        },
      } = municipality

      return dataItem.count
    })

    const valueToIdx = dataValues.reduce((acc, val, idx) => {
      acc[val] = acc[val] ?? []
      acc[val]!.push(idx)

      return acc
    }, {} as Record<string, number[] | undefined>)

    const sortedDataValues = dataValues.sort((a, b) => a - b)

    const percentiles = sortedDataValues.reduce((acc, val, idx) => {
      const percentile = idx / sortedDataValues.length
      const { [val]: unsortedIndexes } = valueToIdx

      unsortedIndexes!.forEach((idx2: number) => {
        acc[idx2] = percentile
      })

      return acc
    }, [] as number[])

    const filteredData = itemsWithCount.filter((_municipality, idx) => {
      const { [idx]: percentile } = percentiles

      return (
        typeof percentile === "number" &&
        percentile >= populationRange[0] &&
        percentile <= populationRange[1]
      )
    })

    return filteredData
  }

  const getHeaderText: Config["getHeaderText"] = ({ chartItems }) => {
    const {
      values: {
        [state.populationType]: {
          [state.timeRangeIndex]: { date },
        },
      },
    } = chartItems[0]

    const year = getYearStr(date)

    const populationTotal = chartItems.reduce(
      (acc, item) =>
        acc + item.values[state.populationType][state.timeRangeIndex].count,
      0
    )

    const populationText = `${formatPopulation(populationTotal)} ${
      typeNouns[state.populationType]
    }`

    const { length: totalNum } = chartItems.filter(
      (chartItem) =>
        chartItem.values[state.populationType].length >=
        state.timeRangeIndex + 1
    )

    return `Population in Malaga: ${year} - ${populationText}${
      state.populationRange[0] === 0 && state.populationRange[1] === 1
        ? ""
        : ` - From ${(state.populationRange[0] * 100).toFixed(
            0
          )} percentile to ${(state.populationRange[1] * 100).toFixed(
            0
          )} percentile`
    } - ${totalNum} municipalities`
  }

  const getItemId: Config["getItemId"] = (municipality) => municipality.name

  const getItemTitle: Config["getItemTitle"] = ({ itemData }) => {
    const {
      values: {
        [state.populationType]: { [state.timeRangeIndex]: valueItem },
      },
    } = itemData

    if (!valueItem as unknown) {
      return ""
    }

    const { [state.populationType]: itemsName } = typeNouns

    return `${itemData.name} - ${formatPopulation(
      valueItem.count
    )} ${itemsName} - ${getYearStr(valueItem.date)}`
  }

  const getItemLabel: Config["getItemLabel"] = (municipality) =>
    municipality.name[0]!

  const getIsSmall = () => state.populationType !== "total"

  const onClick: Config["onClick"] = (municipality) => {
    if (!hotkeys.isPressed("control")) {
      return
    }

    window.open(
      `https://www.google.com/search?${qs.stringify({
        q: `Malaga ${municipality.name}`,
      })}`
    )
  }

  return {
    colorDomain,
    getChartItems,
    getEmptyItem,
    getHeaderText,
    getIsSmall,
    getItemId,
    getItemLabel,
    getItemMetric,
    getItemTitle,
    getStringForColor,
    onClick,
    rootElId: "chart",
  }
}
