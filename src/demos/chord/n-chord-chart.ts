import {
  BaseType,
  Chord,
  ChordGroup,
  ScaleOrdinal,
  Selection,
  arc as arcD3,
  chord,
  descending,
  interpolate,
  rgb,
  ribbon as ribbonD3,
  scaleOrdinal,
  schemePastel2,
  select,
} from "d3"
import $ from "jquery"
import "jquery-ui/themes/base/all.css"
import { v1 as uuidv1 } from "uuid"

import * as styles from "./chord.module.css"

if (typeof window !== "undefined") {
  require("jquery-ui/ui/widgets/tooltip")
}

const getRibbonKey = (ribbonNode: Chord) =>
  `${ribbonNode.source.index}_${ribbonNode.target.index}`

const getChordGroupKey = (chordGroup: ChordGroup) => chordGroup.index

const addDropShadowFilter = <SVGData>({
  charts,
  deviation,
  name,
  slope,
}: {
  charts: Selection<SVGGElement, SVGData, BaseType, unknown>
  deviation: number
  name: string
  slope: number
}) => {
  const defs = charts.append("defs")
  const filter = defs.append("filter").attr("id", name)

  filter
    .append("feOffset")
    .attr("dx", 0.5)
    .attr("dy", 0.5)
    .attr("in", "SourceGraphic")
    .attr("result", "offOut")

  filter
    .append("feGaussianBlur")
    .attr("in", "offOut")
    .attr("result", "blurOut")
    .attr("stdDeviation", deviation)

  filter
    .append("feBlend")
    .attr("in", "SourceGraphic")
    .attr("in2", "blurOut")
    .attr("mode", "normal")

  filter
    .append("feComponentTransfer")
    .append("feFuncA")
    .attr("slope", slope)
    .attr("type", "linear")
}

const margin = {
  bottom: 20,
  top: 50,
}

type GroupItem = {
  id: number
  label: string
}
type ChordMatrix = number[][]

type ChartConfig = {
  chords: ChordMatrix[]
  chordsTitles: string[]
  getGroupTitle: (options: {
    chartIndex: number
    chordGroup: ChordGroup
  }) => string
  getRibbonTitle: (options: {
    chartIndex: number
    sourceIndex: number
    sourceValue: number
    targetIndex: number
    targetValue: number
  }) => string
  groupItems: GroupItem[]
  rootElId: string
}

type ChartElements = Readonly<{
  charts: Selection<SVGGElement, ChordMatrix, BaseType, unknown>
  chartsDivs: Selection<HTMLDivElement, ChordMatrix, BaseType, unknown>
  chartsSVGs: Selection<SVGSVGElement, ChordMatrix, BaseType, unknown>
  root: Selection<BaseType, unknown, HTMLElement, unknown>
}>

interface BaseChart {
  refresh: () => void
  tearDown: () => void
}

class NChordChart implements BaseChart {
  private readonly config: ChartConfig
  private readonly dropShadowGroupsId: string
  private readonly ribbonItemClass: string
  private readonly chordGroupClass: string
  private readonly elements: ChartElements
  private readonly colorScale: ScaleOrdinal<number, string>

  private constructor(chartConfig: ChartConfig) {
    this.config = chartConfig

    const {
      config: { chords, rootElId },
    } = this

    this.dropShadowGroupsId = `drop-shadow-groups-${uuidv1().slice(0, 6)}`
    this.ribbonItemClass = `ribbon-item-${uuidv1().slice(0, 6)}`
    this.chordGroupClass = `chord-group-${uuidv1().slice(0, 6)}`

    const root = select(`#${rootElId}`)
      .style("width", "100%")
      .style("justify-content", "space-evenly")

    root.selectAll("div").data(chords).enter().append("div")

    const chartsDivs = root.selectAll<HTMLDivElement, ChordMatrix>("div")
    const chartsSVGs = chartsDivs.append("svg")
    const charts = chartsSVGs.append("g")

    this.elements = {
      charts,
      chartsDivs,
      chartsSVGs,
      root,
    }

    charts.each((...[, chartIndex]) => {
      const chart = charts.filter(
        (...[, chartIndexInner]) => chartIndex === chartIndexInner
      )
      const {
        chordsTitles: { [chartIndex]: label },
      } = chartConfig

      chart
        .append("text")
        .text(label)
        .attr("class", styles.chartTitle)
        .attr("text-anchor", "middle")
    })

    addDropShadowFilter({
      charts,
      deviation: 3,
      name: this.dropShadowGroupsId,
      slope: 0.5,
    })

    this.colorScale = scaleOrdinal<number, string>(schemePastel2)

    this.render()

    window.addEventListener("resize", this.handleWindowResize)
  }

  public static renderChart(chartConfig: ChartConfig) {
    return new NChordChart(chartConfig)
  }

  public tearDown() {
    window.removeEventListener("resize", this.handleWindowResize)
  }

  public refresh() {
    this.render(true)
  }

  private render(withAnimation?: boolean) {
    const {
      colorScale,
      config: { chords, getGroupTitle, getRibbonTitle, groupItems, rootElId },
    } = this

    const animationDuration = withAnimation ? 1000 : 0
    const rootEl = document.getElementById(rootElId) as HTMLElement
    const { width: fullWidth } = rootEl.getBoundingClientRect()
    const width = fullWidth / chords.length - 20
    const isSmallDevice = fullWidth < 768
    const height = isSmallDevice ? fullWidth : width
    const {
      elements: { charts, chartsDivs, chartsSVGs, root },
    } = this

    const outerRadius =
      Math.min(width, height) / (isSmallDevice ? 1 : chords.length) -
      (isSmallDevice ? 0 : 20)
    const innerRadius = outerRadius - 20

    const chordGroupArc = arcD3<ChordGroup>()
      .innerRadius(innerRadius)
      .outerRadius(outerRadius)

    root
      .style("display", isSmallDevice ? "flex" : "inline-flex")
      .style("flex-direction", isSmallDevice ? "column" : "row")

    chartsDivs
      .attr("width", isSmallDevice ? fullWidth : width)
      .style("height", `${height + margin.top + margin.bottom}px`)

    chartsSVGs
      .attr("width", isSmallDevice ? fullWidth : width)
      .attr("height", height + margin.top + margin.bottom)

    charts.attr(
      "transform",
      isSmallDevice
        ? `translate(${fullWidth / 2},${height / 2 + margin.top})`
        : `translate(${width / 2},${height / 2 + margin.top})`
    )

    charts.each((...[, chartIndex]) => {
      const chart = charts.filter(
        (...[, chartIndexInner]) => chartIndex === chartIndexInner
      )

      chart
        .select(`.${styles.chartTitle}`)
        .attr("transform", `translate(0,${(-1 * height) / 2 - 0})`)
    })

    const { chordGroupClass, dropShadowGroupsId, ribbonItemClass } = this

    charts.each(function renderSingleChart(...[numberMatrix, chartIndex]) {
      const chartSel = select(this)

      const chordData = chord().sortChords(descending)(numberMatrix)

      const ribbonPath = ribbonD3<Chord, Chord>().radius(innerRadius)

      const initialRibbonsData = chartSel
        .selectAll<SVGPathElement, Chord>(`.${styles.chord}`)
        .data()
        .reduce<{ [k: string]: Chord | undefined }>((...[acc, ribbonNode]) => {
          acc[getRibbonKey(ribbonNode)] = ribbonNode

          return acc
        }, {})

      const chordUpdated = chartSel
        .selectAll(`.${styles.chord}`)
        .data(chordData, (...[, ribbonIndex]) => ribbonIndex)

      chordUpdated
        .enter()
        .append("path")
        .attr("class", `${styles.chord} ${ribbonItemClass}`)
      chordUpdated.exit().remove()

      chartSel
        .selectAll<SVGPathElement, Chord>(`path.${styles.chord}`)
        .style("fill", (chordItem) => colorScale(chordItem.target.index))
        .style("stroke", (ribbonItem) => {
          const originalColor = colorScale(ribbonItem.target.index)
          const newColor = rgb(originalColor).darker()

          return newColor.formatHex()
        })
        .style("stroke-width", 2)
        .attr("title", (ribbonItem) =>
          getRibbonTitle({
            chartIndex,
            sourceIndex: ribbonItem.source.index,
            sourceValue: ribbonItem.source.value,
            targetIndex: ribbonItem.target.index,
            targetValue: ribbonItem.source.value,
          })
        )
        .transition()
        .duration(animationDuration)
        .attrTween("d", (finalRibbon) => {
          const { [getRibbonKey(finalRibbon)]: initialRibbon } =
            initialRibbonsData
          const interpolateFn = interpolate(
            initialRibbon ?? finalRibbon,
            finalRibbon
          )

          return (time) => {
            const interpolatedRibbon = interpolateFn(time)

            return ribbonPath(interpolatedRibbon)!
          }
        })

      const newGroupsSel = chartSel
        .selectAll<SVGGElement, ChordGroup>(`.${styles.group}`)
        .data(chordData.groups, getChordGroupKey)
        .enter()
        .append("g")
        .attr("class", styles.group)

      newGroupsSel.append("path").attr("class", chordGroupClass)
      newGroupsSel
        .append("text")
        .attr("class", "group-text")
        .attr("x", 6)
        .attr("dy", 15)
        .append("textPath")
        .attr(
          "xlink:href",
          (chordGroup) => `#group${chordGroup.index}-${chartIndex}`
        )
        .attr("class", styles.groupLabel)
        .text((chordGroup) => groupItems[chordGroup.index].label)

      const initialGroupsData = chartSel.selectAll(`.${chordGroupClass}`).data()
      const groupsSel = chartSel.selectAll(`.${styles.group}`)

      groupsSel
        .selectAll<SVGPathElement, ChordGroup>(`.${chordGroupClass}`)
        .data(chordData.groups, getChordGroupKey)
        .style("fill", (chordGroup) => colorScale(chordGroup.index))
        .attr("id", (chordGroup) => `group${chordGroup.index}-${chartIndex}`)
        .style("filter", () => `url(#${dropShadowGroupsId})`)
        .attr("title", (chordGroup) =>
          getGroupTitle({
            chartIndex,
            chordGroup,
          })
        )
        .transition()
        .duration(animationDuration)
        .attrTween("d", (finalGroup) => {
          const { [finalGroup.index]: initialGroup } = initialGroupsData
          const interpolateFn = interpolate(initialGroup, finalGroup)

          return (t) => chordGroupArc(interpolateFn(t))!
        })

      groupsSel
        .selectAll<SVGTextElement, ChordGroup>(".group-text")
        .selectAll<SVGTextPathElement, ChordGroup>("textPath")
        .data(chordData.groups, getChordGroupKey)
        .transition()
        .duration(animationDuration)
        .style("opacity", (chordGroup) =>
          Math.abs(chordGroup.startAngle - chordGroup.endAngle) > 0.4 ? 1 : 0
        )
      ;[ribbonItemClass, chordGroupClass].forEach((className) => {
        $(`.${className}`).tooltip({
          track: true,
        })
      })
    })
  }

  private readonly handleWindowResize = () => {
    this.render()
  }
}

export { NChordChart, ChartConfig }
