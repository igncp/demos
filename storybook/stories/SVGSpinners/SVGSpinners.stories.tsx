import React from "react"
import { Selection, select } from "d3"

import { TemplateType } from "../common"
import StoryInfo from "../StoryInfo"

import * as styles from "./svgSpinners.module.css"

enum SpinnerType {
  First = "first",
  Second = "second",
  Third = "third",
}

type Props = { color: string; size: number; type: SpinnerType }
type SpinnerFn = (
  svg: Selection<SVGGElement, unknown, HTMLElement, unknown>,
  p: Props
) => void

const ROOT_ID = "example"

const firstSpinnerFn: SpinnerFn = (svg, props) => {
  svg.attr("class", styles.firstSpinner)

  const circleCenter = 50

  ;[
    { className: styles.firstCircle, direction: 1, radius: 47 },
    { className: styles.secondCircle, direction: -1, radius: 39 },
  ].forEach(({ className, direction, radius }) => {
    svg
      .append("circle")
      .attr("class", className)
      .attr("r", radius)
      .attr("cx", circleCenter)
      .attr("cy", circleCenter)
      .attr("stroke", props.color)
      .append("animateTransform")
      .attr("attributeName", "transform")
      .attr("type", "rotate")
      .attr("dur", "5s")
      .attr("from", [0, circleCenter, circleCenter].join(" "))
      .attr("to", [360 * direction, circleCenter, circleCenter].join(" "))
      .attr("repeatCount", "indefinite")
  })

  Array.from({ length: 5 })
    .map((_, idx) => [30 + idx * 10, (idx + 1) * 0.1])
    .forEach(([x, begin]) => {
      const valueLimit = 5

      svg
        .append("rect")
        .attr("x", x)
        .attr("y", "35")
        .attr("width", "5")
        .attr("height", "30")
        .append("animateTransform")
        .attr("attributeName", "transform")
        .attr("type", "translate")
        .attr("dur", "1s")
        .attr(
          "values",
          [
            [0, valueLimit],
            [0, -valueLimit],
            [0, valueLimit],
          ]
            .map((v) => v.join(" "))
            .join(" ; ")
        )
        .attr("repeatCount", "indefinite")
        .attr("begin", begin)
    })
}

const secondSpinnerFn: SpinnerFn = (svg, props) => {
  const circleCenter = 50
  const smallCircleRadius = 4
  const bigCircleRadius = 40

  svg
    .append("circle")
    .attr("fill", "none")
    .attr("stroke", props.color)
    .attr("cx", circleCenter)
    .attr("cy", circleCenter)
    .attr("r", bigCircleRadius)
    .style("opacity", "0.5")

  svg
    .append("circle")
    .attr("fill", props.color)
    .attr("cx", circleCenter - bigCircleRadius)
    .attr("cy", circleCenter)
    .attr("r", smallCircleRadius)
    .append("animateTransform")
    .attr("attributeName", "transform")
    .attr("dur", "2s")
    .attr("type", "rotate")
    .attr("from", [0, circleCenter, circleCenter].join(" "))
    .attr("to", [360, circleCenter, circleCenter].join(" "))
    .attr("repeatCount", "indefinite")
}

const thirdSpinnerFn: SpinnerFn = (svg) => {
  Array.from({ length: 3 }).forEach((_, idx: number, arr) => {
    svg
      .append("circle")
      .attr("stroke", "none")
      .attr("cx", 6 + 20 * idx)
      .attr("cy", "50")
      .attr("r", "5")
      .append("animate")
      .attr("attributeName", "opacity")
      .attr("dur", "1s")
      .attr("values", [0, 1, 0].join(";"))
      .attr("repeatCount", "indefinite")
      .attr("begin", (1 / arr.length) * idx)
  })
}

const spinnersFns: { [key in SpinnerType]: SpinnerFn } = {
  [SpinnerType.First]: firstSpinnerFn,
  [SpinnerType.Second]: secondSpinnerFn,
  [SpinnerType.Third]: thirdSpinnerFn,
}

const main = (props: Props) => {
  const svg = select(`#${ROOT_ID}`)
    .text("")
    .append("svg")
    .attr("viewBox", [0, 0, 100, 100].join(", "))
    .append("g")
    .attr("fill", props.color)

  spinnersFns[props.type](svg, props)
}

const SVGSpinners = (props: Props) => {
  React.useEffect(() => {
    main(props)
  })

  const { size } = props

  return (
    <div>
      <StoryInfo
        source="https://codepen.io/nikhil8krishnan/pen/rVoXJa"
        sourceText="Source (only ported a few)"
        storyName="SVGSpinners"
      />
      <div
        style={{
          height: size,
          width: size,
        }}
      >
        <div id={ROOT_ID} />
      </div>
    </div>
  )
}

const Template = ((props: Props) => (
  <SVGSpinners {...props} />
)) as TemplateType<Props>

const createStory = (spinnerType: SpinnerType) => {
  const story = (args: Props) => <Template {...args} type={spinnerType} />

  story.args = {
    color: "green",
    size: 250,
  }

  return story
}

export const First = createStory(SpinnerType.First)
export const Second = createStory(SpinnerType.Second)
export const Third = createStory(SpinnerType.Third)

export default {
  argTypes: {
    color: { control: "color" },
    size: "number",
  },
  component: SVGSpinners,
  title: "SVG/Spinners",
}
