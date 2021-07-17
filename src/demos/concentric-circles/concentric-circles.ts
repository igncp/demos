import * as d3 from "d3"
import merge from "lodash/merge"

type Data = Array<{
  count: string
  name: string
  sex: string
  year: string
}>
type SVG = d3.Selection<SVGGElement, unknown, HTMLElement, unknown>

// @TODO; use d3utils
// requires jquery and jquery ui
const tooltip = (
  selector: string,
  customOpts: Partial<{
    elementSelector: string
    followElement: boolean
    followMouse: boolean
    leftOffst: number
    tOpts: {
      container: string
      viewport: {
        selector: string
      }
    }
    topOffst: number
  }>,
  rootElId: string
) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { $ } = window as any

  if (customOpts == null) {
    customOpts = {}
  }

  const defaultOpts = {
    elementSelector: "",
    followElement: false,
    followMouse: false,
    leftOffst: 60,
    tOpts: {
      container: "body",
      viewport: {
        selector: `#${rootElId} svg`,
      },
    },
    topOffst: 40,
  }

  const opts = merge(defaultOpts, customOpts)

  $(selector).tooltip(opts.tOpts)

  if (opts.followMouse) {
    $(selector).hover((e: MouseEvent) =>
      $(".tooltip").css({
        left: `${String(e.pageX - opts.leftOffst)}px`,
        top: `${String(e.pageY - opts.topOffst)}px`,
      })
    )
  } else if (opts.followElement) {
    $(selector).hover(() =>
      $(".tooltip").css({
        left: `${String(
          $(opts.elementSelector).position().left - opts.leftOffst
        )}px`,
        top: `${String(
          $(opts.elementSelector).position().top - opts.topOffst
        )}px`,
      })
    )
  }
}

const fetchData = async (): Promise<Data> => {
  const data = await d3.csv(`${ROOT_PATH}data/d3js/concentric-circles/data.csv`)

  return (data as unknown) as Data
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

type AddDescription = (o: { svg: SVG; height: number; width: number }) => void

const addDescription: AddDescription = ({ svg, height, width }) => {
  svg
    .append("text")
    .text(
      "Circles radius are proportional to the count of times the name appears"
    )
    .attr("transform", `translate(${width / 2},${height - 10})`)
    .attr("width", "20px")
}

type RenderChart = (o: { data: Data; rootElId: string }) => void

const renderChart: RenderChart = ({ data, rootElId }) => {
  const c = d3
    .scaleLinear()
    .domain(d3.extent(data, (d) => +d.count) as [number, number])
    .range([0, 1])

  const heatmapColour = d3
    .scaleLinear()
    .domain(d3.range(0, 1, 1.0 / colours.length))
    .range(colours as any)

  const colorize = (d: Data[number]) => {
    const colorNormalized = c(+d.count)

    return heatmapColour(colorNormalized)
  }

  const rootEl = document.getElementById(rootElId) as HTMLElement
  const { width: elWidth } = rootEl.getBoundingClientRect()

  const width = elWidth - margin.left - margin.right
  const height = (d3.max(data, (d) => +d.count) as number) * 2.5

  const svg: SVG = d3
    .select(`#${rootElId}`)
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.left + margin.right)
    .append("g")

  addFilter(svg)

  const circleGroup = svg
    .selectAll("g")
    .data(data, (d: any) => (d as Data[number]).name)
    .enter()
    .append("g")

  const circles = circleGroup.append("svg:circle")
  const rScale = d3
    .scalePow()
    .exponent(0.9)
    .range([5, 300])
    .domain(d3.extent(data, (d) => +d.count) as [number, number])

  const getTitle = (d: Data[number]) => `${d.name}: ${d.count}`
  const dataMax = d3.max(data, (d) => +d.count) as number

  circles
    .attr("cx", width / 2)
    .attr("cy", height / 2)
    .attr("r", (d) => rScale(+d.count))
    .attr("class", "name-circle")
    .attr("data-title", getTitle)
    .style("fill", "#fff")
    .style("stroke", (d) => colorize(d))
    .style("stroke-width", strokeWidth)
    .style("filter", (d) => {
      if (+d.count > dataMax / 2.5) {
        return "url(#drop-shadow)"
      }

      return ""
    })
    .on("mouseover", function () {
      d3.select(this).style("stroke", "#D88021").style("stroke-width", "10px")
    })
    .on("mouseleave", function () {
      d3.select(this)
        .style("stroke", (d: any) => colorize(d))
        .style("stroke-width", strokeWidth)
    })

  circles.append("title").text(getTitle)

  tooltip(
    ".name-circle",
    {
      followMouse: true,
    },
    rootElId
  )

  addDescription({
    height,
    svg,
    width,
  })
}

const main = async () => {
  const data = await fetchData()

  renderChart({
    data,
    rootElId: "chart",
  })
}

export default main
