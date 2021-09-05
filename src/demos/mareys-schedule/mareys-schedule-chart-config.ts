import {
  ChartConfig,
  HorizontalMarker,
  LineStyle,
} from "./crossing-lines-chart"
import { CONTAINER_ID } from "./mareys-schedule-controls"
import { MareysSchedules } from "./mareys-schedule-data-model"

const formatAMPM = function (date: Date) {
  let hours = date.getHours()
  const ampm = hours >= 12 ? "PM" : "AM"

  hours = hours % 12
  hours = hours ? hours : 12

  const minutes = date.getMinutes()
  const minutesStr = minutes < 10 ? `0${minutes}` : minutes.toString()

  return `${hours}:${minutesStr} ${ampm}`
}

export const createChartConfig = (schedules: MareysSchedules): ChartConfig => {
  const stations = schedules.getStations()
  const horizontalMarkers: HorizontalMarker[] = stations.map((station) => ({
    key: station.key,
    label: station.name,
    position: station.distance,
  }))

  const horizontalMarkerMap = horizontalMarkers.reduce(
    (...[acc, horizontalMarker]) => {
      acc[horizontalMarker.key] = horizontalMarker

      return acc
    },
    {} as { [key: string]: HorizontalMarker }
  )

  const trains = schedules.getTrains()

  const lines = trains.map((train) => ({
    id: train.id,
    points: train.stops.map((stop) => ({
      horizontalMarker: horizontalMarkerMap[stop.station.key],
      lineId: stop.trainId,
      x: stop.time,
    })),
  }))

  const trainsMap = schedules.getTrainsMap()

  const getLineTitle: ChartConfig["getLineTitle"] = (line) => {
    const { [line.id]: trainData } = trainsMap

    return MareysSchedules.getTrainTitle(trainData)
  }

  const getPointTitle: ChartConfig["getPointTitle"] = (point) => {
    const { [point.lineId]: train } = trainsMap

    return `${MareysSchedules.getTrainTitle(train)}\n${
      point.horizontalMarker.label
    } at ${formatAMPM(point.x!)}`
  }

  const getLineStyle: ChartConfig["getLineStyle"] = (line) => {
    const { [line.id]: train } = trainsMap

    switch (train.type) {
      case "B":
        return LineStyle.Red
      case "L":
        return LineStyle.Black
      case "N":
        return LineStyle.Purple

      default:
        return LineStyle.Red
    }
  }

  const crossingLinesData: ChartConfig["crossingLinesData"] = {
    horizontalMarkers,
    lines,
  }

  const chartTitle = "E.J. Marey’s graphical train schedule (4:30AM - 1:30AM)"

  const getXAxisLabel: ChartConfig["getXAxisLabel"] = (date) =>
    MareysSchedules.convertDateToString(date)

  return {
    chartTitle,
    crossingLinesData,
    getLineStyle,
    getLineTitle,
    getPointTitle,
    getXAxisLabel,
    rootElId: CONTAINER_ID,
  }
}
