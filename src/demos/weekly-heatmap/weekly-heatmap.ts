import * as d3 from "d3"
import d3utils from "@/demos/_utils/d3nextutils"

type DataItem = {
  day: number
  hour: number
  value: number
}

const buckets = 9
const colors = [
  "#ffffd9",
  "#edf8b1",
  "#c7e9b4",
  "#7fcdbb",
  "#41b6c4",
  "#1d91c0",
  "#225ea8",
  "#253494",
  "#081d58",
]

const days = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"]
const times = [
  "1 am",
  "2 am",
  "3 am",
  "4 am",
  "5 am",
  "6 am",
  "7 am",
  "8 am",
  "9 am",
  "10 am",
  "11 am",
  "12 am",
  "1 pm",
  "2 pm",
  "3 pm",
  "4 pm",
  "5 pm",
  "6 pm",
  "7 pm",
  "8 pm",
  "9 pm",
  "10 pm",
  "11 pm",
  "12 pm",
]

const fetchData = async (): Promise<DataItem[]> => {
  const values = function (d: DataItem) {
    return {
      day: +d.day,
      hour: +d.hour,
      value: +d.value,
    }
  }

  const data: any = await d3.tsv(
    `${ROOT_PATH}data/d3js/weekly-heatmap/data.tsv`
  )

  return data.map(values)
}

const margin = {
  bottom: 100,
  left: 50,
  right: 50,
  top: 50,
}

const renderChart = async ({
  data,
  rootElId,
}: {
  data: DataItem[]
  rootElId: string
}) => {
  const width =
    (document.getElementById(rootElId) as HTMLElement).getBoundingClientRect()
      .width -
    margin.left -
    margin.right
  const height = Math.ceil((width * 10) / 24) - margin.top - margin.bottom + 60
  const gridSize = Math.floor(width / 24)
  const legendElementWidth = gridSize * 2

  const max = d3.max(data, (d) => d.value)

  const colorScale = d3
    .scaleQuantile<string>()
    .domain([0, buckets - 1, max])
    .range(colors)

  const svg = d3
    .select(`#${rootElId}`)
    .append("svg")
    .attr("height", height + margin.top + margin.bottom)
    .attr("width", width + margin.left + margin.right)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`)

  svg
    .selectAll(".dayLabel")
    .data(days)
    .enter()
    .append("text")
    .text((d) => d)
    .attr("class", (_d, i) => {
      if (i >= 0 && i <= 4) {
        return "dayLabel mono axis axis-workweek"
      }

      return "dayLabel mono axis"
    })
    .attr("transform", `translate(-6,${gridSize / 1.5})`)
    .attr("x", 0)
    .attr("y", (_d, i) => i * gridSize)
    .style("text-anchor", "end")

  svg
    .selectAll(".timeLabel")
    .data(times)
    .enter()
    .append("text")
    .text((d) => d)
    .attr("class", (_d, i) => {
      if (i >= 7 && i <= 16) {
        return "timeLabel mono axis axis-worktime"
      }

      return "timeLabel mono axis"
    })
    .attr("transform", `translate(${gridSize / 2}, -6)`)
    .attr("x", (_d, i) => i * gridSize)
    .attr("y", 0)
    .style("text-anchor", "middle")

  const heatMap = svg
    .selectAll(".hour")
    .data(data)
    .enter()
    .append("rect")
    .attr("class", "hour bordered")
    .attr("height", gridSize)
    .attr("rx", 4)
    .attr("ry", 4)
    .attr("width", gridSize)
    .attr("x", (d) => (d.hour - 1) * gridSize)
    .attr("y", (d) => (d.day - 1) * gridSize)
    .style("fill", colors[0])

  heatMap
    .transition()
    .duration(6000)
    .style("fill", (d) => colorScale(d.value))

  heatMap.attr("data-title", (d) => `Value: ${d.value}`)

  d3utils.tooltip(".hour", {
    tOpts: {
      delay: {
        hide: 0,
        show: 500,
      },
    },
  })

  const legend = svg
    .selectAll(".legend")
    .data<any>([0].concat(colorScale.quantiles()), (d) => d)
    .enter()
    .append("g")
    .attr("class", "legend")

  legend
    .append("rect")
    .attr("x", (_d, i) => legendElementWidth * i)
    .attr("y", height)
    .attr("width", legendElementWidth)
    .attr("height", gridSize / 2)
    .style("fill", (_d, i) => colors[i])
    .style("stroke", "#CCC")

  legend
    .append("text")
    .attr("class", "mono")
    .text((d) => `≥ ${d.toFixed(2)}`)
    .attr("x", (_d, i) => legendElementWidth * i)
    .attr("y", height + gridSize)
}

const main = async () => {
  const data = await fetchData()

  renderChart({ data, rootElId: "chart" })
}

export default main
