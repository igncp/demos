import { renderChart } from "./expenses-chord-chart"
import {
  ALL_ID,
  createChartConfig,
  createInitialState,
  fetchData,
  getAreas,
} from "./expenses-chord-chart-data"

const main = async () => {
  const chordData = await fetchData()
  const state = createInitialState()
  const { countries, regions } = getAreas(chordData)
  const chartConfig = createChartConfig({
    chordData,
    countries,
    regions,
    state,
  })

  const { renderItems } = renderChart(chartConfig)

  $("#slider-time").slider({
    change: (...[, { value: timeValue }]) => {
      if (timeValue === 3) {
        // @TODO: error in this case, find why
        return
      }

      state.timeIndex = timeValue!
      renderItems()
    },
    max: chordData[countries[0]][regions[0]].length - 1,
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

    ;[ALL_ID].concat(selectOptions).forEach((selectOption) => {
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
    selectOptions: countries,
  })
  setupSelect({
    id: "regions-select",
    onChange: (newSelected: string) => {
      state.selectedRegion = newSelected
      renderItems()
    },
    selectOptions: regions,
  })
}

export default main
