import { RaphaelElement, RaphaelPaper, RaphaelPath } from "raphael"

import Raphael from "@/demos/_utils/browserRaphael"

import * as styles from "./moving-line.module.css"

type Data = {
  charts: Array<{
    lower: string
    points: Array<{
      point: RaphaelElement
      value: number
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

const fetchData = async (): Promise<Data> => {
  const response = await fetch(`${ROOT_PATH}data/raphael/moving-line/data.json`)
  const data = await response.json()

  return data
}

const height = 300

type RenderChartOpts = { graphData: Data; rootElId: string }

const renderChart = ({ graphData, rootElId }: RenderChartOpts) => {
  const createPathString = () => {
    const {
      charts: {
        [graphData.current]: { points },
      },
    } = graphData

    let path = `M ${graphData.xOffset} ${graphData.yOffset - points[0].value}`
    let i = 0

    const { length } = points

    while (i < length) {
      path += " L "
      path += `${graphData.xOffset + i * graphData.xDelta} `
      path += graphData.yOffset - points[i].value
      i += 1
    }

    return path
  }

  const drawPoints = function () {
    const radius = 6
    const { points } = graphData.charts[0]

    let i = 0

    const { length } = points

    while (i < length) {
      const xPos = graphData.xOffset + i * graphData.xDelta
      const { yOffset: yPos } = graphData

      const circle = graphData.paper.circle(xPos, yPos, radius)

      circle.node.className.baseVal = styles.point
      circle.attr("title", `Value: ${0}`)
      points[i].point = circle
      i += 1
    }
  }

  const animateChart = function () {
    const {
      charts: { [graphData.current]: newData },
    } = graphData
    let newPath = ""

    const upperLimit = parseInt(newData.upper) || 1
    const lowerLimit = parseInt(newData.lower) || 0
    const scaleFactor = graphData.yOffset / (upperLimit - lowerLimit)

    const { points } = graphData.charts[0]

    let i = 0

    const { length } = points

    while (i < length) {
      if (i === 0) {
        newPath += "M "
        newPath += `${graphData.xOffset} `
        newPath += `${
          graphData.yOffset -
          (newData.points[i].value - lowerLimit) * scaleFactor
        } `
      } else {
        newPath += "L "
        newPath += `${graphData.xOffset + i * graphData.xDelta} `
        newPath +=
          graphData.yOffset -
          (newData.points[i].value - lowerLimit) * scaleFactor
      }

      points[i].point.animate(
        {
          cy:
            graphData.yOffset -
            (newData.points[i].value - lowerLimit) * scaleFactor,
        },
        800,
        "ease-in-out"
      )
      points[i].point.node.childNodes[0].remove()
      points[i].point.attr("title", `Value: ${newData.points[i].value}`)
      i += 1
    }

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
  const data = await fetchData()

  renderChart({
    graphData: data,
    rootElId: "chart",
  })
}

export default main
