import * as d3 from "d3"
import each from "lodash/each"
import last from "lodash/last"

import d3utils from "@/demos/_utils/d3nextutils"

const fetchData = async () => {
  const data = await d3.tsv(`${ROOT_PATH}data/d3js/mareys-schedule/data.tsv`)

  const stations = []

  const typeFn = function (d, i) {
    let p = null

    if (!i) {
      for (const k in d) {
        if (/^stop\|/.test(k)) {
          p = k.split("|")
          stations.push({
            distance: +p[2],
            key: k,
            name: p[1],
            zone: +p[3],
          })
        }
      }
    }

    return {
      direction: d.direction,
      number: d.number,
      stops: stations
        .map((s) => ({
          station: s,
          time: parseTime(d[s.key]),
        }))
        .filter((s) => s.time !== null),
      type: d.type,
    }
  }

  const trains = data.map(typeFn)

  trains.forEach((train, index) => {
    train.index = index

    train.stops.forEach((stop) => {
      stop.train_index = index
    })
  })

  return {
    stations,
    trains,
  }
}

const convertHour = ({ slider, redraw }) => {
  const times = []

  each(slider.slider("values"), (sliderValue) => {
    const wholeMinutes = (sliderValue / 100) * 1200

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

    if (minutes < 10) {
      minutes = `0${String(minutes)}`
    }

    const finalTime = `${String(hours)}:${minutes}${fragment}`

    return times.push(finalTime)
  })

  return redraw(times)
}

const getFormatTime = () => d3.timeParse("%I:%M%p")

const parseTime = function (s) {
  const formatTime = getFormatTime()
  const t = formatTime(s)

  if (t !== null && t.getHours() < 3) {
    t.setDate(t.getDate() + 1)
  }

  return t
}

const margin = {
  bottom: 50,
  left: 120,
  right: 50,
  top: 80,
}

const renderChart = ({ rootElId, data }) => {
  const { stations, trains } = data
  const width =
    document.getElementById(rootElId).getBoundingClientRect().width -
    margin.left -
    margin.right

  const height = 600 - margin.top - margin.bottom

  const formatAMPM = function (date) {
    let hours = date.getHours()
    let minutes = date.getMinutes()
    const ampm = hours >= 12 ? "PM" : "AM"

    hours = hours % 12
    hours = hours ? hours : 12
    minutes = minutes < 10 ? `0${minutes}` : minutes

    const strTime = `${hours}:${minutes} ${ampm}`

    return strTime
  }

  const redraw = function (timeRange) {
    const x = d3
      .scaleTime()
      .domain([parseTime(timeRange[0]), parseTime(timeRange[1])])
      .range([0, width])
    const y = d3.scaleLinear().range([0, height])
    const formatTime = getFormatTime()
    const xAxisTop = d3.axisTop(x).ticks(8).tickFormat(formatTime)
    const xAxisBottom = d3.axisBottom(x).ticks(8).tickFormat(formatTime)

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
    y.domain(d3.extent(stations, (d) => d.distance))

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

    const mouseover = function (_e, d) {
      d3.select(`.train-${d.index}`).select("path").style("stroke-width", "5px")
    }

    const mouseleave = function (_e, d) {
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
      .line()
      .x((d) => x(d.time))
      .y((d) => y(d.station.distance))

    const trainTitle = function (trainData) {
      let title = ""

      if (trainData.direction === "S") {
        title = `${trainData.stops[0].station.name} -> ${
          last(trainData.stops).station.name
        }`
      } else {
        title = `${last(trainData.stops).station.name} -> ${
          trainData.stops[0].station.name
        }`
      }

      return title
    }

    train
      .append("path")
      .attr("d", (d) => line(d.stops))
      .append("title")
      .text((d) => trainTitle(d))

    train
      .selectAll("circle")
      .data((d) => d.stops)
      .enter()
      .append("circle")
      .attr(
        "transform",
        (d) => `translate(${x(d.time)},${y(d.station.distance)})`
      )
      .style("filter", "url(#drop-shadow-trains)")
      .attr("r", "5px")
      .append("title")
      .text(
        (d) =>
          `${trainTitle(trains[d.train_index])}\n${
            d.station.name
          } at ${formatAMPM(d.time)}`
      )
  }

  const slider = $(".slider")

  slider.slider({
    change: () => convertHour({ redraw, slider }),
    range: true,
  })

  slider.slider("values", [10, 50])
}

const main = async () => {
  const rootElId = "chart"

  const data = await fetchData()

  renderChart({
    data,
    rootElId,
  })
}

export default main
