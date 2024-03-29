import qs from "query-string"

import {
  ChartConfig,
  HorizontalMarker,
  LineStyle,
} from "./crossing-lines-chart"
import { MareysSchedules } from "./mareys-schedule-data-model"
import { CONTAINER_ID } from "./ui-constants"

const formatAMPM = (date: Date) => {
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

  const horizontalMarkerMap = horizontalMarkers.reduce<{
    [key: string]: HorizontalMarker
  }>((...[acc, horizontalMarker]) => {
    acc[horizontalMarker.key] = horizontalMarker

    return acc
  }, {})

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
        return LineStyle.Orange

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

  const onPointClick: ChartConfig["onPointClick"] = (point) => {
    window.open(
      `https://www.google.com/search?${qs.stringify({
        q: `Station California ${point.horizontalMarker.label}`,
      })}`
    )
  }

  return {
    chartTitle,
    crossingLinesData,
    getLineStyle,
    getLineTitle,
    getPointTitle,
    getXAxisLabel,
    onPointClick,
    rootElId: CONTAINER_ID,
  }
}
