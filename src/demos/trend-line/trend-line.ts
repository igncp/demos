import {
  Line,
  axisBottom,
  axisLeft,
  extent,
  line as d3Line,
  max,
  min,
  range,
  scaleLinear,
  scaleQuantile,
  scaleTime,
  select,
  selectAll,
  timeParse,
  tsv,
} from "d3"

import "./trend-line.styl"

type InitialDataItem = {
  occurred: string
  value: string
}

type DataItem = {
  occurred: Date
  value: number
}

const fetchData = async (): Promise<DataItem[]> => {
  const result = (await tsv(
    `${ROOT_PATH}data/d3js/trend-line/data.tsv`
  )) as InitialDataItem[]

  const timeFormat = timeParse("%Y-%m-%d")

  const data = result.map((d) => ({
    occurred: timeFormat(d.occurred) as Date,
    value: +d.value,
  }))

  return data
}

const margin = {
  bottom: 50,
  left: 50,
  right: 50,
  top: 50,
}

const height = 500 - margin.top - margin.bottom

const animationTime = 2000

const getInterpolation = (data: DataItem[], line: Line<DataItem>) => {
  const interpolate = scaleQuantile()
    .domain([0, 1])
    .range(range(1, data.length + 1))

  return (t: number): any => {
    const interpolatedLine = data.slice(0, interpolate(t))

    return line(interpolatedLine)
  }
}

const linearRegression = (data: DataItem[]) => {
  const lr: { slope?: number; intercept?: number; r2?: number } = {}
  const n = data.length

  let sumX = 0
  let sumY = 0
  let sumXY = 0
  let sumXX = 0
  let sumYY = 0

  data.forEach((d) => {
    sumX += d.occurred.getTime()
    sumY += d.value
    sumXX += d.occurred.getTime() * d.occurred.getTime()
    sumYY += d.value * d.value
    sumXY += d.occurred.getTime() * d.value
  })
  lr.slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX)
  lr.intercept = (sumY - lr.slope * sumX) / n
  lr.r2 = Math.pow(
    (n * sumXY - sumX * sumY) /
      Math.sqrt((n * sumXX - sumX * sumX) * (n * sumYY - sumY * sumY)),
    2
  )

  return lr
}

const renderGraph = ({
  data,
  initialZoomed,
  rootElId,
}: {
  data: DataItem[]
  initialZoomed: boolean
  rootElId: string
}) => {
  const el = document.getElementById(rootElId) as HTMLElement

  el.classList.add("trend-line-chart")

  const width = el.getBoundingClientRect().width - margin.left - margin.right

  const renderContent = (isZoomed: boolean) => {
    const svg = select(`#${rootElId}`)
      .text("")
      .append("svg")
      .attr("height", height + margin.top + margin.bottom)
      .attr("width", width + margin.left + margin.right)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.right})`)

    const x = scaleTime().range([0, width])
    const y = scaleLinear().range([height, 0])
    const xAxis = axisBottom(x)
    const yAxis = axisLeft(y)

    const line = d3Line<DataItem>()
      .x((d) => x(d.occurred))
      .y((d) => y(d.value))

    x.domain(extent(data, (d) => d.occurred) as [Date, Date])
    y.domain([
      isZoomed ? (min(data, (d) => d.value) as number) : 0,
      max(data, (d) => d.value) as number,
    ])

    svg
      .append("g")
      .attr("class", "x axis")
      .attr("transform", `translate(0,${height})`)
      .call(xAxis)
    svg.append("g").attr("class", "y axis").call(yAxis)

    svg
      .append("path")
      .datum(data)
      .transition()
      .duration(animationTime)
      .attrTween("d", () => getInterpolation(data, line))
      .attr("class", "line")

    const lr = linearRegression(data)

    const regressionLine = d3Line<DataItem>()
      .x((d) => x(d.occurred))
      .y((d) => {
        const tmp = lr.intercept! + lr.slope! * +d.occurred

        return y(tmp)
      })

    svg
      .append("path")
      .datum(data)
      .transition()
      .delay(animationTime)
      .duration(animationTime)
      .attrTween("d", () => getInterpolation(data, regressionLine))
      .attr("class", "rline")

    svg
      .append("text")
      .attr("transform", `translate(${width * 0.7},${height * 0.7})`)
      .style("opacity", 0)
      .transition()
      .delay(animationTime * 2)
      .text(`Slope: ${lr.slope!.toExponential(3)}`)
      .style("opacity", 1)
  }

  renderContent(initialZoomed)

  return {
    renderContent,
  }
}

const main = async () => {
  const rootElId = "chart"
  const data = await fetchData()

  const getIsZoomed = () =>
    (document.querySelector('input[value="zoom"]') as HTMLInputElement).checked

  const { renderContent } = renderGraph({
    data,
    initialZoomed: getIsZoomed(),
    rootElId,
  })

  selectAll('input[name="mode"]').on("change", () => {
    const isZoomed = getIsZoomed()

    renderContent(isZoomed)
  })
}

export default main
