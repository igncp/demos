import { ChartConfig, DisplayType, RibbonType } from "./expenses-chord-chart"
import { Expenses } from "./expenses-chord-data-model"

type State = {
  selectedCountry: string
  selectedRegion: string
  timeIndex: number
}

const CONTAINER_ID = "chart"
const AUTOMATIC_TIME_ID = "automatic-time"
const SLIDER_TIME_ID = "slider-time"
const COUNTRIES_SELECT_ID = "countries-select"
const REGIONS_SELECT_ID = "regions-select"

const createInitialState = (): State => ({
  selectedCountry: Expenses.ALL_ID,
  selectedRegion: Expenses.ALL_ID,
  timeIndex: 0,
})

class CheckboxHandler {
  private readonly checkbox: HTMLInputElement
  private readonly onChecked: () => void
  private readonly onUnchecked: () => void

  public constructor({
    onChecked,
    onUnchecked,
  }: {
    onChecked: CheckboxHandler["onChecked"]
    onUnchecked: CheckboxHandler["onUnchecked"]
  }) {
    this.onChecked = onChecked
    this.onUnchecked = onUnchecked
    this.checkbox = document.getElementById(
      AUTOMATIC_TIME_ID
    ) as HTMLInputElement
  }

  public init() {
    this.checkbox.setAttribute("checked", "checked")
    this.onChecked()
    this.checkbox.addEventListener("change", () => {
      if (this.checkbox.checked) {
        this.onChecked()
      } else {
        this.onUnchecked()
      }
    })
  }

  public uncheck() {
    this.checkbox.checked = false
    this.onUnchecked()
  }
}

const createChartConfig = ({
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

const setupChartForm = ({
  expenses,
  renderItems,
  state,
}: {
  expenses: Expenses
  renderItems: () => void
  state: State
}) => {
  const sliderMaxValue = expenses.getTimeFramesNumber()

  $(`#${SLIDER_TIME_ID}`).slider({
    change: (...[, { value: timeValue }]) => {
      if (timeValue === 3) {
        // @TODO: error in this case, find why
        return
      }

      state.timeIndex = timeValue!
      renderItems()
    },
    max: sliderMaxValue,
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
    id: COUNTRIES_SELECT_ID,
    onChange: (newSelected: string) => {
      state.selectedCountry = newSelected
      renderItems()
    },
    selectOptions: expenses.getCountriesList(),
  })
  setupSelect({
    id: REGIONS_SELECT_ID,
    onChange: (newSelected: string) => {
      state.selectedRegion = newSelected
      renderItems()
    },
    selectOptions: expenses.getRegionsList(),
  })

  let timeoutId: number | null = null
  const checkboxHandler = new CheckboxHandler({
    onChecked: () => {
      clearInterval(timeoutId!)
      timeoutId = window.setInterval(() => {
        const currentValue = $(`#${SLIDER_TIME_ID}`).slider("value")
        const nextValue = currentValue + 1

        $(`#${SLIDER_TIME_ID}`).slider("value", nextValue)

        if (nextValue >= sliderMaxValue) {
          checkboxHandler.uncheck()
        }
      }, 2000)
    },
    onUnchecked: () => {
      clearInterval(timeoutId!)
    },
  })

  checkboxHandler.init()
}

export {
  AUTOMATIC_TIME_ID,
  CONTAINER_ID,
  COUNTRIES_SELECT_ID,
  REGIONS_SELECT_ID,
  SLIDER_TIME_ID,
  createChartConfig,
  createInitialState,
  setupChartForm,
}
