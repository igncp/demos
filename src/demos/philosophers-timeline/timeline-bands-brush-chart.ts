import {
  BaseType,
  ScaleTime,
  Selection,
  axisBottom,
  brushX,
  min as minD3,
  scaleTime,
  select,
  selectAll,
} from "d3"

import * as styles from "./timeline-bands-brush-chart.module.css"

export enum SortOrder {
  Ascending = "ascending",
  Descending = "descending",
}

enum TimeOrder {
  Backward = "backward",
  Forward = "forward",
}

type RedrawComp = {
  redraw?: () => void
}

const margin = {
  bottom: 0,
  left: 20,
  right: 20,
  top: 60,
}

type Band = RedrawComp & {
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
  xScale: ScaleTime<number, number, number>
  y: number
  yScale: (track: number) => number
}

const outerHeight = 700
const height = outerHeight - margin.top - margin.bottom
const bandGap = 25

const toYear = (date: Date) => {
  const bcString = " BC"
  const year = date.getUTCFullYear()

  if (year >= 0) {
    return year.toString()
  }

  return bcString + Math.abs(year)
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

type ChartDataBase = {
  instant: boolean
  track: number
}

export type ChartConfig<ChartData extends ChartDataBase> = {
  chartTitle: string
  getItemLimitLeft: (chartItem: ChartData) => Date
  getItemLimitRight: (chartItem: ChartData) => Date
  getItemText: (o: { chartItem: ChartData; maxLetters: number }) => string
  getItemTitle: (chartItem: ChartData) => string
  getSortFn: (
    sortOrder: SortOrder
  ) => (itemA: ChartData, itemB: ChartData) => number
  onChartItemClick: (chartItem: ChartData) => void
  rootElId: string
}

export class Timeline<ChartData extends ChartDataBase> {
  private readonly chart: Selection<SVGGElement, unknown, HTMLElement, unknown>

  private bandY: number
  private bandNum: number
  private dataContent: {
    chartItems?: ChartData[]
    maxDate?: Date
    minDate?: Date
    nTracks?: number
  }

  private readonly components: RedrawComp[]
  private bands: { [k: string]: Band }
  private readonly width: number
  private readonly chartConfig: ChartConfig<ChartData>

  public constructor(chartConfig: ChartConfig<ChartData>) {
    this.chartConfig = chartConfig

    const rootEl = document.getElementById(chartConfig.rootElId) as HTMLElement

    rootEl.classList.add(styles.timelineChart)

    const { width: outerWidth } = rootEl.getBoundingClientRect()

    this.width = outerWidth - margin.left - margin.right

    this.bandY = 0
    this.bandNum = 0

    this.dataContent = {}
    this.components = []
    this.bands = {}

    const svg = select(`#${chartConfig.rootElId}`)
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
      .text(chartConfig.chartTitle)
      .style("font-weight", "bold")

    filterBlackOpacity({ deviation: 1, id: "intervals", slope: 0.2, svg })

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

  public addChartData(timelineItems: ChartData[]) {
    const tracks: Date[] = []

    this.dataContent.chartItems = timelineItems

    const calculateTracks = ({
      chartItems,
      sortOrderInitial,
      timeOrderInitial,
    }: {
      chartItems: ChartData[]
      sortOrderInitial?: SortOrder
      timeOrderInitial?: TimeOrder
    }) => {
      const sortOrder = sortOrderInitial ?? SortOrder.Descending
      const timeOrder = timeOrderInitial ?? TimeOrder.Forward

      const sortBackward = () => {
        chartItems.forEach((chartItem) => {
          let trackIndex = 0

          for (trackIndex = 0; trackIndex < tracks.length; trackIndex += 1) {
            if (
              this.chartConfig.getItemLimitRight(chartItem) < tracks[trackIndex]
            ) {
              break
            }
          }

          chartItem.track = trackIndex
          tracks[trackIndex] = this.chartConfig.getItemLimitLeft(chartItem)
        })
      }

      const sortForward = () => {
        chartItems.forEach((chartItem) => {
          let trackIndex = 0

          for (trackIndex = 0; trackIndex < tracks.length; trackIndex += 1) {
            if (
              this.chartConfig.getItemLimitLeft(chartItem) > tracks[trackIndex]
            ) {
              break
            }
          }

          chartItem.track = trackIndex

          tracks[trackIndex] = this.chartConfig.getItemLimitRight(chartItem)
        })
      }

      const sortFn = this.chartConfig.getSortFn(sortOrder)

      this.dataContent.chartItems!.sort(sortFn)

      if (timeOrder === TimeOrder.Forward) {
        sortForward()

        return
      }

      sortBackward()
    }

    calculateTracks({
      chartItems: this.dataContent.chartItems,
      sortOrderInitial: SortOrder.Descending,
      timeOrderInitial: TimeOrder.Backward,
    })

    this.dataContent.nTracks = tracks.length
    this.dataContent.minDate = minD3(
      this.dataContent.chartItems,
      this.chartConfig.getItemLimitLeft
    )
    this.dataContent.maxDate = new Date()

    return this
  }

  public xAxis(bandName: string) {
    const {
      bands: { [bandName]: band },
    } = this

    const axis = axisBottom<Date>(band.xScale)
      .tickSize(6)
      .tickFormat((axisTick) => toYear(axisTick))

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

  public addBand({
    bandName,
    sizeFactor,
  }: {
    bandName: string
    sizeFactor: number
  }) {
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

    band.yScale = (track: number) =>
      band.trackOffset! + track * band.trackHeight!

    band.g = this.chart
      .append("g")
      .attr("id", band.id)
      .attr("transform", `translate(0,${band.y})`)

    band.g
      .append("rect")
      .attr("class", styles.band)
      .attr("width", band.w)
      .attr("height", band.h)

    const bandElements = band.g
      .selectAll("g")
      .data<ChartData>(this.dataContent.chartItems!)
      .enter()
      .append<SVGSVGElement>("svg")
      .attr("y", (chartItem) => band.yScale!(chartItem.track))
      .attr("height", band.itemHeight)
      .attr("title", this.chartConfig.getItemTitle)
      .attr(
        "class",
        (chartItem) =>
          `part ${chartItem.instant ? styles.instant : styles.interval}`
      )

    const intervals = select(`#band${this.bandNum}`).selectAll<
      BaseType,
      ChartData
    >(`.${styles.interval}`)

    const instants = select(`#band${this.bandNum}`).selectAll<
      BaseType,
      ChartData
    >(`.${styles.instant}`)

    intervals
      .append("rect")
      .attr("height", "100%")
      .attr("width", "100%")
      .attr("x", "1px")
      .attr("y", ".5px")
      .style("filter", "url(#drop-shadow-intervals)")

    intervals
      .append("text")
      .attr("class", styles.intervalLabel)
      .attr("x", 3)
      .attr("y", 9.5)

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

    const itemsSelections = [intervals, instants]

    itemsSelections.forEach((selection) => {
      selection.on("click", (...[, chartItem]) =>
        this.chartConfig.onChartItemClick(chartItem)
      )
      selection.style("cursor", "pointer")
    })

    const {
      chartConfig: { getItemLimitLeft, getItemLimitRight },
    } = this

    band.redraw = () => {
      bandElements
        .attr("x", (chartItem: ChartData) =>
          band.xScale!(getItemLimitLeft(chartItem))
        )
        .attr(
          "width",
          (chartItem: ChartData) =>
            band.xScale!(getItemLimitRight(chartItem)) -
            band.xScale!(getItemLimitLeft(chartItem))
        )
        .select("text")
        .text((chartItem: ChartData) => {
          const scale =
            band.xScale!(getItemLimitRight(chartItem)) -
            band.xScale!(getItemLimitLeft(chartItem))
          const maxLetters = scale / 9

          return this.chartConfig.getItemText({ chartItem, maxLetters })
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

    type LabelDef = {
      className: string
      getText: (min: Date, max: Date) => string
      id: string
      left: number
      textAnchor: string
      textLeft: number
      top: number
    }

    const labelDefs: LabelDef[] = [
      {
        className: styles.bandMinMaxLabel,
        getText: (min: Date) => toYear(min),
        id: "Start of the selected interval",
        left: 0,
        textAnchor: "start",
        textLeft: 4,
        top: labelTop,
      },
      {
        className: styles.bandMinMaxLabel,
        getText: (...[, max]: [unknown, Date]) => toYear(max),
        id: "End of the selected interval",
        left: band.w - labelWidth,
        textAnchor: "end",
        textLeft: band.w - 4,
        top: labelTop,
      },
      {
        className: styles.bandMidLabel,
        getText: (...[min, max]: [Date, Date]) =>
          (max.getUTCFullYear() - min.getUTCFullYear()).toString(),
        id: "Length of the selected interval",
        left: (band.w - labelWidth) / 2,
        textAnchor: "middle",
        textLeft: band.w / 2,
        top: labelTop,
      },
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
      .attr("x", (label) => label.left)
      .attr("width", labelWidth)
      .attr("height", labelHeight)
      .style("opacity", 1)

    const labels: RedrawComp &
      Selection<SVGTextElement, LabelDef, SVGGElement, unknown> = bandLabels
      .append("text")
      .attr("class", (label) => label.className)
      .attr("id", (label) => label.id)
      .attr("x", (label) => label.textLeft)
      .attr("y", yText)
      .attr("text-anchor", (label) => label.textAnchor)

    labels.redraw = () => {
      const min = band.xScale.domain()[0]
      const max = band.xScale.domain()[1]

      labels.text((label) => label.getText(min, max))
    }

    band.parts.push(labels)
    this.components.push(labels)

    return this
  }

  public addBrush({
    brushBandName,
    targetBandName,
  }: {
    brushBandName: string
    targetBandName: string
  }) {
    const {
      bands: { [brushBandName]: brushBand },
    } = this
    const brush = brushX()

    const {
      dataContent: { maxDate, minDate },
    } = this
    const totalRange = [minDate!.getTime(), maxDate!.getTime()]

    const selectionScale = scaleTime<number, Date>()
      .domain([0, this.width])
      .range(totalRange)

    brush.on("brush", (brushEvent) => {
      let newDomain = brushBand.xScale.domain()

      if (brushEvent.selection) {
        const {
          selection: [selectionStart, selectionEnd],
        } = brushEvent

        newDomain = [
          selectionScale(Math.max(0, selectionStart)),
          selectionScale(Math.min(this.width, selectionEnd)),
        ]
      }

      selectAll(`.${styles.interval} rect`).style("filter", "none")

      this.bands[targetBandName].xScale.domain(newDomain)
      this.bands[targetBandName].redraw!()
    })

    const xBrush = brushBand.g
      .append("svg")
      .attr("class", `x`)
      .call(brush as any) // eslint-disable-line @typescript-eslint/no-explicit-any

    xBrush
      .selectAll("rect")
      .attr("y", 1)
      .attr("height", brushBand.h - 1)

    return this
  }

  public redraw() {
    this.components.forEach((component: RedrawComp) => component.redraw!())

    return this
  }
}
