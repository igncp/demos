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

type SliceRaw = {
  label: string
  val: number // eslint-disable-line id-denylist
}

type Slice = {
  arbitraryValue: number
  ea0?: PieArcDatum<Slice>
  label: string
}

const fetchData = async (): Promise<Slice[]> => {
  const pieRawData = await fetch(`${ROOT_PATH}data/d3js/pie/data.json`)
  const pieJsonData = (await pieRawData.json()) as SliceRaw[]

  return pieJsonData.map((sliceData) => ({
    ...sliceData,
    arbitraryValue: sliceData.val,
  }))
}

type SliceArc = PieArcDatum<Slice>

const height = 300
const outerRadius = 100

const stashArcs = (arcItem: SliceArc) => {
  arcItem.data.ea0 = cloneDeep(arcItem)
}

const arc = arcD3<SliceArc>().outerRadius(outerRadius).innerRadius(0)

type ArcDatum = Omit<DefaultArcObject & SliceArc, "innerRadius" | "outerRadius">

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
  .value((slice: Slice) => slice.arbitraryValue)

const colorScale = scaleOrdinal(schemePastel2)
const easeFn = easeBack
const transitionDuration = 3000

const arcTween = (finalSlice: SliceArc) => {
  const {
    data: { ea0: initialSlice },
  } = finalSlice
  const interpolateFn = interpolate(initialSlice, finalSlice)

  finalSlice.data.ea0 = interpolateFn(0)

  return (normalizedTime: number) => arc(interpolateFn(normalizedTime))!
}

type PieChartOpts = {
  pieSlices: Slice[]
  rootElId: string
}

type ChartPaths = Selection<SVGPathElement, SliceArc, SVGGElement, unknown>
type ChartLabels = Selection<SVGTextElement, SliceArc, SVGGElement, unknown>

class PieChart {
  private readonly rootElId: string
  private readonly slices: Slice[]
  private paths: ChartPaths | null
  private labels: ChartLabels | null

  public constructor({ pieSlices, rootElId }: PieChartOpts) {
    this.slices = pieSlices
    this.rootElId = rootElId

    this.paths = null
    this.labels = null

    this.render()
  }

  public update(newSliceValue: number) {
    const { labels, paths, slices } = this
    const sliceIndex = Math.floor(Math.random() * slices.length)

    slices[sliceIndex].arbitraryValue = newSliceValue
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
        select(this).text(slice.data.arbitraryValue)
      })
  }

  private render() {
    const { rootElId, slices } = this
    const { width } = (document.getElementById(
      rootElId
    ) as HTMLElement).getBoundingClientRect()

    const svg = select(`#${rootElId}`)
      .append("svg:svg")
      .attr("height", height)
      .attr("width", width)
      .append("g")
      .attr("transform", `translate(${width / 2},${height / 2})`)

    const slicesEls = svg
      .selectAll(".slice")
      .data(pie(slices))
      .enter()
      .append("g")
      .attr("class", "slice")

    this.paths = slicesEls
      .append("path")
      .attr("d", arc)
      .attr("fill", (...[, sliceIndex]) => colorScale(sliceIndex.toString()))
      .each(stashArcs)

    this.labels = slicesEls
      .filter((slice: SliceArc) => slice.endAngle - slice.startAngle > 0.2)
      .append("text")
      .attr("text-anchor", "middle")
      .attr("dy", ".35em")
      .attr("transform", textTransform)
      .style("fill", "black")
      .style("font", "bold 12px Arial")
      .text((slice) => slice.data.arbitraryValue)

    slicesEls
      .append("title")
      .text((slice) => `${slice.data.label}: ${slice.data.arbitraryValue}`)
  }
}

const main = async () => {
  const pieJsonData = await fetchData()

  const chart = new PieChart({
    pieSlices: pieJsonData,
    rootElId: "chart",
  })

  ;(document.getElementById("change-data") as HTMLElement).addEventListener(
    "click",
    () => {
      const newSliceValue = Math.floor(Math.random() * 44) + 2

      chart.update(newSliceValue)
    }
  )
}

export default main
