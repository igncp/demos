const Raphael = typeof window === "undefined" ? null : require("raphael")

const strokeWidth = 3

const addHoverHandlers = function (el) {
  const widthMultiplier = 2.5

  el.hover(
    function () {
      this.attr("fill-opacity", ".3")

      return this.animate(
        {
          "stroke-width": strokeWidth * widthMultiplier,
        },
        500,
        "bounce"
      )
    },
    function () {
      this.attr("fill-opacity", ".2")

      return this.animate(
        {
          "stroke-width": strokeWidth,
        },
        500,
        "bounce"
      )
    }
  )
}

const createArc = ({ stroke, fill, arcI, paper }) => {
  const center = paper.width / (4 + arcI) + (strokeWidth - 1)

  const arc = paper.circularArc({
    centerX: center + 30 + Math.pow(arcI, 1.5),
    centerY: paper.height - (100 - arcI * 2),
    endAngle: 0,
    radius: paper.width / (4 + arcI),
    startAngle: 180,
  })

  arc
    .attr("fill", fill)
    .attr("fill-opacity", ".2")
    .attr("stroke", stroke)
    .attr("stroke-width", strokeWidth)

  addHoverHandlers(arc)
}

const setupNewRaphaelFns = () => {
  Raphael.fn.arc = function ({
    angle,
    endX,
    endY,
    radius1,
    radius2,
    startX,
    startY,
  }) {
    const arcSVG = [radius1, radius2, angle, 0, 1, endX, endY].join(" ")

    return this.path(`M${startX} ${startY} a ${arcSVG}`)
  }

  Raphael.fn.circularArc = function ({
    centerX,
    centerY,
    radius,
    startAngle,
    endAngle,
  }) {
    const startX = centerX + radius * Math.cos((startAngle * Math.PI) / 180)
    const startY = centerY + radius * Math.sin((startAngle * Math.PI) / 180)

    const endX = centerX + radius * Math.cos((endAngle * Math.PI) / 180)
    const endY = centerY + radius * Math.sin((endAngle * Math.PI) / 180)

    return this.arc({
      angle: 0,
      endX: endX - startX,
      endY: endY - startY,
      radius1: radius,
      radius2: radius,
      startX,
      startY,
    })
  }
}

const main = function () {
  const rootElId = "chart"
  const chartWrapper = document.getElementById(rootElId)

  const { width } = chartWrapper.getBoundingClientRect()
  const height = 500

  const paper = Raphael(rootElId, width, height)

  setupNewRaphaelFns()

  for (let arcI = 0; arcI <= 50; ++arcI) {
    createArc({
      arcI,
      fill: "#85D588",
      paper,
      stroke: "#558857",
    })
  }
}

export default main
