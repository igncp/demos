import {
  Selection,
  axisBottom,
  axisTop,
  extent,
  line as lineD3,
  scaleLinear,
  scaleTime,
  select,
  timeFormat,
  timeParse,
  tsv,
} from "d3"
import each from "lodash/each"
import last from "lodash/last"
import { v1 as uuid } from "uuid"

import * as styles from "./mareys-schedule.module.css"

type TrainType = "B" | "L" | "N"

type RawDataItem = {
  [stop: string]: string
  direction: string
  number: string
  type: TrainType
}

type Station = {
  distance: number
  key: string
  name: string
  zone: number
}

type Stop = {
  station: Station
  time: Date | null
  trainIndex: number
}

type Train = {
  direction: string
  id: number
  number: string
  stops: Stop[]
  type: TrainType
}

type SchedulesData = {
  stations: Station[]
  trains: Train[]
}

type Limits = [number, number]
type LimitsStr = [string, string]

type Redraw = (range: LimitsStr) => void

const trainTypeToStyle: { [key in TrainType]: string } = {
  B: styles.tB,
  L: styles.tL,
  N: styles.tN,
}

const timeFormatStr = "%I:%M%p"
const getFormatTime = () => (date: Date) => timeFormat(timeFormatStr)(date)
const getParseTime = () => timeParse(timeFormatStr)

const parseTime = (timeStr: string) => {
  const timeDate = getParseTime()(timeStr)

  if (timeDate !== null && timeDate.getHours() < 3) {
    timeDate.setDate(timeDate.getDate() + 1)
  }

  return timeDate
}

const fetchData = async (): Promise<SchedulesData> => {
  const originalItems = ((await tsv(
    `${ROOT_PATH}data/d3js/mareys-schedule/data.tsv`
  )) as unknown) as RawDataItem[]

  const stations: Station[] = []

  const trains: Train[] = originalItems.map((...[train, trainIndex]) => {
    if (trainIndex === 0) {
      for (const key in train) {
        if (/^stop\|/.test(key)) {
          const stopFragments = key.split("|")

          stations.push({
            distance: +stopFragments[2],
            key,
            name: stopFragments[1],
            zone: +stopFragments[3],
          })
        }
      }
    }

    return {
      direction: train.direction,
      id: trainIndex,
      number: train.number,
      stops: stations
        .map((station) => ({
          station,
          time: parseTime(train[station.key]),
          trainIndex,
        }))
        .filter((station) => station.time !== null),
      type: train.type,
    }
  })

  return {
    stations,
    trains,
  }
}

const getTrainTitle = (trainData: Train) => {
  if (trainData.direction === "S") {
    return `${trainData.stops[0].station.name} -> ${
      last(trainData.stops)!.station.name
    }`
  }

  return `${last(trainData.stops)!.station.name} -> ${
    trainData.stops[0].station.name
  }`
}

const refreshOnHourChange = ({
  limits,
  redraw,
}: {
  limits: Limits
  redraw: Redraw
}) => {
  const times: string[] = []

  each(limits, (limit) => {
    const wholeMinutes = (limit / 100) * 1200

    let fragment = "AM"
    let hours = Math.floor(wholeMinutes / 60)
    let minutes = Math.floor(wholeMinutes % 60)

    if (minutes > 30) {
      minutes = minutes - 30
      hours = hours + 1
    } else {
      minutes = minutes + 30
    }

    hours = hours + 4

    if (hours > 23) {
      if (hours === 24) {
        hours = hours - 12
      } else {
        hours = hours - 24
      }
    } else if (hours > 11) {
      fragment = "PM"

      if (hours !== 12) {
        hours = hours - 12
      }
    }

    const minutesStr = minutes < 10 ? `0${minutes}` : minutes.toString()

    const finalTime = `${hours}:${minutesStr}${fragment}`

    return times.push(finalTime)
  })

  redraw(times as LimitsStr)
}

const formatAMPM = function (date: Date) {
  let hours = date.getHours()
  const ampm = hours >= 12 ? "PM" : "AM"

  hours = hours % 12
  hours = hours ? hours : 12

  const minutes = date.getMinutes()
  const minutesStr = minutes < 10 ? `0${minutes}` : minutes.toString()

  return `${hours}:${minutesStr} ${ampm}`
}

const filterBlackOpacity = ({
  deviation,
  id,
  slope,
  svg,
}: {
  deviation: number
  id: string
  slope: number
  svg: Selection<SVGGElement, unknown, HTMLElement, unknown>
}) => {
  const defs = svg.append("defs")
  const filter = defs
    .append("filter")
    .attr("height", "500%")
    .attr("id", `drop-shadow-${id}`)
    .attr("width", "500%")
    .attr("x", "-200%")
    .attr("y", "-200%")

  filter
    .append("feGaussianBlur")
    .attr("in", "SourceAlpha")
    .attr("stdDeviation", deviation)

  filter.append("feOffset").attr("dx", 1).attr("dy", 1)
  filter
    .append("feComponentTransfer")
    .append("feFuncA")
    .attr("slope", slope)
    .attr("type", "linear")

  const feMerge = filter.append("feMerge")

  feMerge.append("feMergeNode")

  feMerge.append("feMergeNode").attr("in", "SourceGraphic")
}

const margin = {
  bottom: 50,
  left: 120,
  right: 50,
  top: 80,
}

const height = 600 - margin.top - margin.bottom

const renderChart = ({
  rootElId,
  schedulesData,
}: {
  rootElId: string
  schedulesData: SchedulesData
}) => {
  const { stations, trains } = schedulesData
  const rootEl = document.getElementById(rootElId) as HTMLElement

  rootEl.classList.add(styles.mareysScheduleChart)

  const width =
    rootEl.getBoundingClientRect().width - margin.left - margin.right

  const trainPathClass = `train-${uuid().slice(0, 6)}`
  const stopCircleClass = `stop-${uuid().slice(0, 6)}`

  const redraw: Redraw = (timeRange) => {
    const x = scaleTime()
      .domain([parseTime(timeRange[0])!, parseTime(timeRange[1])!])
      .range([0, width])
    const y = scaleLinear().range([0, height])
    const formatTime = getFormatTime()
    const xAxisTop = axisTop<Date>(x).ticks(8).tickFormat(formatTime)
    const xAxisBottom = axisBottom<Date>(x).ticks(8).tickFormat(formatTime)

    const svg = select(`#${rootElId}`)
      .text("")
      .append("svg")
      .attr("height", height + margin.top + margin.bottom)
      .attr("width", width + margin.left + margin.right)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`)

    svg
      .append("text")
      .attr("class", styles.chartTitle)
      .attr("text-anchor", "middle")
      .attr("transform", `translate(${width / 2},-40)`)
      .text("E.J. Marey’s graphical train schedule (4:30AM - 1:30AM)")
      .style("font-weight", "bold")

    filterBlackOpacity({
      deviation: 2,
      id: "trains",
      slope: 0.2,
      svg,
    })

    svg
      .append("defs")
      .append("clipPath")
      .attr("id", "clip")
      .append("rect")
      .attr("y", -margin.top)
      .attr("width", width)
      .attr("height", height + margin.top + margin.bottom)

    y.domain(extent(stations, (station) => station.distance) as Limits)

    const stationSelection = svg
      .append("g")
      .attr("class", styles.station)
      .selectAll("g")
      .data(stations)
      .enter()
      .append("g")
      .attr("transform", (station) => `translate(0,${y(station.distance)})`)

    stationSelection
      .append("text")
      .attr("x", -6)
      .attr("dy", ".35em")
      .text((station) => station.name)
    stationSelection.append("line").attr("x2", width)
    svg.append("g").attr("class", `x top ${styles.axis}`).call(xAxisTop)
    svg
      .append("g")
      .attr("class", `x bottom ${styles.axis}`)
      .attr("transform", `translate(0,${height})`)
      .call(xAxisBottom)

    const mouseover = (...[, train]: [unknown, Train]) => {
      select(`.train-${train.id}`).select("path").style("stroke-width", "5px")
    }

    const mouseleave = (...[, train]: [unknown, Train]) => {
      select(`.train-${train.id}`).select("path").style("stroke-width", "2.5px")
    }

    const trainSelection = svg
      .append("g")
      .attr("class", styles.train)
      .attr("clip-path", "url(#clip)")
      .selectAll("g")
      .data(trains.filter((train) => /[NLB]/.test(train.type)))
      .enter()
      .append("g")
      .attr(
        "class",
        (train) => `${trainTypeToStyle[train.type]} train-${train.id}`
      )
      .on("mouseover", mouseover)
      .on("mouseleave", mouseleave)

    const line = lineD3<Stop>()
      .x((stop) => x(stop.time!))
      .y((stop) => y(stop.station.distance))

    trainSelection
      .append("path")
      .attr("d", (train) => line(train.stops))
      .attr("class", trainPathClass)
      .attr("title", getTrainTitle)

    trainSelection
      .selectAll("circle")
      .data((train) => train.stops)
      .enter()
      .append("circle")
      .attr(
        "transform",
        (stop) => `translate(${x(stop.time!)},${y(stop.station.distance)})`
      )
      .style("filter", "url(#drop-shadow-trains)")
      .attr("r", "5px")
      .attr("class", stopCircleClass)
      .attr(
        "title",
        (stop) =>
          `${getTrainTitle(trains[stop.trainIndex])}\n${
            stop.station.name
          } at ${formatAMPM(stop.time!)}`
      )

    $(`.${trainPathClass}`).tooltip({
      track: true,
    })
    $(`.${stopCircleClass}`).tooltip({
      track: true,
    })
  }

  return {
    refresh: (limits: [number, number]) => {
      refreshOnHourChange({
        limits,
        redraw,
      })
    },
  }
}

const main = async () => {
  const rootElId = "chart"

  const schedulesData = await fetchData()

  const { refresh } = renderChart({
    rootElId,
    schedulesData,
  })

  const slider = $(".slider")

  slider.slider({
    change: () => {
      const limits = slider.slider("values") as Limits

      refresh(limits)
    },
    range: true,
  })

  slider.slider("values", [10, 50])
}

export default main
