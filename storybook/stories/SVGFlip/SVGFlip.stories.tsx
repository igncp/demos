import React from "react"
import { select } from "d3"

import { TemplateType } from "../common"

import "./svgFlip.module.css"

type Props = { color: string; infinite: boolean }

const ROOT_ID = "example"

const main = ({ color, infinite }: Props) => {
  const svg = select(`#${ROOT_ID}`)
    .text("")
    .append("svg")
    .style("border", "1px solid black")

  const container = svg.append("g").attr("transform", "translate(40, 40)")

  const circle = container
    .append("circle")
    .attr("fill", color)
    .attr("r", "25")
    .attr("stroke", "black")
    .attr("stroke-width", "2px")

  svg
    .on("mouseenter", () => {
      circle
        .attr("fill", "orange")
        .style(
          "animation",
          ["flip_left", "1s", infinite && "infinite", "forwards"]
            .filter((v) => !!v)
            .join(" ")
        )
    })
    .on("mouseleave", () => {
      circle.attr("fill", color).style("animation", null)
    })
}

const SVGFlip = (props: Props) => {
  React.useEffect(() => {
    main(props)
  })

  return (
    <div>
      <p>Hover the rectangle to flip the circle</p>
      <p>
        <a
          href="https://codepen.io/demianpt/pen/qbLaQZ"
          rel="noreferrer"
          target="_blank"
        >
          Source
        </a>
      </p>
      <div id={ROOT_ID} />
    </div>
  )
}

const Template = ((props: Props) => (
  <SVGFlip {...props} />
)) as TemplateType<Props>

export const Common = Template.bind({})
Common.args = {
  color: "green",
  infinite: false,
}

export default {
  argTypes: {
    color: { control: "color" },
  },
  component: SVGFlip,
  title: "SVG/Flip",
}
