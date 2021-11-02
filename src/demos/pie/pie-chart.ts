import {
  Arc,
  DefaultArcObject,
  Pie,
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

const renderShadowFilter = <T>(
  svg: Selection<SVGGElement, T, HTMLElement, unknown>
) =>
  svg.append("g").html(`
    <filter height="300%"width="300%"x="-100%"y="-100%" filterUnits="userSpaceOnUse" id="shadow-filter">
      <feGaussianBlur in="SourceAlpha" result="blur" stdDeviation="4" />
      <feOffset dx="4" dy="4" in="blur" result="offsetBlur" />
      <feSpecularLighting
        in="blur"
        lightingColor="#bbbbbb"
        result="specOut"
        specularConstant=".75"
        specularExponent="50"
        surfaceScale="5"
      >
        <fePointLight x="-5000" y="-10000" z="20000" />
      </feSpecularLighting>
      <feComposite
        in="specOut"
        in2="SourceAlpha"
        operator="in"
        result="specOut"
      />
      <feComposite
        in="SourceGraphic"
        in2="specOut"
        k1="0"
        k2="1"
        k3="1"
        k4="0"
        operator="arithmetic"
        result="litPaint"
      />
      <feMerge>
        <feMergeNode in="offsetBlur" />
        <feMergeNode in="litPaint" />
      </feMerge>
    </filter>
  `)

const renderBlurFilter = <T>(
  svg: Selection<SVGGElement, T, HTMLElement, unknown>
) => {
  svg
    .append("g")
    .append("filter")
    .attr("height", "300%")
    .attr("x", "-100%")
    .attr("y", "-100%")
    .attr("id", "blur")
    .attr("width", "300%")
    .append("feGaussianBlur")
    .attr("stdDeviation", "1 1")
}

type ChartConfig<SliceData> = {
  getSliceTitle: (sliceData: SliceData) => string
  getSliceValue: (sliceData: SliceData) => number
  pieSlices: SliceData[]
  rootElId: string
  updateSliceValue: (sliceInfo: {
    newValue: number
    sliceData: SliceData
  }) => void
}

type Slice<SliceData> = SliceData & {
  ea0?: PieArcDatum<Slice<SliceData>>
}

type SliceArc<SliceData> = PieArcDatum<Slice<SliceData>>

type ArcDatum<SliceData> = Omit<
  DefaultArcObject & SliceArc<SliceData>,
  "innerRadius" | "outerRadius"
>

type ChartElements = Readonly<{
  gSel: Selection<SVGGElement, unknown, HTMLElement, unknown>
  svgSel: Selection<SVGSVGElement, unknown, HTMLElement, unknown>
}>

class PieChart<SliceData> {
  private readonly slices: Array<Slice<SliceData>>
  private readonly config: ChartConfig<SliceData>
  private readonly sliceClass: string

  private readonly arc: Arc<any, SliceArc<SliceData>> // eslint-disable-line @typescript-eslint/no-explicit-any
  private readonly pie: Pie<any, Slice<SliceData>> // eslint-disable-line @typescript-eslint/no-explicit-any

  private readonly elements: ChartElements

  public constructor(config: ChartConfig<SliceData>) {
    this.config = config
    this.slices = config.pieSlices
    this.sliceClass = `slice-${uuidv1().slice(0, 6)}`

    this.arc = arcD3<SliceArc<SliceData>>()
      .outerRadius(outerRadius)
      .innerRadius(0)

    this.pie = pieD3<Slice<SliceData>>()
      .sort(null)
      .value((slice: Slice<SliceData>) => config.getSliceValue(slice))

    const svgSel = select<HTMLDivElement, unknown>(
      `#${config.rootElId}`
    ).append("svg")
    const gSel = svgSel.append("g")

    renderShadowFilter(gSel)
    renderBlurFilter(gSel)

    this.elements = {
      gSel,
      svgSel,
    }

    this.render()

    window.addEventListener("resize", this.handleResize)
  }

  private static stashArcs<SliceData>(arcItem: SliceArc<SliceData>) {
    arcItem.data.ea0 = cloneDeep(arcItem)
  }

  public teardown() {
    window.removeEventListener("resize", this.handleResize)
  }

  public update({
    newValue,
    newValueIndex,
  }: {
    newValue: number
    newValueIndex: number
  }) {
    const {
      config,
      elements: { gSel },
      slices,
    } = this

    config.updateSliceValue({
      newValue,
      sliceData: slices[newValueIndex],
    })

    const paths = gSel.selectAll<SVGPathElement, Slice<SliceData>>(
      `.slice-path`
    )
    const labels = gSel.selectAll<SVGTextElement, Slice<SliceData>>(
      `.${styles.label}`
    )

    paths
      .data(this.pie(slices))
      .transition()
      .duration(transitionDuration)
      .ease(easeFn)
      .attrTween("d", this.arcTween.bind(this))

    const labelsUpdate = labels.data(this.pie(slices))

    labelsUpdate
      .transition("transitionWithEase")
      .duration(transitionDuration)
      .ease(easeFn)
      .attrTween("transform", this.textTransformTween.bind(this))
      .style("opacity", (slice) => {
        const sliceAngle = Math.abs(slice.startAngle - slice.endAngle)

        return sliceAngle < 0.4 ? 0 : 1
      })

    labelsUpdate
      .transition("textTransition")
      .duration(transitionDuration)
      .tween("text", function tweenText(slice) {
        const currentText = Number(select(this).text())
        const newText = Number(config.getSliceValue(slice.data))

        if (currentText === newText) {
          return () => newText
        }

        const interpolateFn = interpolate(currentText, newText)

        return (time: number) => {
          this.textContent = interpolateFn(time).toFixed(0).toString()
        }
      })
  }

  private readonly handleResize = () => {
    this.render()
  }

  private render() {
    const {
      config,
      elements: { gSel, svgSel },
      slices,
    } = this
    const { width } = (
      document.getElementById(config.rootElId) as HTMLElement
    ).getBoundingClientRect()

    svgSel.attr("height", height).attr("width", width)

    gSel
      .attr("transform", `translate(${width / 2},${height / 2})`)
      .style("filter", `url(#shadow-filter`)

    const slicesEls = gSel
      .selectAll(`.${this.sliceClass}`)
      .data(this.pie(slices))
      .enter()
      .append("g")
      .attr("class", this.sliceClass)
      .attr("title", (slice) => this.config.getSliceTitle(slice.data))
      .on("mouseenter", function handleMouseEnter() {
        slicesEls.style("filter", `url(#blur)`)
        select(this).style("filter", "none")
      })
      .on("mouseleave", () => {
        slicesEls.style("filter", null)
      })

    $(`.${this.sliceClass}`).tooltip({
      track: true,
    })

    slicesEls
      .append("path")
      .attr("d", this.arc)
      .attr("fill", (...[, sliceIndex]) => colorScale(sliceIndex.toString()))
      .attr("class", "slice-path")
      .attr("stroke", "#777")
      .each((slice) => PieChart.stashArcs<SliceData>(slice))

    slicesEls
      .filter(
        (slice: SliceArc<SliceData>) => slice.endAngle - slice.startAngle > 0.2
      )
      .append("text")
      .attr("dy", "0.35em")
      .attr("dx", "0.35em")
      .attr("class", styles.label)
      .attr("transform", this.textTransform.bind(this))
      .text((slice) => this.config.getSliceValue(slice.data))
  }

  private textTransform(arcData: ArcDatum<SliceData>): string {
    const centroidD = {
      ...arcData,
      innerRadius: outerRadius / 2,
      outerRadius,
    }

    return `translate(${this.arc.centroid(centroidD)})`
  }

  private textTransformTween(finalSlice: SliceArc<SliceData>) {
    const {
      data: { ea0: initialSlice },
    } = finalSlice
    const interpolateFn = interpolate(initialSlice, finalSlice)

    return (time: number) => {
      const arcData = interpolateFn(time)

      return this.textTransform(arcData)
    }
  }

  private arcTween(finalSlice: SliceArc<SliceData>) {
    const {
      data: { ea0: initialSlice },
    } = finalSlice
    const interpolateFn = interpolate(initialSlice, finalSlice)

    finalSlice.data.ea0 = interpolateFn(0)

    return (normalizedTime: number) => this.arc(interpolateFn(normalizedTime))!
  }
}

const createChart = <SliceData>(config: ChartConfig<SliceData>) =>
  new PieChart(config)

export { ChartConfig, createChart }
