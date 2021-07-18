import * as d3 from "d3"

import d3utils from "@/demos/_utils/d3utils"

import "./timeline.styl"

type DataItem = {
  end: Date
  instant: boolean
  label: string
  start: Date
  track: number
}

const fetchData = () =>
  (d3.csv(`${ROOT_PATH}data/d3js/timeline/data.csv`) as unknown) as DataItem[]

const margin = {
  bottom: 0,
  left: 20,
  right: 20,
  top: 60,
}

const outerHeight = 700
const height = outerHeight - margin.top - margin.bottom
const bandGap = 25

const parseDate = function (dateString: string) {
  const format = d3.timeParse("%Y-%m-%d")

  let date = format(dateString)

  if (date !== null) {
    return date
  }

  const year = isNaN(Number(dateString))
    ? -dateString.replace(/[^0-9]/g, "")
    : +dateString

  if (year < 0 || year > 99) {
    date = new Date(year, 6, 1)
  } else if (year === 0) {
    date = new Date(-1, 6, 1)
  } else {
    date = new Date(year, 6, 1)
    date.setUTCFullYear(year)
  }

  return date
}

const toYear = (date: Date) => {
  const bcString = " BC"
  const year = date.getUTCFullYear()

  if (year >= 0) {
    return year.toString()
  }

  return bcString + Math.abs(year)
}

class Timeline {
  private chart: any
  private bandY: number
  private bandNum: number
  private dataContent: any
  private components: any
  private bands: any
  private width: number

  public constructor({ rootElId }: { rootElId: string }) {
    const rootEl = document.getElementById(rootElId) as HTMLElement

    rootEl.classList.add("timeline-chart")

    const outerWidth = rootEl.getBoundingClientRect().width

    this.width = outerWidth - margin.left - margin.right

    this.bandY = 0
    this.bandNum = 0

    this.dataContent = {}
    this.components = []
    this.bands = {}

    const svg = d3utils.svg(`#${rootElId}`, outerWidth, outerHeight, margin)

    d3utils.middleTitle(svg, outerWidth, "Philosophers through History", -20)
    d3utils.filterBlackOpacity("intervals", svg, 1, 0.2)

    svg
      .append("clipPath")
      .attr("id", "chart-area")
      .append("rect")
      .attr("width", this.width)
      .attr("height", height)

    svg.on("mouseup", () =>
      d3
        .selectAll(".interval rect")
        .style("filter", "url(#drop-shadow-intervals)")
    )

    this.chart = svg
      .append("g")
      .attr("class", "chart")
      .attr("clip-path", "url(#chart-area)")
  }

  public data(timelineItems: DataItem[]) {
    const today = new Date()

    const tracks: any = []
    const yearMillis = 31622400000
    const instantOffset = 100 * yearMillis

    this.dataContent.items = timelineItems

    const compareAscending = function (item1: any, item2: any) {
      let result = item1.start - item2.start

      if (result < 0) {
        return -1
      }

      if (result > 0) {
        return 1
      }

      result = item2.end - item1.end

      if (result < 0) {
        return -1
      }

      if (result > 0) {
        return 1
      }

      return 0
    }

    const compareDescending = function (item1: any, item2: any) {
      let result = item1.start - item2.start

      if (result < 0) {
        return 1
      }

      if (result > 0) {
        return -1
      }

      result = item2.end - item1.end

      if (result < 0) {
        return 1
      }

      if (result > 0) {
        return -1
      }

      return 0
    }

    const calculateTracks = (items: any, sortOrder: any, timeOrder: any) => {
      sortOrder = sortOrder || "descending"
      timeOrder = timeOrder || "backward"

      const sortBackward = () =>
        items.forEach((item: any) => {
          let track = 0

          for (
            let i = 0, _i = 0, _ref = tracks.length;
            0 <= _ref ? _i < _ref : _i > _ref;
            i = 0 <= _ref ? ++_i : --_i
          ) {
            if (item.end < tracks[i]) {
              break
            }

            track++
          }

          item.track = track

          tracks[track] = item.start
        })

      const sortForward = function () {
        return items.forEach((item: any) => {
          let track = 0

          for (
            let i = 0, _i = 0, _ref = tracks.length;
            0 <= _ref ? _i < _ref : _i > _ref;
            i = 0 <= _ref ? ++_i : --_i
          ) {
            if (item.start > tracks[i]) {
              break
            }

            track++
          }

          item.track = track

          tracks[track] = item.end
        })
      }

      if (sortOrder === "ascending") {
        this.dataContent.items.sort(compareAscending)
      } else {
        this.dataContent.items.sort(compareDescending)
      }

      if (timeOrder === "forward") {
        return sortForward()
      }

      return sortBackward()
    }

    this.dataContent.items.forEach((item: any) => {
      item.start = parseDate(item.start)

      if (item.end === "") {
        item.end = new Date(item.start.getTime() + instantOffset)
        item.instant = true
      } else {
        item.end = parseDate(item.end)
        item.instant = false
      }

      if (item.end > today) {
        item.end = today
      }
    })

    calculateTracks(this.dataContent.items, "descending", "backward")

    this.dataContent.nTracks = tracks.length
    this.dataContent.minDate = d3.min(
      this.dataContent.items,
      (d: any) => d.start
    )
    this.dataContent.maxDate = d3.max(this.dataContent.items, (d: any) => d.end)

    return this
  }

  public xAxis(bandName: any) {
    const band = this.bands[bandName]

    const axis = (d3 as any)
      .axisBottom(band.xScale)
      .tickSize(6, 0)
      .tickFormat((d: any) => toYear(d))

    const xAxis: any = this.chart
      .append("g")
      .attr("class", "axis")
      .attr("transform", `translate(0,${band.y + band.h})`)

    xAxis.redraw = function () {
      return xAxis.call(axis)
    }

    band.parts.push(xAxis)
    this.components.push(xAxis)

    return this
  }

  public createTooltip() {
    d3utils.tooltip(".part.instant, .part.interval", {
      followMouse: true,
      leftOffst: 80,
    })

    return this
  }

  public band(bandName: any, sizeFactor: any) {
    const band: any = {}

    band.id = `band${this.bandNum}`
    band.x = 0
    band.y = this.bandY
    band.w = this.width
    band.h = height * (sizeFactor || 1)
    band.trackOffset = 0
    band.trackHeight = Math.min(
      (band.h - band.trackOffset) / this.dataContent.nTracks,
      20
    )
    band.itemHeight = band.trackHeight * 0.7
    band.parts = []
    band.instantWidth = 100
    band.xScale = d3
      .scaleTime()
      .domain([this.dataContent.minDate, this.dataContent.maxDate])
      .range([0, band.w])

    band.yScale = (track: any) => band.trackOffset + track * band.trackHeight

    band.yearsScale =
      this.dataContent.maxDate.getUTCFullYear() -
      this.dataContent.minDate.getUTCFullYear()
    band.g = this.chart
      .append("g")
      .attr("id", band.id)
      .attr("transform", `translate(0,${band.y})`)
    band.g
      .append("rect")
      .attr("class", "band")
      .attr("width", band.w)
      .attr("height", band.h)

    const items = band.g
      .selectAll("g")
      .data(this.dataContent.items)
      .enter()
      .append("svg")
      .attr("y", (d: DataItem) => band.yScale(d.track))
      .attr("height", band.itemHeight)
      .attr("data-title", (d: DataItem) => {
        if (d.instant) {
          return `${d.label}: ${toYear(d.start)}`
        }

        return `${d.label}: ${toYear(d.start)} - ${toYear(d.end)}`
      })
      .attr("class", (d: DataItem) => {
        if (d.instant) {
          return "part instant"
        }

        return "part interval"
      })

    const intervals = d3.select(`#band${this.bandNum}`).selectAll(".interval")

    intervals
      .append("rect")
      .attr("height", "80%")
      .attr("width", "80%")
      .attr("x", "1px")
      .attr("y", ".5px")
      .style("filter", "url(#drop-shadow-intervals)")

    intervals
      .append("text")
      .attr("class", "intervalLabel")
      .attr("x", 3)
      .attr("y", 9.5)

    const instants = d3.select(`#band${this.bandNum}`).selectAll(".instant")

    instants
      .append("circle")
      .attr("cx", band.itemHeight / 2)
      .attr("cy", band.itemHeight / 2)
      .attr("r", 5)
    instants
      .append("text")
      .attr("class", "instantLabel")
      .attr("x", 15)
      .attr("y", 10)

    band.addActions = function (actions: any) {
      return actions.forEach((action: any) => items.on(action[0], action[1]))
    }

    band.redraw = function () {
      items
        .attr("x", (d: any) => band.xScale(d.start))
        .attr("width", (d: any) => band.xScale(d.end) - band.xScale(d.start))
        .select("text")
        .text((d: any) => {
          const scale = band.xScale(d.end) - band.xScale(d.start)
          const maxLetters = scale / 9

          if (d.label.length > maxLetters) {
            return `${d.label.substr(0, maxLetters - 1)}..`
          }

          return d.label
        })

      return band.parts.forEach((part: any) => part.redraw())
    }

    this.bands[bandName] = band
    this.components.push(band)
    this.bandY += band.h + bandGap
    this.bandNum += 1

    return this
  }

  public labels(bandName: any) {
    const band = this.bands[bandName]
    const labelWidth = 46
    const labelHeight = 20
    const labelTop = band.y + band.h - 10
    const yText = 15
    const labelDefs = [
      [
        "start",
        "bandMinMaxLabel",
        0,
        4,
        function (min: any) {
          return toYear(min)
        },
        "Start of the selected interval",
        band.x + 30,
        labelTop,
      ],
      [
        "end",
        "bandMinMaxLabel",
        band.w - labelWidth,
        band.w - 4,
        function (_min: any, max: any) {
          return toYear(max)
        },
        "End of the selected interval",
        band.x + band.w - 152,
        labelTop,
      ],
      [
        "middle",
        "bandMidLabel",
        (band.w - labelWidth) / 2,
        band.w / 2,
        function (min: any, max: any) {
          const result = max.getUTCFullYear() - min.getUTCFullYear()

          return result
        },
        "Length of the selected interval",
        band.x + band.w / 2 - 75,
        labelTop,
      ],
    ]
    const bandLabels = this.chart
      .append("g")
      .attr("id", `${bandName}Labels`)
      .attr("transform", `translate(0,${band.y + band.h + 1})`)
      .selectAll(`#${bandName}Labels`)
      .data(labelDefs)
      .enter()
      .append("g")

    bandLabels
      .append("rect")
      .attr("class", "bandLabel")
      .attr("x", (d: any) => d[2])
      .attr("width", labelWidth)
      .attr("height", labelHeight)
      .style("opacity", 1)

    const labels: any = bandLabels
      .append("text")
      .attr("class", (d: any) => d[1])
      .attr("id", (d: any) => d[0])
      .attr("x", (d: any) => d[3])
      .attr("y", yText)
      .attr("text-anchor", (d: any) => d[0])

    labels.redraw = function () {
      const min = band.xScale.domain()[0]
      const max = band.xScale.domain()[1]

      return labels.text((d: any) => d[4](min, max))
    }

    band.parts.push(labels)
    this.components.push(labels)

    return this
  }

  public brush(bandName: any, targetNames: any) {
    const band = this.bands[bandName]
    const brush = d3.brushX()

    const selectionScale = d3
      .scaleTime()
      .domain([0, 1000])
      .range([
        this.dataContent.minDate.getTime(),
        this.dataContent.maxDate.getTime(),
      ])

    brush.on("brush", (e) => {
      let newDomain = band.xScale.domain()

      if (e.selection) {
        newDomain = [
          selectionScale(e.selection[0]),
          selectionScale(e.selection[1]),
        ]
      }

      d3.selectAll(".interval rect").style("filter", "none")

      targetNames.forEach((d: any) => {
        this.bands[d].xScale.domain(newDomain)

        this.bands[d].redraw()
      })
    })

    const xBrush = band.g.append("svg").attr("class", "x brush").call(brush)

    xBrush
      .selectAll("rect")
      .attr("y", 1)
      .attr("height", band.h - 1)

    return this
  }

  public redraw() {
    return this.components.forEach((component: any) => component.redraw())
  }
}

const main = async () => {
  const dataset = await fetchData()

  new Timeline({ rootElId: "chart" })
    .data(dataset)
    .band("mainBand", 0.82)
    .band("naviBand", 0.08)
    .xAxis("mainBand")
    .xAxis("naviBand")
    .labels("mainBand")
    .labels("naviBand")
    .brush("naviBand", ["mainBand"])
    .createTooltip()
    .redraw()
}

export default main
