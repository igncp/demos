import * as d3 from "d3"

import { MareysSchedules } from "../mareys-schedule-data-model"

import { mockSchedules } from "./testData"

jest.spyOn(d3, "tsv")

const tsvMock = d3.tsv as jest.Mock

beforeEach(() => {
  tsvMock.mockImplementationOnce((path) => {
    if (path === `${ROOT_PATH}data/d3js/mareys-schedule/data.tsv`) {
      return Promise.resolve(mockSchedules)
    }

    return Promise.reject()
  })
})

describe("getStations", () => {
  it("returns the expected format", async () => {
    const schedules = await MareysSchedules.fetchAndCreateSchedules()

    expect(
      schedules
        .getStations()
        .sort((...[stationA, stationB]) =>
          stationA.name.localeCompare(stationB.name)
        )[0]
    ).toEqual({
      distance: 40,
      key: "stop|22nd Street|40|1",
      name: "22nd Street",
      zone: 1,
    })
  })
})

describe("getStations", () => {
  it("returns the expected format", async () => {
    const schedules = await MareysSchedules.fetchAndCreateSchedules()

    const sampleTrain = schedules
      .getTrains()
      .sort((...[trainA, trainB]) => trainA.id - trainB.id)[0]

    expect(sampleTrain).toEqual({
      direction: "S",
      id: 0,
      number: "102",
      stops: expect.any(Array),
      type: "N",
    })

    expect(sampleTrain.stops[0]).toEqual({
      station: {
        distance: 124,
        key: "stop|Bayshore|124|1",
        name: "Bayshore",
        zone: 1,
      },
      time: expect.any(Date),
      trainId: 0,
    })
  })
})

describe("getTrainTitle", () => {
  it("returns the expected text", () => {
    const dummyTrain = {
      direction: "S",
      stops: [
        {
          station: {
            name: "first station",
          },
        },
        null,
        {
          station: {
            name: "last station",
          },
        },
      ],
    } as Record<string, unknown>

    expect(
      // @ts-expect-error
      MareysSchedules.getTrainTitle(dummyTrain)
    ).toEqual("first station -> last station")
    expect(
      // @ts-expect-error
      MareysSchedules.getTrainTitle({
        ...dummyTrain,
        direction: "N",
      })
    ).toEqual("last station -> first station")
  })
})
