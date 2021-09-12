import { json, timeFormat } from "d3"
import qs from "query-string"

import { Geolocation, MapLayout } from "./circles-map-chart"

class CountriesLayout {
  private readonly countries: MapLayout

  private constructor(countries: MapLayout) {
    this.countries = countries
  }

  public static async createAndFetch() {
    const countries = await json(
      `${ROOT_PATH}data/d3js/meteorites-map/world_countries.json`
    )

    return new CountriesLayout(countries as MapLayout)
  }

  public getCountries() {
    return this.countries
  }
}

type Meteorite = {
  fall: string
  geolocation: Geolocation
  id: string
  mass: string
  name: string
  nametype: string
  recclass: string
  reclat: string
  reclong: string
  year: string
}

class MeteoritesData {
  private readonly meteorites: Meteorite[]

  private constructor(meteorites: Meteorite[]) {
    this.meteorites = meteorites
  }

  public static async createAndFetch() {
    const meteorites = await json(
      `${ROOT_PATH}data/d3js/meteorites-map/meteorites.json`
    )

    return new MeteoritesData(meteorites as Meteorite[])
  }

  public static getMeteoriteId(meteorite: Meteorite) {
    return meteorite.id
  }

  public static getMeteoriteSummaryHTML(meteorite: Meteorite) {
    const year = timeFormat("%Y")(new Date(meteorite.year))
    const mass = new Intl.NumberFormat().format(+meteorite.mass)

    return `
<h1>${meteorite.name}</h1>
<p>Year: ${year}, Class: <a href="https://www.google.com/search?${qs.stringify({
      q: `${meteorite.recclass} Meteorite Class`,
    })}" target="_blank">${meteorite.recclass}</a></p>
<p>${mass ? `Mass: ${mass}g, ` : ""}Name: ${meteorite.nametype}</p>
<p><a href="https://www.google.com/search?${qs.stringify({
      q: `${meteorite.name} Meteorite ${year}`,
    })}" target="_blank">Click here to search</a></p>
`.trim()
  }

  public static getMeteoriteName(meteorite: Meteorite) {
    return meteorite.name
  }

  public getMeteorites() {
    return this.meteorites.slice()
  }
}

export { MeteoritesData, CountriesLayout }
