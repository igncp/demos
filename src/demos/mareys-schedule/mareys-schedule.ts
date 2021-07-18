import * as d3 from "d3"
import each from "lodash/each"
import last from "lodash/last"

import d3utils from "@/demos/_utils/d3utils"

import "./mareys-schedule.styl"

type RawDataItem = {
  direction: string
  number: string
  type: string
  [stop: string]: string
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
  index: number
  number: string
  stops: Stop[]
  type: string
}

type Data = {
  stations: Station[]
  trains: Train[]
}

type Limits = [number, number]
type LimitsStr = [string, string]

type Redraw = (range: LimitsStr) => void

const fetchData = async (): Promise<Data> => {
  const data = ((await d3.tsv(
    `${ROOT_PATH}data/d3js/mareys-schedule/data.tsv`
  )) as unknown) as RawDataItem[]

  const stations: Station[] = []

  const trains: Train[] = data.map((train, trainIndex) => {
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
      index: trainIndex,
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

    const minutesStr = minutes < 10 ? `0${String(minutes)}` : minutes.toString()

    const finalTime = `${String(hours)}:${minutesStr}${fragment}`

    return times.push(finalTime)
  })

  redraw(times as LimitsStr)
}

const getFormatTime = () => d3.timeParse("%I:%M%p")

const parseTime = (timeStr: string) => {
  const formatTime = getFormatTime()
  const timeDate = formatTime(timeStr)

  if (timeDate !== null && timeDate.getHours() < 3) {
    timeDate.setDate(timeDate.getDate() + 1)
  }

  return timeDate
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

const margin = {
  bottom: 50,
  left: 120,
  right: 50,
  top: 80,
}

const height = 600 - margin.top - margin.bottom

const renderChart = ({ rootElId, data }: { rootElId: string; data: Data }) => {
  const { stations, trains } = data
  const rootEl = document.getElementById(rootElId) as HTMLElement

  rootEl.classList.add("mareys-schedule-chart")

  const width =
    rootEl.getBoundingClientRect().width - margin.left - margin.right

  const redraw: Redraw = (timeRange) => {
    const x = d3
      .scaleTime()
      .domain([parseTime(timeRange[0])!, parseTime(timeRange[1])!])
      .range([0, width])
    const y = d3.scaleLinear().range([0, height])
    const formatTime = getFormatTime()
    const xAxisTop = d3
      .axisTop(x)
      .ticks(8)
      .tickFormat(formatTime as any)
    const xAxisBottom = d3
      .axisBottom(x)
      .ticks(8)
      .tickFormat(formatTime as any)

    const svg = d3utils.svg(`#${rootElId}`, width, height, margin)

    d3utils.middleTitle(
      svg,
      width,
      "E.J. Marey’s graphical train schedule " + " (4:30AM - 1:30AM)",
      -40
    )
    d3utils.filterBlackOpacity("trains", svg, 2, 0.2)
    svg
      .append("defs")
      .append("clipPath")
      .attr("id", "clip")
      .append("rect")
      .attr("y", -margin.top)
      .attr("width", width)
      .attr("height", height + margin.top + margin.bottom)

    y.domain(d3.extent(stations, (station) => station.distance) as Limits)

    const station = svg
      .append("g")
      .attr("class", "station")
      .selectAll("g")
      .data(stations)
      .enter()
      .append("g")
      .attr("transform", (d) => `translate(0,${y(d.distance)})`)

    station
      .append("text")
      .attr("x", -6)
      .attr("dy", ".35em")
      .text((d) => d.name)
    station.append("line").attr("x2", width)
    svg.append("g").attr("class", "x top axis").call(xAxisTop)
    svg
      .append("g")
      .attr("class", "x bottom axis")
      .attr("transform", `translate(0,${height})`)
      .call(xAxisBottom)

    const mouseover = function (_e: unknown, d: Train) {
      d3.select(`.train-${d.index}`).select("path").style("stroke-width", "5px")
    }

    const mouseleave = function (_e: unknown, d: Train) {
      d3.select(`.train-${d.index}`)
        .select("path")
        .style("stroke-width", "2.5px")
    }

    const train = svg
      .append("g")
      .attr("class", "train")
      .attr("clip-path", "url(#clip)")
      .selectAll("g")
      .data(trains.filter((d) => /[NLB]/.test(d.type)))
      .enter()
      .append("g")
      .attr("class", (d) => `${d.type} train-${d.index}`)
      .on("mouseover", mouseover)
      .on("mouseleave", mouseleave)

    const line = d3
      .line<Stop>()
      .x((d) => x(d.time!))
      .y((d) => y(d.station.distance))

    train
      .append("path")
      .attr("d", (d) => line(d.stops))
      .append("title")
      .text((d) => getTrainTitle(d))

    train
      .selectAll("circle")
      .data((d) => d.stops)
      .enter()
      .append("circle")
      .attr(
        "transform",
        (d) => `translate(${x(d.time!)},${y(d.station.distance)})`
      )
      .style("filter", "url(#drop-shadow-trains)")
      .attr("r", "5px")
      .append("title")
      .text(
        (d) =>
          `${getTrainTitle(trains[d.trainIndex])}\n${
            d.station.name
          } at ${formatAMPM(d.time!)}`
      )
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

  const data = await fetchData()

  const { refresh } = renderChart({
    data,
    rootElId,
  })

  const slider: any = $(".slider")

  slider.slider({
    change: () => {
      const limits: Limits = slider.slider("values")

      refresh(limits)
    },
    range: true,
  })

  slider.slider("values", [10, 50])
}

export default main
