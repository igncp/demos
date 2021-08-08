import React from "react"
import { select } from "d3"

import { TemplateType } from "../common"
import StoryInfo from "../StoryInfo"

import * as styles from "./svgUnderlineBorder.module.css"

type Props = { infinite: boolean }

const ROOT_ID = "example"

const main = ({ infinite }: Props) => {
  const width = 320
  const height = 60

  const wrapper = select(`#${ROOT_ID}`)
    .text("")
    .append("div")
    .style("height", `${height}px`)
    .attr("class", styles.svgWrapper)

  const svg = wrapper.append("svg").attr("height", height).attr("width", width)

  const rect = svg
    .append("rect")
    .attr("class", styles.shape)
    .attr("height", height)
    .attr("width", width)

  const text = wrapper.append("div").attr("class", styles.text).text("HOVER")

  ;[text, svg].forEach((item) => {
    item.on("mouseenter", () => {
      rect.style(
        "animation",
        (infinite
          ? ["2s", styles.hoverBorderLoop, "linear", "infinite", "forwards"]
          : ["0.5s", styles.hoverBorder, "linear", "forwards"]
        ).join(" ")
      )
    })
  })
  ;[text, svg].forEach((el) => {
    el.on("mouseleave", () => {
      rect.style("animation", null).style("stroke", null)
    })
  })
}

const SVGUnderlineBorder = (props: Props) => {
  React.useEffect(() => {
    main(props)
  })

  return (
    <div>
      <p>Hover the underline to see the effect</p>
      <StoryInfo
        source="https://codepen.io/seanmccaffery/pen/xBpbG"
        storyName="SVGUnderlineBorder"
      />
      <div id={ROOT_ID} />
    </div>
  )
}

const Template = ((props: Props) => (
  <SVGUnderlineBorder {...props} />
)) as TemplateType<Props>

export const Common = Template.bind({})
Common.args = {
  infinite: false,
}

export default {
  component: SVGUnderlineBorder,
  title: "SVG/Underline Border",
}
