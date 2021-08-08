import { json } from "d3"

import { ChartConfig, DisplayType, RibbonType } from "./expenses-chord-chart"

export const ALL_ID = "All"

type State = {
  selectedCountry: string
  selectedRegion: string
  timeIndex: number
}

type DataItem = {
  value: number | null
  year: number
}

type Data = {
  [country: string]: {
    [region: string]: DataItem[]
  }
}

export const createInitialState = (): State => ({
  selectedCountry: ALL_ID,
  selectedRegion: ALL_ID,
  timeIndex: 0,
})

export const getAreas = (data: Data) => {
  const countries = Object.keys(data).sort()
  const regions = Object.keys(data[countries[0]]).sort()

  return { countries, regions }
}

export const fetchData = () =>
  (json(
    `${ROOT_PATH}data/d3js/expenses-chord/data.json`
  ) as unknown) as Promise<Data>

export const createChartConfig = ({
  countries,
  data,
  regions,
  state,
}: {
  countries: string[]
  data: Data
  regions: string[]
  state: State
}): ChartConfig => {
  const names = countries.concat(regions)

  const getChordMatrix: ChartConfig["getChordMatrix"] = () => {
    const matrix = names.map((maybeCountry) => {
      if (!data[maybeCountry] as unknown) {
        return names.map(() => 0)
      }

      if (![ALL_ID, maybeCountry].includes(state.selectedCountry)) {
        return names.map(() => 0)
      }

      return names.map((maybeRegion) => {
        const {
          [maybeCountry]: { [maybeRegion]: dataItem },
        } = data

        if (!dataItem as unknown) {
          return 0
        }

        if (![ALL_ID, maybeRegion].includes(state.selectedRegion)) {
          return 0
        }

        return dataItem[state.timeIndex].value
      })
    }) as number[][]

    return matrix
  }

  // @TODO: confirm title
  const getChordTitle: ChartConfig["getChordTitle"] = (
    sourceIndex,
    targetIndex,
    sourceValue
  ) =>
    `People from "${names[sourceIndex]}" spend into "${names[targetIndex]}": ${sourceValue}`

  const getChordGroupTitle: ChartConfig["getChordGroupTitle"] = (d) => d

  const getRibbonGroupIdColor: ChartConfig["getRibbonGroupIdColor"] = (
    sourceGroupId,
    targetGroupId
  ) => (state.selectedRegion === ALL_ID ? targetGroupId : sourceGroupId)

  const getDisplayTypeOnGroupClick: ChartConfig["getDisplayTypeOnGroupClick"] = (
    chordGroupId
  ) =>
    countries.includes(chordGroupId) ? DisplayType.Source : DisplayType.Target

  const getRibbonType: ChartConfig["getRibbonType"] = () =>
    state.selectedCountry !== ALL_ID && state.selectedRegion !== ALL_ID
      ? RibbonType.Common
      : RibbonType.Arrow

  return {
    chordGroupsIds: names,
    getChordGroupTitle,
    getChordMatrix,
    getChordTitle,
    getDisplayTypeOnGroupClick,
    getRibbonGroupIdColor,
    getRibbonType,
    rootElId: "chart",
  }
}
