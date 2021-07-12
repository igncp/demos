import * as d3next from "d3"

const fetchData = () => d3next.tsv(`${ROOT_PATH}data/d3js/trend-line/data.tsv`)

const margin = {
  bottom: 50,
  left: 50,
  right: 50,
  top: 50,
}

const height = 500 - margin.top - margin.bottom

const animationTime = 2000

const getInterpolation = function (data, line) {
  const interpolate = d3.scale
    .quantile()
    .domain([0, 1])
    .range(d3.range(1, data.length + 1))

  return function (t) {
    const interpolatedLine = data.slice(0, interpolate(t))

    return line(interpolatedLine)
  }
}

const linearRegression = function (data) {
  const lr = {}
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

const renderGraph = ({ data, rootElId }) => {
  const width =
    document.getElementById(rootElId).getBoundingClientRect().width -
    margin.left -
    margin.right

  const timeFormat = d3.time.format("%Y-%m-%d").parse

  data.forEach((d) => {
    d.occurred = timeFormat(d.occurred)
    d.value = +d.value
  })

  const renderContent = () => {
    const zoomed = d3.select('input[value="zoom"]')[0][0].checked

    const svg = d3
      .select(`#${rootElId}`)
      .text("")
      .append("svg")
      .attr("height", height + margin.top + margin.bottom)
      .attr("width", width + margin.left + margin.right)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.right})`)

    const x = d3.time.scale().range([0, width])
    const y = d3next.scaleLinear().range([height, 0])
    const xAxis = d3.svg.axis().scale(x).orient("bottom")
    const yAxis = d3.svg.axis().scale(y).orient("left")

    const line = d3.svg
      .line()
      .x((d) => x(d.occurred))
      .y((d) => y(d.value))

    x.domain(d3.extent(data, (d) => d.occurred))
    y.domain([
      (function () {
        if (zoomed) {
          return d3.min(data, (d) => d.value)
        }

        return 0
      })(),
      d3next.max(data, (d) => d.value),
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

    const regressionLine = d3.svg
      .line()
      .x((d) => x(d.occurred))
      .y((d) => {
        const tmp = lr.intercept + lr.slope * d.occurred

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
      .transition(1000)
      .delay(animationTime * 2)
      .text(`Slope: ${lr.slope.toExponential(3)}`)
      .style("opacity", 1)
  }

  renderContent()

  d3.selectAll('input[name="mode"]').on("change", renderContent)
}

const main = async () => {
  const rootElId = "chart"
  const data = await fetchData()

  renderGraph({
    data,
    rootElId,
  })
}

export default main
