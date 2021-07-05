const Raphael = typeof window === "undefined" ? null : require("raphael")

const main = function () {
  const width = 700
  const height = 300
  const strokeWidth = 3
  const paper = Raphael("chart", width, height)

  Raphael.fn.arc = function (
    startX,
    startY,
    endX,
    endY,
    radius1,
    radius2,
    angle
  ) {
    const arcSVG = [radius1, radius2, angle, 0, 1, endX, endY].join(" ")

    return this.path(`M${startX} ${startY} a ${arcSVG}`)
  }

  Raphael.fn.circularArc = function (
    centerX,
    centerY,
    radius,
    startAngle,
    endAngle
  ) {
    const startX = centerX + radius * Math.cos((startAngle * Math.PI) / 180)
    const startY = centerY + radius * Math.sin((startAngle * Math.PI) / 180)
    const endX = centerX + radius * Math.cos((endAngle * Math.PI) / 180)
    const endY = centerY + radius * Math.sin((endAngle * Math.PI) / 180)

    return this.arc(
      startX,
      startY,
      endX - startX,
      endY - startY,
      radius,
      radius,
      0
    )
  }

  const hoverFn = function (el) {
    const widthMultiplier = 2.5

    return el.hover(
      function () {
        this.attr({
          "fill-opacity": ".3",
        })

        return this.animate(
          {
            "stroke-width": strokeWidth * widthMultiplier,
          },
          500,
          "bounce"
        )
      },
      function () {
        this.attr({
          "fill-opacity": ".2",
        })

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

  let arcI = -1

  const createArc = function (stroke, fill) {
    arcI++

    const center = width / (4 + arcI) + (strokeWidth - 1)

    const arc = paper.circularArc(
      center + 30 + Math.pow(arcI, 1.5),
      height - (100 - arcI * 2),
      width / (4 + arcI),
      180,
      0
    )

    arc.attr({
      fill,
      "fill-opacity": ".2",
      stroke,
      "stroke-width": strokeWidth,
    })
    hoverFn(arc)

    return arc
  }

  for (let _i = 0; _i <= 30; ++_i) {
    createArc("#558857", "#85D588")
  }
}

export default main
