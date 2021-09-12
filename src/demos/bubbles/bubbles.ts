import * as styles from "./bubbles.module.css"

const CONTAINER_ID = "chart"

const fetchScript = (src: string) =>
  new Promise((resolve) => {
    const script = document.createElement("script")

    script.setAttribute("type", "text/javascript")
    script.setAttribute("src", src)
    script.onload = resolve

    document.body.appendChild(script)
  })

const fetchLink = (href: string) =>
  new Promise((resolve) => {
    const link = document.createElement("link")

    link.onload = resolve

    link.href = href
    link.setAttribute("rel", "stylesheet")
    link.setAttribute("type", "text/css")

    document.head.appendChild(link)
  })

const fetchDependencies = async () => {
  await Promise.all([
    fetchLink(`${ROOT_PATH}vendors/nvd3/nv.d3.min.css`),
    (async () => {
      await fetchScript(`${ROOT_PATH}vendors/d3/d3.min.js`)
      await fetchScript(`${ROOT_PATH}vendors/nvd3/nv.d3.min.js`)
    })(),
  ])
}

type JsonData = Array<{
  activityId: string
  activityTimeZone: string
  activityType: string
  deviceType: string
  links: unknown
  metricSummary: {
    calories: string
    distance: string
    duration: string
    fuel: string
    steps: string
  }
  metrics: unknown
  startTime: string
  status: string
  tags: unknown
}>

const durationToMinutes = (str: string) => {
  const strParts = str.split(":")

  return (
    60 * Number(strParts[0]) + Number(strParts[1]) + Number(strParts[2]) / 60
  )
}

const margin = {
  bottom: 100,
  left: 100,
  right: 100,
  top: 100,
}

const fetchData = async () => {
  const response = await fetch(`${ROOT_PATH}data/d3js/bubbles/data.json`)
  const jsonData = await response.json()

  return jsonData.data
}

type RenderChart = (chartConfig: {
  jsonData: JsonData
  rootElId: string
}) => void

const renderChart: RenderChart = ({ jsonData, rootElId }) => {
  const { d3, nv } = window as any // eslint-disable-line @typescript-eslint/no-explicit-any

  const rootEl = document.getElementById(rootElId) as HTMLElement

  rootEl.classList.add(styles.bubblesChart)

  const { width } = rootEl.getBoundingClientRect()

  const color = d3.scale.category20b()

  const chartData = [
    {
      key: "Data",
      // eslint-disable-next-line id-denylist
      values: jsonData.map((...[jsonItem, jsonItemIndex]) => {
        const distance = +jsonItem.metricSummary.distance
        const time = durationToMinutes(jsonItem.metricSummary.duration)
        const pace = time / distance

        return {
          color: color(distance),
          jsonItem,
          size: distance,
          x: jsonData.length - jsonItemIndex,
          y: pace,
        }
      }),
    },
  ]

  type ChartData = typeof chartData
  type ChartDataItem = ChartData[0]["values"][0]

  const chart = nv.models.scatterChart()

  chart.margin(margin)

  nv.utils.windowResize(chart.update)

  chart.forceY([4.5, 6.5]).forceX([0, 135])

  chart.tooltipContent(
    (...[, , , obj]: [unknown, unknown, unknown, { point: ChartDataItem }]) =>
      `${obj.point.size.toFixed(1)} km - ${obj.point.jsonItem.deviceType}`
  )
  chart.xAxis
    .axisLabelDistance(45)
    .tickFormat(d3.format("f"))
    .axisLabel("Person Number")
  chart.yAxis
    .tickFormat(d3.format(".2f"))
    .axisLabelDistance(10)
    .axisLabel("Pace (min/km)")

  d3.select(`#${rootElId}`)
    .append("svg")
    .attr("width", width)
    .datum(chartData)
    .call(chart)
}

const main = async () => {
  const [jsonData] = await Promise.all([fetchData(), fetchDependencies()])

  renderChart({
    jsonData,
    rootElId: CONTAINER_ID,
  })
}

export { CONTAINER_ID }

export default main
