import {
  DefaultArcObject,
  PieArcDatum,
  arc as arcD3,
  easeBack,
  interpolate,
  pie as pieD3,
  scaleOrdinal,
  schemePastel2,
  select,
} from "d3"
import cloneDeep from "lodash/cloneDeep"

const fetchData = async () => {
  const data = await fetch(`${ROOT_PATH}data/d3js/pie/data.json`)
  const jsonData = await data.json()

  return jsonData
}

type Slice = {
  ea0?: SliceArc
  label: string
  val: number
}
type SliceArc = PieArcDatum<Slice>

const height = 300
const outerRadius = 100

const stashArcs = (d: SliceArc) => {
  d.data.ea0 = cloneDeep(d)
}

const arc = arcD3<SliceArc>().outerRadius(outerRadius).innerRadius(0)

type ArcDatum = Omit<DefaultArcObject & SliceArc, "outerRadius" | "innerRadius">

const textTransform = (d: ArcDatum): string => {
  const centroidD = {
    ...d,
    innerRadius: outerRadius / 2,
    outerRadius,
  }

  return `translate(${arc.centroid(centroidD)})`
}

const pie = pieD3<Slice>()
  .sort(null)
  .value((slice: Slice) => slice.val)

const color = scaleOrdinal(schemePastel2)
const easeFn = easeBack
const transitionDuration = 3000

const arcTween = (finalSlice: SliceArc) => {
  const initialSlice = finalSlice.data.ea0
  const interpolateFn = interpolate(initialSlice, finalSlice)

  finalSlice.data.ea0 = interpolateFn(0)

  return (normalizedTime: number) => arc(interpolateFn(normalizedTime))!
}

type PieChartOpts = {
  data: Slice[]
  rootElId: string
}

type ChartPaths = d3.Selection<SVGPathElement, SliceArc, SVGGElement, unknown>
type ChartLabels = d3.Selection<SVGTextElement, SliceArc, SVGGElement, unknown>

class PieChart {
  private rootElId: string
  private data: Slice[]
  private paths: ChartPaths | null
  private labels: ChartLabels | null

  public constructor({ data, rootElId }: PieChartOpts) {
    this.data = data
    this.rootElId = rootElId

    this.paths = null
    this.labels = null

    this.render()
  }

  public update(val: number) {
    const { data, paths, labels } = this
    const index = Math.floor(Math.random() * data.length)

    data[index].val = val
    ;(paths as ChartPaths)
      .data(pie(data))
      .transition()
      .duration(transitionDuration)
      .ease(easeFn)
      .attrTween("d", arcTween)
    ;(labels as ChartLabels)
      .data(pie(data))
      .transition()
      .duration(transitionDuration)
      .ease(easeFn)
      .attr("transform", textTransform)
      .each(function (d: { data: Slice }) {
        const el: SVGTextElement = this

        select(el).text(d.data.val)
      })
  }

  private render() {
    const { rootElId, data } = this
    const { width } = (document.getElementById(
      rootElId
    ) as HTMLElement).getBoundingClientRect()

    const svg = select(`#${rootElId}`)
      .append("svg:svg")
      .attr("height", height)
      .attr("width", width)
      .append("g")
      .attr("transform", `translate(${width / 2},${height / 2})`)

    const slices = svg
      .selectAll(".slice")
      .data(pie(data))
      .enter()
      .append("g")
      .attr("class", "slice")

    this.paths = slices
      .append("path")
      .attr("d", arc)
      .attr("fill", (_d, i) => color(i.toString()))
      .each(stashArcs)

    this.labels = slices
      .filter((slice: SliceArc) => slice.endAngle - slice.startAngle > 0.2)
      .append("text")
      .attr("text-anchor", "middle")
      .attr("dy", ".35em")
      .attr("transform", textTransform)
      .style("fill", "black")
      .style("font", "bold 12px Arial")
      .text((d) => d.data.val)

    slices.append("title").text((d) => d.data.label)
  }
}

const main = async () => {
  const data = await fetchData()

  const chart = new PieChart({
    data,
    rootElId: "chart",
  })

  ;(document.getElementById("change-data") as HTMLElement).addEventListener(
    "click",
    () => {
      const randomVal = Math.floor(Math.random() * 44) + 2

      chart.update(randomVal)
    }
  )
}

export default main
