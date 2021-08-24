import {
  Line,
  axisBottom,
  axisLeft,
  line as d3Line,
  extent,
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

import * as styles from "./trend-line.module.css"

type InitialDataItem = {
  occurred: string
  value: string // eslint-disable-line id-denylist
}

type DataItem = {
  arbitraryValue: number
  occurred: Date
}

const fetchData = async (): Promise<DataItem[]> => {
  const response = (await tsv(
    `${ROOT_PATH}data/d3js/trend-line/data.tsv`
  )) as InitialDataItem[]

  const timeFormat = timeParse("%Y-%m-%d")

  return response.map((responseItem) => ({
    arbitraryValue: +responseItem.value,
    occurred: timeFormat(responseItem.occurred)!,
  }))
}

const margin = {
  bottom: 50,
  left: 50,
  right: 50,
  top: 50,
}

const height = 500 - margin.top - margin.bottom

const animationTime = 2000

const getInterpolation = ({
  line,
  lineData,
}: {
  line: Line<DataItem>
  lineData: DataItem[]
}) => () => {
  const interpolate = scaleQuantile()
    .domain([0, 1])
    .range(range(1, lineData.length + 1))

  return (t: number): string => {
    const interpolatedLine = lineData.slice(0, interpolate(t))

    return line(interpolatedLine)!
  }
}

const createLinearRegression = (lineData: DataItem[]) => {
  const linearRegression: {
    intercept?: number
    r2?: number
    slope?: number
  } = {}
  const { length: itemsNum } = lineData

  let sumX = 0
  let sumY = 0
  let sumXY = 0
  let sumXX = 0
  let sumYY = 0

  lineData.forEach((lineItem) => {
    sumY += lineItem.arbitraryValue
    sumYY += lineItem.arbitraryValue * lineItem.arbitraryValue
    sumXY += lineItem.occurred.getTime() * lineItem.arbitraryValue

    sumX += lineItem.occurred.getTime()
    sumXX += lineItem.occurred.getTime() * lineItem.occurred.getTime()
  })

  linearRegression.slope =
    (itemsNum * sumXY - sumX * sumY) / (itemsNum * sumXX - sumX * sumX)
  linearRegression.intercept = (sumY - linearRegression.slope * sumX) / itemsNum
  linearRegression.r2 = Math.pow(
    (itemsNum * sumXY - sumX * sumY) /
      Math.sqrt(
        (itemsNum * sumXX - sumX * sumX) * (itemsNum * sumYY - sumY * sumY)
      ),
    2
  )

  return linearRegression
}

const renderGraph = ({
  initialZoomed,
  lineData,
  rootElId,
}: {
  initialZoomed: boolean
  lineData: DataItem[]
  rootElId: string
}) => {
  const container = document.getElementById(rootElId) as HTMLElement

  container.classList.add(styles.trendLineChart)

  const width =
    container.getBoundingClientRect().width - margin.left - margin.right

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
      .x((lineItem) => x(lineItem.occurred))
      .y((lineItem) => y(lineItem.arbitraryValue))

    x.domain(extent(lineData, (lineItem) => lineItem.occurred) as [Date, Date])
    y.domain([
      isZoomed
        ? (min(lineData, (lineItem) => lineItem.arbitraryValue) as number)
        : 0,
      max(lineData, (lineItem) => lineItem.arbitraryValue) as number,
    ])

    svg
      .append("g")
      .attr("class", `x ${styles.axis}`)
      .attr("transform", `translate(0,${height})`)
      .call(xAxis)
    svg.append("g").attr("class", `y ${styles.axis}`).call(yAxis)

    svg
      .append("path")
      .datum(lineData)
      .transition()
      .duration(animationTime)
      .attrTween(
        "d",
        getInterpolation({
          line,
          lineData,
        })
      )
      .attr("class", styles.line)

    const linearRegression = createLinearRegression(lineData)

    const regressionLine = d3Line<DataItem>()
      .x((lineItem) => x(lineItem.occurred))
      .y((lineItem) =>
        y(
          linearRegression.intercept! +
            linearRegression.slope! * +lineItem.occurred
        )
      )

    svg
      .append("path")
      .datum(lineData)
      .transition()
      .delay(animationTime)
      .duration(animationTime)
      .attrTween(
        "d",
        getInterpolation({
          line: regressionLine,
          lineData,
        })
      )
      .attr("class", styles.rline)

    svg
      .append("text")
      .attr("transform", `translate(${width * 0.7},${height * 0.7})`)
      .style("opacity", 0)
      .transition()
      .delay(animationTime * 2)
      .text(`Slope: ${linearRegression.slope!.toExponential(3)}`)
      .style("opacity", 1)
  }

  renderContent(initialZoomed)

  return {
    renderContent,
  }
}

const main = async () => {
  const rootElId = "chart"
  const lineData = await fetchData()

  const getIsZoomed = () =>
    (document.querySelector('input[value="zoom"]') as HTMLInputElement).checked

  const { renderContent } = renderGraph({
    initialZoomed: getIsZoomed(),
    lineData,
    rootElId,
  })

  selectAll('input[name="mode"]').on("change", () => {
    const isZoomed = getIsZoomed()

    renderContent(isZoomed)
  })
}

export default main
