const main = () => {
  $.ajax(`${ROOT_PATH}data/raphael/moving-line/data.json`).done((graphData) => {
    const initLineGraph = function () {
      const width = $("#chart").width()
      const height = 300
      const paper = Raphael("chart", width, height)

      graphData.paper = paper

      const path = createPathString(graphData)

      const line = paper.path(path)

      graphData.line = line
      drawPoints(graphData)

      setInterval(advanceGraph, 3000)
    }

    const advanceGraph = function () {
      if (graphData.current < graphData.charts.length - 1) {
        graphData.current++
      } else {
        graphData.current = 1
      }

      return animateChart(graphData, graphData.charts[graphData.current])
    }

    const drawPoints = function (data) {
      const radius = 6
      const { points } = data.charts[0]

      let i = 0

      const { length } = points

      while (i < length) {
        const xPos = data.xOffset + i * data.xDelta
        const yPos = data.yOffset

        const circle = data.paper.circle(xPos, yPos, radius)

        circle.node.className.baseVal = "point"
        circle.attr({
          title: `Value: ${0}`,
        })
        points[i].point = circle
        i++
      }
    }

    const animateChart = function (data, newData) {
      let newPath = ""

      const upperLimit = parseInt(newData.upper) || 1
      const lowerLimit = parseInt(newData.lower) || 0
      const scaleFactor = data.yOffset / (upperLimit - lowerLimit)

      const { points } = data.charts[0]

      let i = 0

      const { length } = points

      while (i < length) {
        if (i === 0) {
          newPath += "M "
          newPath += `${data.xOffset} `
          newPath += `${
            data.yOffset - (newData.points[i].value - lowerLimit) * scaleFactor
          } `
        } else {
          newPath += "L "
          newPath += `${data.xOffset + i * data.xDelta} `
          newPath +=
            data.yOffset - (newData.points[i].value - lowerLimit) * scaleFactor
        }

        points[i].point.animate(
          {
            cy:
              data.yOffset -
              (newData.points[i].value - lowerLimit) * scaleFactor,
          },
          800,
          "ease-in-out"
        )
        points[i].point.node.childNodes[0].remove()
        points[i].point.attr("title", `Value: ${newData.points[i].value}`)
        i++
      }

      return data.line.animate(
        {
          path: newPath,
        },
        800,
        "ease-in-out"
      )
    }

    const createPathString = function (data) {
      const { points } = data.charts[data.current]

      let path = `M ${data.xOffset} ${data.yOffset - points[0].value}`
      let i = 0

      const { length } = points

      while (i < length) {
        path += " L "
        path += `${data.xOffset + i * data.xDelta} `
        path += data.yOffset - points[i].value
        i++
      }

      return path
    }

    initLineGraph()
  })
}

export default main
