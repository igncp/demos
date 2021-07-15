import {
  Selection,
  axisBottom,
  axisLeft,
  extent,
  max,
  range,
  scaleLinear,
  select,
} from "d3"

type Data = number[]

const height = 500
const margin = { left: 160, top: 100 }
const floor = height - margin.top * 2

const barWidth = 30
const barHeight = 7

const colours = ["#323247", "#7C7CC9", "#72B66C", "#429742"]
const barYFn = (d: Data[number]) => floor - barHeight * d
const barHeightFn = (d: Data[number]) => d * barHeight

const fetchData = async (): Promise<Data> => {
  const rawData = await fetch(`${ROOT_PATH}data/d3js/bars/data.json`)
  const data = await rawData.json()

  return data
}

type BarsChartOpts = {
  data: Data
  rootElId: string
}

type Interval = ReturnType<typeof setInterval>
type Chart = Selection<SVGGElement, unknown, HTMLElement, unknown>
type ColorFn = (c: Data[number]) => string

class BarsChart {
  private data: Data
  private rootElId: string
  private interval: Interval | null
  private chart: Chart | null
  private color: ColorFn | null

  public constructor({ data, rootElId }: BarsChartOpts) {
    this.data = data
    this.rootElId = rootElId

    this.interval = null
    this.chart = null
    this.color = null
  }

  public render() {
    const { data, rootElId } = this
    const { width } = (document.getElementById(
      rootElId
    ) as HTMLElement).getBoundingClientRect()

    const c = scaleLinear()
      .domain(extent(data) as [number, number])
      .range([0, 1])
    const heatmapColour: ColorFn = scaleLinear()
      .domain(range(0, 1, 1.0 / colours.length))
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .range(colours as any) as any

    const color = (d: Data[number]) => heatmapColour(c(d))

    this.color = color as ColorFn

    const svg = select(`#${rootElId}`).append("svg")

    svg.attr("height", height).attr("width", width).attr("class", "bars-chart")

    const chart = svg.append("g")

    this.chart = chart

    chart.attr("transform", `translate(${margin.left},${margin.top})`)

    this.interval = setInterval(this.getIntervalFn(), 1000)

    const x = scaleLinear()
      .domain([0.5, data.length + 0.5])
      .range([1, barWidth * data.length])

    const y = scaleLinear()
      .domain([0, max(data) as number])
      .rangeRound([0, -1 * barHeight * (max(data) as number)])

    const xAxisG = chart.append("g")

    xAxisG
      .attr("class", "x-axis axis")
      .attr("transform", `translate(0,${floor})`)
      .call(axisBottom(x))

    xAxisG
      .append("text")
      .attr("transform", `translate(${(barWidth * data.length) / 2} ,0)`)
      .attr("class", "x-axis-label")
      .attr("y", 40)
      .attr("font-size", "1.3em")
      .attr("fill", "black")
      .style("text-anchor", "end")
      .text("Number")

    const yAxisG = chart.append("g")

    yAxisG
      .attr("class", "x-axis axis")
      .attr("transform", `translate(0,${floor})`)
      .call(axisLeft(y))

    yAxisG
      .append("text")
      .attr("transform", `translate(-30,${String((-1 * (height - 60)) / 2)})`)
      .attr("y", 40)
      .attr("font-size", "1.3em")
      .attr("fill", "black")
      .style("text-anchor", "end")
      .text("Value")

    this.drawRectangles()
  }

  public refresh() {
    this.drawRectangles()
    this.redraw()
  }

  private clearInterval() {
    if (this.interval) {
      clearInterval(this.interval)
    }
  }

  private drawRectangles() {
    const { data, chart, color } = this

    ;(chart as Chart)
      .selectAll("rect")
      .data(data)
      .enter()
      .append("rect")
      .attr("x", (_d: unknown, i: number) => barWidth * i)
      .attr("y", barYFn)
      .attr("width", barWidth)
      .attr("height", barHeightFn)
      .attr("fill", (d: Data[number]) => (color as ColorFn)(d))
      .on("mouseover", () => {
        this.clearInterval()
      })
      .on("mouseleave", () => {
        this.clearInterval()
        this.interval = setInterval(this.getIntervalFn(), 1000)
      })
      .append("title")
      .text((d: Data[number]) => d)
  }

  private getIntervalFn() {
    return () => {
      const { data } = this

      data.unshift(data.pop() as Data[0])
      this.redraw()
    }
  }

  private redraw() {
    const { data, chart, color } = this

    if (!chart) {
      return
    }

    const newX = scaleLinear()
      .domain([0.5, data.length + 0.5])
      .range([1, barWidth * data.length])

    chart
      .select(".x-axis")
      .transition()
      .duration(500)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .call(axisBottom(newX) as any)

    chart
      .select(".x-axis-label")
      .transition()
      .duration(500)
      .attr("transform", `translate(${(barWidth * data.length) / 2} ,0)`)

    chart
      .selectAll("rect")
      .data(data)
      .transition()
      .duration(500)
      .attr("y", barYFn)
      .attr("height", barHeightFn)
      .attr("fill", color as ColorFn)
      .select("title")
      .text((d: Data[number]) => d)
  }
}

const main = async () => {
  const data = await fetchData()

  const barsChart = new BarsChart({
    data,
    rootElId: "chart",
  })

  barsChart.render()

  const addItemEl = document.getElementById("add-item") as HTMLElement

  addItemEl.addEventListener("click", () => {
    if (data.length < 20) {
      data.push(Math.floor(Math.random() * (max(data) as number)) + 1)
      barsChart.refresh()
    } else {
      addItemEl.setAttribute("disabled", "disabled")
    }
  })
}

export default main
