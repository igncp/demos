import {
  Selection,
  csv,
  extent,
  max,
  range,
  scaleLinear,
  scalePow,
  select,
} from "d3"

const CONTAINER_ID = "chart"

type NamesMetric = {
  count: string
  name: string
  sex: string
  year: string
}
type NamesMetrics = NamesMetric[]
type SVG = Selection<SVGGElement, unknown, HTMLElement, unknown>

const fetchData = async (): Promise<NamesMetrics> => {
  const response = await csv(
    `${ROOT_PATH}data/d3js/concentric-circles/data.csv`
  )

  return (response as unknown) as NamesMetrics
}

const colours = ["#7C7CC9", "#52D552", "#337233", "#323247"]

const margin = {
  bottom: 20,
  left: 20,
  right: 20,
  top: 20,
}
const strokeWidth = "2px"

const addFilter = (svg: SVG) => {
  const defs = svg.append("defs")
  const filter = defs.append("filter")

  filter.attr("id", "drop-shadow")
  filter
    .append("feGaussianBlur")
    .attr("in", "SourceAlpha")
    .attr("stdDeviation", 9)
  filter.append("feOffset").attr("dx", 5).attr("dy", 5)
  filter
    .append("feComponentTransfer")
    .append("feFuncA")
    .attr("slope", ".3")
    .attr("type", "linear")

  const feMerge = filter.append("feMerge")

  feMerge.append("feMergeNode")
  feMerge.append("feMergeNode").attr("in", "SourceGraphic")
}

type AddDescription = (o: { height: number; svg: SVG; width: number }) => void

const addDescription: AddDescription = ({ height, svg, width }) => {
  svg
    .append("text")
    .text(
      "Circles radius are proportional to the count of times the name appears"
    )
    .attr("transform", `translate(${width / 2},${height - 10})`)
    .attr("width", "20px")
}

type RenderChart = (o: { namesMetrics: NamesMetrics; rootElId: string }) => void

const renderChart: RenderChart = ({ namesMetrics, rootElId }) => {
  const c = scaleLinear()
    .domain(
      extent(namesMetrics, (namesMetric) => +namesMetric.count) as [
        number,
        number
      ]
    )
    .range([0, 1])

  const heatmapColour = scaleLinear<string>()
    .domain(range(0, 1, 1.0 / colours.length))
    .range(colours)

  const colorize = (namesMetric: NamesMetric) => {
    const colorNormalized = c(+namesMetric.count)

    return heatmapColour(colorNormalized)
  }

  const rootEl = document.getElementById(rootElId) as HTMLElement
  const { width: elWidth } = rootEl.getBoundingClientRect()

  const width = elWidth - margin.left - margin.right
  const height =
    (max(namesMetrics, (namesMetric) => +namesMetric.count) as number) * 2.5

  const svg: SVG = select(`#${rootElId}`)
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.left + margin.right)
    .append("g")

  addFilter(svg)

  const circleGroup = svg
    .selectAll<SVGGElement, NamesMetric>("g")
    .data(namesMetrics, (namesMetric: NamesMetric) => namesMetric.name)
    .enter()
    .append("g")

  const circles = circleGroup.append<SVGCircleElement>("svg:circle")
  const rScale = scalePow()
    .exponent(0.9)
    .range([5, 300])
    .domain(
      extent(namesMetrics, (namesMetric) => +namesMetric.count) as [
        number,
        number
      ]
    )

  const getTitle = (namesMetric: NamesMetrics[number]) =>
    `${namesMetric.name}: ${namesMetric.count}`
  const dataMax = max(
    namesMetrics,
    (namesMetric) => +namesMetric.count
  ) as number

  circles
    .attr("cx", width / 2)
    .attr("cy", height / 2)
    .attr("r", (namesMetric) => rScale(+namesMetric.count))
    .attr("class", "name-circle")
    .attr("title", getTitle)
    .style("fill", "#fff")
    .style("stroke", (namesMetric) => colorize(namesMetric))
    .style("stroke-width", strokeWidth)
    .style("filter", (namesMetric) => {
      if (+namesMetric.count > dataMax / 2.5) {
        return "url(#drop-shadow)"
      }

      return ""
    })
    .on("mouseover", function () {
      select(this).style("stroke", "#D88021").style("stroke-width", "10px")
    })
    .on("mouseleave", function () {
      select<SVGCircleElement, NamesMetric>(this)
        .style("stroke", (namesMetric) => colorize(namesMetric))
        .style("stroke-width", strokeWidth)
    })

  $(".name-circle").tooltip({
    track: true,
  })

  addDescription({
    height,
    svg,
    width,
  })
}

const main = async () => {
  const namesMetrics = await fetchData()

  renderChart({
    namesMetrics,
    rootElId: CONTAINER_ID,
  })
}

export { CONTAINER_ID }

export default main
