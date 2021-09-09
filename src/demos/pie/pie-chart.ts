import {
  DefaultArcObject,
  PieArcDatum,
  Selection,
  arc as arcD3,
  easeBack,
  interpolate,
  pie as pieD3,
  scaleOrdinal,
  schemePastel2,
  select,
} from "d3"
import cloneDeep from "lodash/cloneDeep"
import { v1 as uuidv1 } from "uuid"

import * as styles from "./pie-chart.module.css"

const height = 300
const outerRadius = 100
const transitionDuration = 3000

const colorScale = scaleOrdinal(schemePastel2)
const easeFn = easeBack

export type ChartConfig<SliceData> = {
  getSliceTitle: (sliceData: SliceData) => string
  getSliceValue: (sliceData: SliceData) => number
  pieSlices: SliceData[]
  rootElId: string
  updateSliceValue: (o: { newValue: number; sliceData: SliceData }) => void
}

export const createChart = <SliceData>({
  getSliceTitle,
  getSliceValue,
  pieSlices,
  rootElId,
  updateSliceValue,
}: ChartConfig<SliceData>) => {
  type Slice = SliceData & {
    ea0?: PieArcDatum<Slice>
  }

  const sliceClass = `slice-${uuidv1().slice(0, 6)}`

  type SliceArc = PieArcDatum<Slice>

  const stashArcs = (arcItem: SliceArc) => {
    arcItem.data.ea0 = cloneDeep(arcItem)
  }

  const arc = arcD3<SliceArc>().outerRadius(outerRadius).innerRadius(0)

  type ArcDatum = Omit<
    DefaultArcObject & SliceArc,
    "innerRadius" | "outerRadius"
  >

  const textTransform = (arcData: ArcDatum): string => {
    const centroidD = {
      ...arcData,
      innerRadius: outerRadius / 2,
      outerRadius,
    }

    return `translate(${arc.centroid(centroidD)})`
  }

  const pie = pieD3<Slice>()
    .sort(null)
    .value((slice: Slice) => getSliceValue(slice))

  const arcTween = (finalSlice: SliceArc) => {
    const {
      data: { ea0: initialSlice },
    } = finalSlice
    const interpolateFn = interpolate(initialSlice, finalSlice)

    finalSlice.data.ea0 = interpolateFn(0)

    return (normalizedTime: number) => arc(interpolateFn(normalizedTime))!
  }

  type ChartPaths = Selection<SVGPathElement, SliceArc, SVGGElement, unknown>
  type ChartLabels = Selection<SVGTextElement, SliceArc, SVGGElement, unknown>

  class PieChart {
    private readonly slices: Slice[]
    private paths: ChartPaths | null
    private labels: ChartLabels | null

    public constructor() {
      this.slices = pieSlices

      this.paths = null
      this.labels = null

      this.render()
    }

    public update(newSliceValue: number) {
      const { labels, paths, slices } = this
      const sliceIndex = Math.floor(Math.random() * slices.length)

      updateSliceValue({
        newValue: newSliceValue,
        sliceData: slices[sliceIndex],
      })
      ;(paths as ChartPaths)
        .data(pie(slices))
        .transition()
        .duration(transitionDuration)
        .ease(easeFn)
        .attrTween("d", arcTween)
      ;(labels as ChartLabels)
        .data(pie(slices))
        .transition()
        .duration(transitionDuration)
        .ease(easeFn)
        .attr("transform", textTransform)
        .each(function (slice) {
          select(this).text(getSliceValue(slice.data))
        })
    }

    private render() {
      const { slices } = this
      const { width } = (
        document.getElementById(rootElId) as HTMLElement
      ).getBoundingClientRect()

      const svg = select(`#${rootElId}`)
        .append("svg:svg")
        .attr("height", height)
        .attr("width", width)
        .append("g")
        .attr("transform", `translate(${width / 2},${height / 2})`)

      const slicesEls = svg
        .selectAll(`.${sliceClass}`)
        .data(pie(slices))
        .enter()
        .append("g")
        .attr("class", sliceClass)
        .attr("title", (slice) => getSliceTitle(slice.data))

      $(`.${sliceClass}`).tooltip({
        track: true,
      })

      this.paths = slicesEls
        .append("path")
        .attr("d", arc)
        .attr("fill", (...[, sliceIndex]) => colorScale(sliceIndex.toString()))
        .each(stashArcs)

      this.labels = slicesEls
        .filter((slice: SliceArc) => slice.endAngle - slice.startAngle > 0.2)
        .append("text")
        .attr("dy", "0.35em")
        .attr("dx", "0.35em")
        .attr("class", styles.label)
        .attr("transform", textTransform)
        .text((slice) => getSliceValue(slice.data))
    }
  }

  return new PieChart()
}
