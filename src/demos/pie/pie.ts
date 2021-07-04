import cloneDeep from "lodash/cloneDeep"
import * as d3 from "d3"

const fetchData = async () => {
  const data = await fetch(`${ROOT_PATH}data/d3js/pie/data.json`)
  const jsonData = await data.json()

  return jsonData
}

type Data = Array<{
  ea0?: d3.PieArcDatum<Data[0]>
  label: string
  val: number
}>

const height = 300
const outerRadius = 100

const stashArcs = (d: d3.PieArcDatum<Data[9]>) => {
  d.data.ea0 = cloneDeep(d)
}

const arc = d3.arc().outerRadius(outerRadius).innerRadius(0)

type ArcDatum = Omit<
  d3.DefaultArcObject & d3.PieArcDatum<Data[0]>,
  "outerRadius" | "innerRadius"
>

const textTransform = (d: ArcDatum): string => {
  const centroidD = {
    ...d,
    innerRadius: outerRadius / 2,
    outerRadius,
  }

  return `translate(${arc.centroid(centroidD)})`
}

const pie = d3
  .pie<Data[0]>()
  .sort(null)
  .value((d: Data[0]) => d.val)

const color = d3.scaleOrdinal(d3.schemePastel2)

const arcTween: any = (d: d3.PieArcDatum<Data[0]>) => {
  const interpolateFn = d3.interpolate(d.data.ea0, d)

  d.data.ea0 = interpolateFn(0)

  return (normalizedTime: number) => arc(interpolateFn(normalizedTime) as any)
}

type PieChartOpts = {
  data: Data
  rootElId: string
}

type ChartPaths = d3.Selection<
  SVGPathElement,
  d3.PieArcDatum<Data[0]>,
  SVGGElement,
  unknown
>
type ChartLabels = d3.Selection<
  SVGTextElement,
  d3.PieArcDatum<Data[0]>,
  SVGGElement,
  unknown
>

class PieChart {
  private rootElId: string
  private data: Data
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
      .duration(1000)
      .attrTween("d", arcTween)
    ;(labels as ChartLabels)
      .data(pie(data))
      .transition()
      .duration(1000)
      .attr("transform", textTransform)
      .each(function (d: { data: Data[0] }) {
        const el: SVGTextElement = this

        d3.select(el).text(d.data.val)
      })
  }

  private render() {
    const { rootElId, data } = this
    const { width } = (document.getElementById(
      rootElId
    ) as HTMLElement).getBoundingClientRect()

    const svg = d3
      .select(`#${rootElId}`)
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
      .attr("d", arc as any)
      .attr("fill", (_d, i) => color(i.toString()))
      .each(stashArcs)

    this.labels = slices
      .filter((d) => d.endAngle - d.startAngle > 0.2)
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
