import { RaphaelElement, RaphaelPaper, RaphaelPath } from "raphael"

import Raphael from "@/demos/_utils/browserRaphael"

import * as styles from "./moving-line.module.css"

const CONTAINER_ID = "chart"

type GraphData = {
  charts: Array<{
    lower: string
    points: Array<{
      point: RaphaelElement
      value: number // eslint-disable-line id-denylist
    }>
    upper: string
  }>
  current: number
  line: RaphaelPath
  paper: RaphaelPaper
  xDelta: number
  xOffset: number
  yOffset: number
}

const fetchGraphData = async (): Promise<GraphData> => {
  const response = await fetch(`${ROOT_PATH}data/raphael/moving-line/data.json`)

  return response.json()
}

const height = 300

type RenderChartOpts = { graphData: GraphData; rootElId: string }

const renderChart = ({ graphData, rootElId }: RenderChartOpts) => {
  const createPathString = () => {
    const {
      charts: {
        [graphData.current]: { points },
      },
    } = graphData

    let path = `M ${graphData.xOffset} ${graphData.yOffset - points[0].value}`

    points.forEach((...[point, pointIndex]) => {
      path += " L "
      path += `${graphData.xOffset + pointIndex * graphData.xDelta} `
      path += graphData.yOffset - point.value
    })

    return path
  }

  const drawPoints = function () {
    const radius = 6
    const { points } = graphData.charts[0]

    points.forEach((...[point, pointIndex]) => {
      const xPos = graphData.xOffset + pointIndex * graphData.xDelta
      const { yOffset: yPos } = graphData

      const circle = graphData.paper.circle(xPos, yPos, radius)

      circle.node.className.baseVal = styles.point
      circle.attr("title", `Value: ${0}`)
      point.point = circle
    })
  }

  const animateChart = () => {
    const {
      charts: { [graphData.current]: newData },
    } = graphData

    const upperLimit = parseInt(newData.upper) || 1
    const lowerLimit = parseInt(newData.lower) || 0
    const scaleFactor = graphData.yOffset / (upperLimit - lowerLimit)
    const { points } = graphData.charts[0]

    let newPath = ""

    points.forEach((...[point, pointIndex]) => {
      if (pointIndex === 0) {
        newPath += "M "
        newPath += `${graphData.xOffset} `
        newPath += `${
          graphData.yOffset -
          (newData.points[pointIndex].value - lowerLimit) * scaleFactor
        } `
      } else {
        newPath += "L "
        newPath += `${graphData.xOffset + pointIndex * graphData.xDelta} `
        newPath +=
          graphData.yOffset -
          (newData.points[pointIndex].value - lowerLimit) * scaleFactor
      }

      point.point.animate(
        {
          cy:
            graphData.yOffset -
            (newData.points[pointIndex].value - lowerLimit) * scaleFactor,
        },
        800,
        "ease-in-out"
      )
      points[pointIndex].point.node.childNodes[0].remove()
      points[pointIndex].point.attr(
        "title",
        `Value: ${newData.points[pointIndex].value}`
      )
    })

    graphData.line.animate(
      {
        path: newPath,
      },
      800,
      "ease-in-out"
    )
  }

  const advanceGraph = function () {
    if (graphData.current < graphData.charts.length - 1) {
      graphData.current += 1
    } else {
      graphData.current = 1
    }

    animateChart()
  }

  const initLineGraph = function () {
    const rootEl = document.getElementById(rootElId) as HTMLElement

    rootEl.classList.add(styles.movingLineChart)

    const { width } = rootEl.getBoundingClientRect()
    const paper = Raphael(rootElId, width, height)

    graphData.paper = paper

    const path = createPathString()

    const line = paper.path(path)

    graphData.line = line
    drawPoints()

    setInterval(advanceGraph, 3000)
  }

  initLineGraph()
}

const main = async () => {
  const graphData = await fetchGraphData()

  renderChart({
    graphData,
    rootElId: CONTAINER_ID,
  })
}

export { CONTAINER_ID }

export default main
