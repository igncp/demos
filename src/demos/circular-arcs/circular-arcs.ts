import { RaphaelPaper, RaphaelPath } from "raphael"

import Raphael from "@/demos/_utils/browserRaphael"

import * as styles from "./circular-arcs.module.css"

const CONTAINER_ID = "chart"

const strokeWidth = 3

type ArcFnOpts = {
  angle: number
  endX: number
  endY: number
  radius1: number
  radius2: number
  startX: number
  startY: number
}

// eslint-disable-next-line max-params
function arcFn(
  this: RaphaelPaper,
  { angle, endX, endY, radius1, radius2, startX, startY }: ArcFnOpts
) {
  const arcSVG = [radius1, radius2, angle, 0, 1, endX, endY].join(" ")

  return this.path(`M${startX} ${startY} a ${arcSVG}`)
}

type CircularArcOpts = {
  centerX: number
  centerY: number
  endAngle: number
  radius: number
  startAngle: number
}

type ExtendedRaphael<CircularArc> = RaphaelPaper & {
  arc: typeof arcFn
  circularArc: CircularArc
}

// eslint-disable-next-line max-params
function circularArc(
  this: ExtendedRaphael<typeof circularArc>,
  { centerX, centerY, endAngle, radius, startAngle }: CircularArcOpts
) {
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

const addHoverHandlers = function (arcSelection: RaphaelPath) {
  const widthMultiplier = 2.5

  arcSelection.hover(
    function () {
      this.attr("fill-opacity", 0.3)

      this.animate(
        {
          "stroke-width": strokeWidth * widthMultiplier,
        },
        500,
        "bounce"
      )
    },
    function () {
      this.attr("fill-opacity", 0.2)

      this.animate(
        {
          "stroke-width": strokeWidth,
        },
        500,
        "bounce"
      )
    }
  )
}

type CreateArcOpts = {
  arcI: number
  fill: string
  paper: ExtendedRaphael<typeof circularArc>
  stroke: string
}

const createArc = ({ arcI, fill, paper, stroke }: CreateArcOpts) => {
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
    .attr("fill-opacity", 0.2)
    .attr("stroke", stroke)
    .attr("stroke-width", strokeWidth)

  addHoverHandlers(arc)
}

const main = () => {
  const rootElId = CONTAINER_ID
  const chartWrapper = document.getElementById(rootElId) as HTMLElement

  chartWrapper.classList.add(styles.circularArcsChart)

  const { width } = chartWrapper.getBoundingClientRect()
  const height = 500

  Raphael.fn.circularArc = circularArc
  Raphael.fn.arc = arcFn

  const paper = Raphael(rootElId, width, height)

  for (let arcI = 0; arcI <= 50; arcI += 1) {
    createArc({
      arcI,
      fill: "#85d588",
      paper,
      stroke: "#558857",
    })
  }

  return Promise.resolve()
}

export { CONTAINER_ID }

export default main
