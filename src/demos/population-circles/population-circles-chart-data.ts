import { json } from "d3"
import hotkeys from "hotkeys-js"
import qs from "query-string"

import { ChartConfig } from "./population-circles-chart"

const CONTAINER_ID = "chart"

type PopulationRecord = {
  count: number
  date: string
}

type Municipality = {
  metrics: {
    females: PopulationRecord[]
    males: PopulationRecord[]
    total: PopulationRecord[]
  }
  name: string
}

type PopulationType = keyof Municipality["metrics"]

type State = {
  populationRange: [number, number]
  populationType: PopulationType
  timeRangeIndex: number
}

const createState = (): State => ({
  populationRange: [0, 1],
  populationType: "total",
  timeRangeIndex: 0,
})

const fetchData = async () => {
  type OriginalMunicipality = {
    [key in keyof Omit<Municipality, "metrics">]: Municipality[key]
  } & {
    values: Municipality["metrics"] // eslint-disable-line id-denylist
  }

  const originalMunicipalities = (await (json(
    `${ROOT_PATH}data/d3js/population-circles/data.json`
  ) as unknown)) as OriginalMunicipality[]

  /* eslint-disable id-denylist */
  return originalMunicipalities.map(({ values, ...otherProps }) => ({
    ...otherProps,
    metrics: values,
  }))
  /* eslint-enable id-denylist */
}

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

const createChartConfig = ({
  municipalities,
  state,
}: {
  municipalities: Municipality[]
  state: State
}): ChartConfig<Municipality> => {
  type Config = ChartConfig<Municipality>

  const colorDomain = municipalities.map((municipality) => municipality.name)
  const getStringForColor = (municipality: Municipality) => municipality.name

  const getEmptyItem = (): Municipality => ({
    metrics: {
      females: [],
      males: [],
      total: [],
    },
    name: "",
  })

  const getItemMetric: Config["getItemMetric"] = (
    municipality: Municipality
  ) => {
    if (!(municipality.metrics as unknown)) {
      return 1
    }

    const {
      metrics: {
        [state.populationType]: { [state.timeRangeIndex]: valueItem },
      },
    } = municipality

    return !(valueItem as unknown) ? 0 : valueItem.count
  }

  const getChartItems: Config["getChartItems"] = () => {
    const { populationRange, populationType, timeRangeIndex } = state
    const itemsWithCount = municipalities.filter((municipality) => {
      const {
        metrics: {
          [populationType]: { [timeRangeIndex]: valueItem },
        },
      } = municipality

      return !!(valueItem as unknown)
    })

    const dataValues = itemsWithCount.map((municipality) => {
      const {
        metrics: {
          [populationType]: { [timeRangeIndex]: dataItem },
        },
      } = municipality

      return dataItem.count
    })

    const valueToIdx = dataValues.reduce<Record<string, number[] | undefined>>(
      (...[acc, valueItem, valueIndex]) => {
        acc[valueItem] = acc[valueIndex] ?? []
        acc[valueItem]!.push(valueIndex)

        return acc
      },
      {}
    )

    const sortedDataValues = dataValues.sort(
      (...[municipalityAValue, municipalityBValue]) =>
        municipalityAValue - municipalityBValue
    )

    const percentiles = sortedDataValues.reduce<number[]>(
      (...[percentilesAcc, valueItem, valueIndex]) => {
        const percentile = valueIndex / sortedDataValues.length
        const { [valueItem]: unsortedIndexes } = valueToIdx

        unsortedIndexes!.forEach((unsortedValueIndex: number) => {
          percentilesAcc[unsortedValueIndex] = percentile
        })

        return percentilesAcc
      },
      []
    )

    return itemsWithCount.filter((...[, percentileIndex]) => {
      const { [percentileIndex]: percentile } = percentiles

      return (
        typeof percentile === "number" &&
        percentile >= populationRange[0] &&
        percentile <= populationRange[1]
      )
    })
  }

  const getHeaderText: Config["getHeaderText"] = ({ chartItems }) => {
    const {
      metrics: {
        [state.populationType]: {
          [state.timeRangeIndex]: { date },
        },
      },
    } = chartItems[0]

    const year = getYearStr(date)

    const populationTotal = chartItems.reduce(
      (...[acc, circleData]) =>
        acc +
        circleData.metrics[state.populationType][state.timeRangeIndex].count,
      0
    )

    const populationText = `${formatPopulation(populationTotal)} ${
      typeNouns[state.populationType]
    }`

    const { length: totalNum } = chartItems.filter(
      (chartItem) =>
        chartItem.metrics[state.populationType].length >=
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

  const getItemTitle: Config["getItemTitle"] = ({ circleData }) => {
    const {
      metrics: {
        [state.populationType]: { [state.timeRangeIndex]: valueItem },
      },
    } = circleData

    if (!valueItem as unknown) {
      return ""
    }

    const { [state.populationType]: itemsName } = typeNouns

    return `${circleData.name} - ${formatPopulation(
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
    rootElId: CONTAINER_ID,
  }
}

export { CONTAINER_ID, createChartConfig, createState, fetchData }
