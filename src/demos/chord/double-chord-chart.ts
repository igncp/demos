import {
  BaseType,
  Chord,
  ChordGroup,
  Selection,
  arc as arcD3,
  chord,
  descending,
  extent,
  range,
  rgb,
  ribbon as ribbonD3,
  scaleLinear,
  select,
} from "d3"
import { v1 as uuidv1 } from "uuid"

import * as styles from "./chord.module.css"

const addDropShadowFilter = <SVGData>({
  charts,
  deviation,
  name,
  slope,
}: {
  charts: Selection<BaseType, SVGData, BaseType, unknown>
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

const colours = [
  "#39B347",
  "#C92E47",
  "#DB704D",
  "#FFA22C",
  "#5E92AA",
  "#F8EDD3",
]

const margin = {
  bottom: 20,
  top: 50,
}
const height = 500

type GroupItem = {
  id: number
  label: string
}
type ChordMatrix = number[][]

export type ChartConfig = {
  chords: [ChordMatrix, ChordMatrix]
  chordsTitles: [string, string]
  getGroupTitle: (options: {
    chartIndex: number
    chordGroup: ChordGroup
  }) => string
  getRibbonTitle: (options: {
    sourceIndex: number
    sourceValue: number
    targetIndex: number
    targetValue: number
  }) => string
  groupItems: GroupItem[]
  rootElId: string
}

export const renderChart = (chartConfig: ChartConfig) => {
  const { chords, chordsTitles, groupItems, rootElId } = chartConfig
  const rootEl = document.getElementById(rootElId) as HTMLElement
  const [leftChordItems, rightChordItems] = chords
  const [leftChordLabel, rightChordLabel] = chordsTitles

  const dropShadowRibbonsId = `drop-shadow-ribbons-${uuidv1().slice(0, 6)}`
  const dropShadowGroupsId = `drop-shadow-groups-${uuidv1().slice(0, 6)}`

  const ribbonItemClass = `ribbon-item-${uuidv1().slice(0, 6)}`
  const chordGroupClass = `chord-group-${uuidv1().slice(0, 6)}`

  rootEl.classList.add(styles.chordChart)

  const width = rootEl.getBoundingClientRect().width / 2 - 20

  const r1 = Math.min(width, height) / 2 - 4
  const r0 = r1 - 20

  const chordGroupArc = arcD3<ChordGroup>().innerRadius(r0).outerRadius(r1)
  const svg = select(`#${rootElId}`)

  const charts = svg
    .selectAll("div")
    .data([leftChordItems, rightChordItems])
    .enter()
    .append("div")
    .style("display", "inline-block")
    .style("width", `${width}px`)
    .style("height", `${height + margin.top + margin.bottom}px`)
    .append("svg:svg")
    .attr("width", width)
    .attr("height", height + margin.top + margin.bottom)
    .append("svg:g")
    .attr("transform", `translate(${width / 2},${height / 2 + margin.top})`)

  const leftChart = charts.filter((...[, chartIndex]) => chartIndex === 0)
  const rightChart = charts.filter((...[, chartIndex]) => chartIndex === 1)

  const setLabel = ({
    chart,
    label,
  }: {
    chart: Selection<BaseType, ChordMatrix, BaseType, unknown>
    label: string
  }) =>
    chart
      .append("text")
      .text(label)
      .attr("transform", `translate(0,${(-1 * height) / 2 - 10})`)
      .attr("class", styles.chartTitle)
      .attr("text-anchor", "middle")

  setLabel({ chart: leftChart, label: leftChordLabel })
  setLabel({ chart: rightChart, label: rightChordLabel })

  addDropShadowFilter({
    charts,
    deviation: 2,
    name: dropShadowRibbonsId,
    slope: 0.4,
  })
  addDropShadowFilter({
    charts,
    deviation: 3,
    name: dropShadowGroupsId,
    slope: 0.5,
  })

  const colorDomain = scaleLinear()
    .domain(extent([0, groupItems.length - 1]) as [number, number])
    .range([0, 1])

  const heatmapColour = scaleLinear<string>()
    .domain(range(0, 1, 1.0 / colours.length))
    .range(colours)

  const fillGroupIndex = (chordGroupIndex: number) =>
    heatmapColour(colorDomain(chordGroupIndex))

  charts.each(function (...[numberMatrix, chartIndex]) {
    const svgComp = select(this)

    const chordData = chord()
      .sortGroups(descending)
      .sortSubgroups(descending)
      .sortChords(descending)(numberMatrix)

    const ribbonPath = ribbonD3<Chord, Chord>().radius(r0)

    svgComp
      .selectAll(`path.${styles.chord}`)
      .data(chordData)
      .enter()
      .append("path")
      .attr("d", ribbonPath)
      .attr("class", `${styles.chord} ${ribbonItemClass}`)
      .style("fill", (chordItem) => fillGroupIndex(chordItem.target.index))
      .style("filter", `url(#${dropShadowRibbonsId})`)
      .style("stroke", (ribbonItem) => {
        const originalColor = fillGroupIndex(ribbonItem.target.index)
        const newColor = rgb(originalColor).darker()

        return newColor.formatHex()
      })
      .style("stroke-width", 2)
      .attr("title", (ribbonItem) =>
        chartConfig.getRibbonTitle({
          sourceIndex: ribbonItem.source.index,
          sourceValue: ribbonItem.source.value,
          targetIndex: ribbonItem.target.index,
          targetValue: ribbonItem.source.value,
        })
      )

    const g = svgComp
      .selectAll(`g.${styles.group}`)
      .data(chordData.groups)
      .enter()
      .append("svg:g")
      .attr("class", styles.group)

    g.append("svg:path")
      .attr("d", chordGroupArc)
      .style("fill", (chordGroup) => fillGroupIndex(chordGroup.index))
      .attr("id", (chordGroup) => `group${chordGroup.index}-${chartIndex}`)
      .attr("class", chordGroupClass)
      .style("filter", () => `url(#${dropShadowGroupsId})`)
      .attr("title", (chordGroup) =>
        chartConfig.getGroupTitle({
          chartIndex,
          chordGroup,
        })
      )

    g.append("svg:text")
      .attr("x", 6)
      .attr("dy", 15)
      .filter((chordGroup) => chordGroup.value > 150)
      .append("svg:textPath")
      .attr(
        "xlink:href",
        (chordGroup) => `#group${chordGroup.index}-${chartIndex}`
      )
      .text((chordGroup) => groupItems[chordGroup.index].label)
      .attr("class", styles.headingTitle)

    $(`.${ribbonItemClass}`).tooltip({
      track: true,
    })

    $(`.${chordGroupClass}`).tooltip({
      track: true,
    })
  })
}
