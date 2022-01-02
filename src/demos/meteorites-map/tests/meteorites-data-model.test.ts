import * as d3 from "d3"

import { CountriesLayout, MeteoritesData } from "../meteorites-data-model"

import { mockCountries, mockMeteorites } from "./testData"

jest.spyOn(d3, "json")

const jsonMock = d3.json as jest.Mock

describe("CountriesLayout", () => {
  it("requests and serves the expected data", async () => {
    jsonMock.mockImplementationOnce((path) => {
      if (
        path === `${ROOT_PATH}data/d3js/meteorites-map/world_countries.json`
      ) {
        return Promise.resolve(mockCountries)
      }

      return Promise.reject()
    })

    const countriesLayout = await CountriesLayout.createAndFetch()

    expect(countriesLayout.getCountries()).toEqual(mockCountries)
  })
})

describe("MeteoritesData", () => {
  beforeEach(() => {
    jsonMock.mockImplementationOnce((path) => {
      if (path === `${ROOT_PATH}data/d3js/meteorites-map/meteorites.json`) {
        return Promise.resolve(mockMeteorites)
      }

      return Promise.reject()
    })
  })

  it("requests and serves the expected data", async () => {
    const meteorites = await MeteoritesData.createAndFetch()

    expect(meteorites.getMeteorites()).toEqual(mockMeteorites)
  })

  it("returns the expected data in getMeteoriteSummaryHTML", async () => {
    const meteorites = await MeteoritesData.createAndFetch()
    const meteorite0 = meteorites.getMeteorites()[0]

    expect(MeteoritesData.getMeteoriteSummaryHTML(meteorite0)).toEqual(
      [
        "<h1>Aachen</h1>",
        '<p>Year: 1880, Class: <a href="https://www.google.com/search?q=L5%20Meteorite%20Class" target="_blank">L5</a></p>',
        "<p>Mass: 21g, Name: Valid</p>",
        '<p><a href="https://www.google.com/search?q=Aachen%20Meteorite%201880" target="_blank">Click here to search</a></p>',
      ].join("\n")
    )
  })

  it("has some methods to get meteorite data", async () => {
    const meteorites = await MeteoritesData.createAndFetch()
    const meteorite0 = meteorites.getMeteorites()[0]

    expect(MeteoritesData.getMeteoriteId(meteorite0)).toEqual("1")
    expect(MeteoritesData.getMeteoriteName(meteorite0)).toEqual("Aachen")
  })
})
