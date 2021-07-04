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

type JsonData = {
  data: Array<{
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
}

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
  const data = await fetch(`${ROOT_PATH}data/d3js/bubbles/data.json`)
  const jsonData = await data.json()

  return jsonData
}

type RenderChart = (o: { rootElId: string; jsonData: JsonData }) => void

const renderChart: RenderChart = ({ rootElId, jsonData }) => {
  const { d3, nv } = window as any

  const { width } = (document.getElementById(
    rootElId
  ) as HTMLElement).getBoundingClientRect()

  const color = d3.scale.category20b()

  const chartData = [
    {
      key: "Data",
      values: jsonData.data.map((d, i, arr) => {
        const distance = +d.metricSummary.distance
        const time = durationToMinutes(d.metricSummary.duration)
        const pace = time / distance

        return {
          color: color(distance),
          data: d,
          size: distance,
          x: arr.length - i,
          y: pace,
        }
      }),
    },
  ]

  type ChartData = typeof chartData
  type ChartDataItem = ChartData[0]["values"][0]

  const chart = nv.models.scatterChart()

  chart.margin(margin)
  chart.xAxis.axisLabelDistance(45).tickFormat(d3.format(".1f"))
  chart.yAxis.axisLabelDistance(45).tickFormat(d3.format(".2f"))

  nv.utils.windowResize(chart.update)

  chart.forceY([4.5, 6.5]).forceX([0, 135])

  chart.tooltipContent(
    (_key: unknown, _x: unknown, _y: unknown, obj: { point: ChartDataItem }) =>
      `${obj.point.size.toFixed(1)} km - ${obj.point.data.deviceType}`
  )
  chart.xAxis.tickFormat(d3.format("f")).axisLabel("Person Number")
  chart.yAxis.axisLabelDistance(10).axisLabel("Pace (min/km)")

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
    rootElId: "chart",
  })
}

export default main
