import { ChartConfig } from "./circles-map-chart"
import { CountriesLayout, MeteoritesData } from "./meteorites-data-model"

const chartHelpHTML = `
<p>The green circles refer to meteorites which were moved in the map to allow seeing the selected meteorite, which is in red.</p>
<p>You can find the <a href="http://www.meteoritemarket.com/type.htm">meteorites classification here</a></p>
`.trim()

type MeteoriteItem = ReturnType<MeteoritesData["getMeteorites"]>[0]
type Config = ChartConfig<MeteoriteItem>

export const createChartConfig = ({
  countriesLayout,
  meteoritesData,
}: {
  countriesLayout: CountriesLayout
  meteoritesData: MeteoritesData
}): Config => {
  const meteorites = meteoritesData.getMeteorites()

  const getCircleId: Config["getCircleId"] = (meteoriteData) =>
    MeteoritesData.getMeteoriteId(meteoriteData)

  const getModalHTML: Config["getModalHTML"] = (meteoriteData) =>
    MeteoritesData.getMeteoriteSummaryHTML(meteoriteData)

  const getCircleTitle: Config["getCircleTitle"] = (meteoriteData) =>
    meteoriteData.name

  return {
    chartHelpHTML,
    chartTitle: "Meteorite landings in Earth",
    circlesData: meteorites,
    getCircleId,
    getCircleTitle,
    getModalHTML,
    mapLayout: countriesLayout.getCountries(),
    rootElId: "chart",
  }
}
