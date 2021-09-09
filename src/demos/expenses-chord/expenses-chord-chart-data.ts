import { ChartConfig, DisplayType, RibbonType } from "./expenses-chord-chart"
import { Expenses } from "./expenses-chord-data-model"

type State = {
  selectedCountry: string
  selectedRegion: string
  timeIndex: number
}

export const CONTAINER_ID = "chart"

export const createInitialState = (): State => ({
  selectedCountry: Expenses.ALL_ID,
  selectedRegion: Expenses.ALL_ID,
  timeIndex: 0,
})

export const createChartConfig = ({
  expenses,
  state,
}: {
  expenses: Expenses
  state: State
}): ChartConfig => {
  const getChordMatrix: ChartConfig["getChordMatrix"] = () =>
    expenses.getRelationsMatrix({
      countryFilter: state.selectedCountry,
      regionFilter: state.selectedRegion,
      timeIndexFilter: state.timeIndex,
    })

  const allNames = expenses.getAllNames()

  const getChordTitle: ChartConfig["getChordTitle"] = (
    ...[sourceIndex, targetIndex, sourceValue]
  ) =>
    `People from "${allNames[sourceIndex]}" spend into "${allNames[targetIndex]}": ${sourceValue}`

  const getChordGroupTitle: ChartConfig["getChordGroupTitle"] = (
    chordItemLabel
  ) => chordItemLabel

  const getRibbonGroupIdColor: ChartConfig["getRibbonGroupIdColor"] = (
    ...[sourceGroupId, targetGroupId]
  ) =>
    state.selectedRegion === Expenses.ALL_ID ? targetGroupId : sourceGroupId

  const getDisplayTypeOnGroupClick: ChartConfig["getDisplayTypeOnGroupClick"] =
    (chordGroupId) =>
      expenses.getCountriesList().includes(chordGroupId)
        ? DisplayType.Source
        : DisplayType.Target

  const getRibbonType: ChartConfig["getRibbonType"] = () =>
    state.selectedCountry !== Expenses.ALL_ID &&
    state.selectedRegion !== Expenses.ALL_ID
      ? RibbonType.Common
      : RibbonType.Arrow

  return {
    chordGroupsIds: allNames,
    getChordGroupTitle,
    getChordMatrix,
    getChordTitle,
    getDisplayTypeOnGroupClick,
    getRibbonGroupIdColor,
    getRibbonType,
    rootElId: CONTAINER_ID,
  }
}

export const setupChartForm = ({
  expenses,
  renderItems,
  state,
}: {
  expenses: Expenses
  renderItems: () => void
  state: State
}) => {
  $("#slider-time").slider({
    change: (...[, { value: timeValue }]) => {
      if (timeValue === 3) {
        // @TODO: error in this case, find why
        return
      }

      state.timeIndex = timeValue!
      renderItems()
    },
    max: expenses.getTimeFramesNumber(),
    min: 0,
  })

  const setupSelect = ({
    id,
    onChange,
    selectOptions,
  }: {
    id: string
    onChange: (v: string) => void
    selectOptions: string[]
  }) => {
    const selectEl = document.getElementById(id) as HTMLSelectElement

    ;[Expenses.ALL_ID].concat(selectOptions).forEach((selectOption) => {
      const option = document.createElement("option")

      option.setAttribute("value", selectOption)
      option.innerText = selectOption

      selectEl.appendChild(option)
    })

    selectEl.addEventListener("change", () => {
      onChange(selectEl.value)
    })
  }

  setupSelect({
    id: "countries-select",
    onChange: (newSelected: string) => {
      state.selectedCountry = newSelected
      renderItems()
    },
    selectOptions: expenses.getCountriesList(),
  })
  setupSelect({
    id: "regions-select",
    onChange: (newSelected: string) => {
      state.selectedRegion = newSelected
      renderItems()
    },
    selectOptions: expenses.getRegionsList(),
  })
}
