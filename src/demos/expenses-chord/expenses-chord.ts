import { renderChart } from "./expenses-chord-chart"
import {
  ALL_ID,
  createChartConfig,
  createInitialState,
  fetchData,
  getAreas,
} from "./expenses-chord-chart-data"

const main = async () => {
  const data = await fetchData()
  const state = createInitialState()
  const { countries, regions } = getAreas(data)
  const chartConfig = createChartConfig({
    countries,
    data,
    regions,
    state,
  })

  const { renderItems } = renderChart(chartConfig)

  $("#slider-time").slider({
    change: (_e, { value }) => {
      if (value === 3) {
        // @TODO: error in this case, find why
        return
      }

      state.timeIndex = value!
      renderItems()
    },
    max: data[countries[0]][regions[0]].length - 1,
    min: 0,
  })

  const setupSelect = (
    vals: string[],
    id: string,
    onChange: (v: string) => void
  ) => {
    const selectEl = document.getElementById(id) as HTMLSelectElement

    ;[ALL_ID].concat(vals).forEach((val) => {
      const option = document.createElement("option")

      option.setAttribute("value", val)
      option.innerText = val

      selectEl.appendChild(option)
    })

    selectEl.addEventListener("change", () => {
      onChange(selectEl.value)
    })
  }

  setupSelect(countries, "countries-select", (newSelected: string) => {
    state.selectedCountry = newSelected
    renderItems()
  })
  setupSelect(regions, "regions-select", (newSelected: string) => {
    state.selectedRegion = newSelected
    renderItems()
  })
}

export default main
