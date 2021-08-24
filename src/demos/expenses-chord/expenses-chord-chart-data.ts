import { json } from "d3"

import { ChartConfig, DisplayType, RibbonType } from "./expenses-chord-chart"

export const ALL_ID = "All"

type State = {
  selectedCountry: string
  selectedRegion: string
  timeIndex: number
}

type DataItem = {
  value: number | null // eslint-disable-line id-denylist
  year: number
}

type ChordData = {
  [country: string]: {
    [region: string]: DataItem[]
  }
}

export const createInitialState = (): State => ({
  selectedCountry: ALL_ID,
  selectedRegion: ALL_ID,
  timeIndex: 0,
})

export const getAreas = (chordData: ChordData) => {
  const countries = Object.keys(chordData).sort()
  const regions = Object.keys(chordData[countries[0]]).sort()

  return { countries, regions }
}

export const fetchData = () =>
  (json(
    `${ROOT_PATH}data/d3js/expenses-chord/data.json`
  ) as unknown) as Promise<ChordData>

export const createChartConfig = ({
  chordData,
  countries,
  regions,
  state,
}: {
  chordData: ChordData
  countries: string[]
  regions: string[]
  state: State
}): ChartConfig => {
  const names = countries.concat(regions)

  const getChordMatrix: ChartConfig["getChordMatrix"] = () => {
    const matrix = names.map((maybeCountry) => {
      if (!chordData[maybeCountry] as unknown) {
        return names.map(() => 0)
      }

      if (![ALL_ID, maybeCountry].includes(state.selectedCountry)) {
        return names.map(() => 0)
      }

      return names.map((maybeRegion) => {
        const {
          [maybeCountry]: { [maybeRegion]: dataItem },
        } = chordData

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
    ...[sourceIndex, targetIndex, sourceValue]
  ) =>
    `People from "${names[sourceIndex]}" spend into "${names[targetIndex]}": ${sourceValue}`

  const getChordGroupTitle: ChartConfig["getChordGroupTitle"] = (
    chordItemLabel
  ) => chordItemLabel

  const getRibbonGroupIdColor: ChartConfig["getRibbonGroupIdColor"] = (
    ...[sourceGroupId, targetGroupId]
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
