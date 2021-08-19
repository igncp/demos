import {
  Selection,
  axisBottom,
  brushX,
  csv,
  max as maxD3,
  min as minD3,
  scaleTime,
  select,
  selectAll,
  timeParse,
} from "d3"

import * as styles from "./timeline.module.css"

type DataItem = {
  end: Date
  instant: boolean
  label: string
  start: Date
  track: number
}

type RedrawComp = {
  redraw?: () => void
}

const fetchData = () =>
  (csv(`${ROOT_PATH}data/d3js/timeline/data.csv`) as unknown) as Promise<
    DataItem[]
  >

const margin = {
  bottom: 0,
  left: 20,
  right: 20,
  top: 60,
}

type Action = [string, () => void]

type Band = RedrawComp & {
  addActions: (a: Action[]) => void
  g: Selection<SVGGElement, unknown, HTMLElement, unknown>
  h: number
  id: string
  instantWidth: number
  itemHeight: number
  parts: RedrawComp[]
  trackHeight: number
  trackOffset: number
  w: number
  x: number
  xScale: any
  y: number
  yScale: any
  yearsScale: any
}

const outerHeight = 700
const height = outerHeight - margin.top - margin.bottom
const bandGap = 25

const parseDate = function (dateString: string) {
  const format = timeParse("%Y-%m-%d")

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

const filterBlackOpacity = (
  id: string,
  svg: Selection<SVGGElement, unknown, HTMLElement, unknown>,
  deviation: number,
  slope: number
) => {
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

class Timeline {
  private readonly chart: Selection<SVGGElement, unknown, HTMLElement, unknown>

  private bandY: number
  private bandNum: number
  private dataContent: {
    items?: DataItem[]
    maxDate?: Date
    minDate?: Date
    nTracks?: number
  }

  private readonly components: RedrawComp[]
  private bands: { [k: string]: Band }
  private readonly width: number

  public constructor({ rootElId }: { rootElId: string }) {
    const rootEl = document.getElementById(rootElId) as HTMLElement

    rootEl.classList.add(styles.timelineChart)

    const { width: outerWidth } = rootEl.getBoundingClientRect()

    this.width = outerWidth - margin.left - margin.right

    this.bandY = 0
    this.bandNum = 0

    this.dataContent = {}
    this.components = []
    this.bands = {}

    const svg = select(`#${rootElId}`)
      .text("")
      .append("svg")
      .attr("height", outerHeight + margin.top + margin.bottom)
      .attr("width", outerWidth + margin.left + margin.right)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`)

    svg
      .append("text")
      .attr("class", "chart-title")
      .attr("text-anchor", "middle")
      .attr("transform", `translate(${outerWidth / 2},-20)`)
      .text("Philosophers through History")
      .style("font-weight", "bold")

    filterBlackOpacity("intervals", svg, 1, 0.2)

    svg
      .append("clipPath")
      .attr("id", "chart-area")
      .append("rect")
      .attr("width", this.width)
      .attr("height", height)

    svg.on("mouseup", () =>
      selectAll(`.${styles.interval} rect`).style(
        "filter",
        "url(#drop-shadow-intervals)"
      )
    )

    this.chart = svg
      .append("g")
      .attr("class", styles.chart)
      .attr("clip-path", "url(#chart-area)")
  }

  public data(timelineItems: DataItem[]) {
    const today = new Date()

    const tracks: Date[] = []

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

    const calculateTracks = (
      items: any,
      sortOrderInitial: string,
      timeOrderInitial: string
    ) => {
      const sortOrder = sortOrderInitial || "descending"
      const timeOrder = timeOrderInitial || "backward"

      const sortBackward = () =>
        items.forEach((item: any) => {
          let track = 0

          for (
            let i = 0, _i = 0, { length: _ref } = tracks;
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
            let i = 0, _i = 0, { length: _ref } = tracks;
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
        this.dataContent.items!.sort(compareAscending)
      } else {
        this.dataContent.items!.sort(compareDescending)
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
    this.dataContent.minDate = minD3(this.dataContent.items, (d) => d.start)
    this.dataContent.maxDate = maxD3(
      this.dataContent.items,
      (d: DataItem) => d.end
    )

    return this
  }

  public xAxis(bandName: string) {
    const {
      bands: { [bandName]: band },
    } = this

    const axis = axisBottom<Date>(band.xScale)
      .tickSize(6)
      .tickFormat((d: Date) => toYear(d))

    const xAxis: RedrawComp &
      Selection<SVGGElement, unknown, HTMLElement, unknown> = this.chart
      .append("g")
      .attr("class", styles.axis)
      .attr("transform", `translate(0,${band.y + band.h})`)

    xAxis.redraw = function () {
      xAxis.call(axis)
    }

    band.parts.push(xAxis)
    this.components.push(xAxis)

    return this
  }

  public createTooltip() {
    $(`.part.${styles.instant}, .part.${styles.interval}`).tooltip({
      track: true,
    })

    return this
  }

  public band(bandName: string, sizeFactor: number) {
    const band: Partial<Band> = {}

    band.id = `band${this.bandNum}`
    band.x = 0
    band.y = this.bandY
    band.w = this.width
    band.h = height * (sizeFactor || 1)
    band.trackOffset = 0
    band.trackHeight = Math.min(
      (band.h - band.trackOffset) / this.dataContent.nTracks!,
      20
    )
    band.itemHeight = band.trackHeight * 0.7
    band.parts = []
    band.instantWidth = 100
    band.xScale = scaleTime()
      .domain([this.dataContent.minDate!, this.dataContent.maxDate!])
      .range([0, band.w])

    band.yScale = (track: any) => band.trackOffset! + track * band.trackHeight!

    band.yearsScale =
      this.dataContent.maxDate!.getUTCFullYear() -
      this.dataContent.minDate!.getUTCFullYear()
    band.g = this.chart
      .append("g")
      .attr("id", band.id)
      .attr("transform", `translate(0,${band.y})`)
    band.g
      .append("rect")
      .attr("class", styles.band)
      .attr("width", band.w)
      .attr("height", band.h)

    const items = band.g
      .selectAll("g")
      .data<DataItem>(this.dataContent.items!)
      .enter()
      .append<SVGSVGElement>("svg")
      .attr("y", (d: DataItem) => band.yScale(d.track))
      .attr("height", band.itemHeight)
      .attr("title", (d: DataItem) => {
        if (d.instant) {
          return `${d.label}: ${toYear(d.start)}`
        }

        return `${d.label}: ${toYear(d.start)} - ${toYear(d.end)}`
      })
      .attr("class", (d: DataItem) => {
        if (d.instant) {
          return `part ${styles.instant}`
        }

        return `part ${styles.interval}`
      })

    const intervals = select(`#band${this.bandNum}`).selectAll(
      `.${styles.interval}`
    )

    intervals
      .append("rect")
      .attr("height", "80%")
      .attr("width", "80%")
      .attr("x", "1px")
      .attr("y", ".5px")
      .style("filter", "url(#drop-shadow-intervals)")

    intervals
      .append("text")
      .attr("class", styles.intervalLabel)
      .attr("x", 3)
      .attr("y", 9.5)

    const instants = select(`#band${this.bandNum}`).selectAll(
      `.${styles.instant}`
    )

    instants
      .append("circle")
      .attr("cx", band.itemHeight / 2)
      .attr("cy", band.itemHeight / 2)
      .attr("r", 5)
    instants
      .append("text")
      .attr("class", styles.instantLabel)
      .attr("x", 15)
      .attr("y", 10)

    band.addActions = function (actions: Action[]) {
      actions.forEach((action) => items.on(action[0], action[1]))
    }

    band.redraw = function () {
      items
        .attr("x", (d: DataItem) => band.xScale(d.start))
        .attr(
          "width",
          (d: DataItem) => band.xScale(d.end) - band.xScale(d.start)
        )
        .select("text")
        .text((d: DataItem) => {
          const scale = band.xScale(d.end) - band.xScale(d.start)
          const maxLetters = scale / 9

          if (d.label.length > maxLetters) {
            return `${d.label.substr(0, maxLetters - 1)}..`
          }

          return d.label
        })

      band.parts!.forEach((part) => part.redraw!())
    }

    this.bands[bandName] = band as Band
    this.components.push(band)
    this.bandY += band.h + bandGap
    this.bandNum += 1

    return this
  }

  public labels(bandName: string) {
    const {
      bands: { [bandName]: band },
    } = this
    const labelWidth = 46
    const labelHeight = 20
    const labelTop = band.y + band.h - 10
    const yText = 15
    const labelDefs = [
      [
        "start",
        styles.bandMinMaxLabel,
        0,
        4,
        function (min: Date) {
          return toYear(min)
        },
        "Start of the selected interval",
        band.x + 30,
        labelTop,
      ],
      [
        "end",
        styles.bandMinMaxLabel,
        band.w - labelWidth,
        band.w - 4,
        function (_min: Date, max: Date) {
          return toYear(max)
        },
        "End of the selected interval",
        band.x + band.w - 152,
        labelTop,
      ],
      [
        "middle",
        styles.bandMidLabel,
        (band.w - labelWidth) / 2,
        band.w / 2,
        function (min: Date, max: Date) {
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
      .attr("class", styles.bandLabel)
      .attr("x", (d: any) => d[2])
      .attr("width", labelWidth)
      .attr("height", labelHeight)
      .style("opacity", 1)

    const labels: RedrawComp &
      Selection<SVGTextElement, any, SVGGElement, unknown> = bandLabels
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

  public brush(bandName: string, targetNames: string[]) {
    const {
      bands: { [bandName]: band },
    } = this
    const brush = brushX()

    const selectionScale = scaleTime()
      .domain([0, 1000])
      .range([
        this.dataContent.minDate!.getTime(),
        this.dataContent.maxDate!.getTime(),
      ])

    brush.on("brush", (e) => {
      let newDomain = band.xScale.domain()

      if (e.selection) {
        newDomain = [
          selectionScale(e.selection[0]),
          selectionScale(e.selection[1]),
        ]
      }

      selectAll(`.${styles.interval} rect`).style("filter", "none")

      targetNames.forEach((d: any) => {
        this.bands[d].xScale.domain(newDomain)

        this.bands[d].redraw!()
      })
    })

    const xBrush = band.g
      .append("svg")
      .attr("class", `x`)
      .call(brush as any)

    xBrush
      .selectAll("rect")
      .attr("y", 1)
      .attr("height", band.h - 1)

    return this
  }

  public redraw() {
    this.components.forEach((component: RedrawComp) => component.redraw!())

    return this
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
    .redraw()
    .createTooltip()
}

export default main
