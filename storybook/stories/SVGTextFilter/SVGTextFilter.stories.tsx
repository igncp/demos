import { select } from "d3"
import React from "react"

import {
  StoryInfo,
  TemplateType,
  createRangeControl,
  createSelectControl,
  svgDocs,
} from "../common"

import { ROOT_ID } from "./constants"
import * as styles from "./styles.module.css"

type Props = {
  fontFamily: string
  fontSize: number
  skew: number
  text: string
}

const demo = ({ fontFamily, fontSize, skew, text }: Props) => {
  const container = document.getElementById(ROOT_ID) as HTMLElement
  const { width } = container.getBoundingClientRect()

  select(`#${ROOT_ID}`)
    .text("")
    .append("svg")
    .attr("class", styles.svg)
    .attr("width", width).html(`
  <defs>
    <filter id="filter">
      <!-- Colors: -->
      <feFlood flood-color="#4CFED7"  flood-opacity="1" result="COL_green-l" />
      <feFlood flood-color="#0A4D39"  flood-opacity="1" result="COL_green-m" />
      <feFlood flood-color="#2A9B83"  flood-opacity="1" result="COL_green-d" />
      <feFlood flood-color="#FA5C71"  flood-opacity="1" result="COL_red-l" />
      <feFlood flood-color="#A5122B"  flood-opacity="1" result="COL_red-d" />
      <feFlood flood-color="rgba(0,0,0,0)" flood-opacity="0" result="TRANSPARENT" />
      <!-- Colors end -->

      <!-- Lower Green Bevel -->
      <feMorphology operator="dilate" radius="10" in="SourceAlpha" result="GREEN-BEVEL-1_10" />
      <feConvolveMatrix order="8,8" divisor="1"
        kernelMatrix = "1 0 0 0 0 0 0 0 0 1 0 0 0 0 0 0 0 0 1 0 0 0 0 0 0 0 0 1 0 0 0 0 0 0 0 0 1 0 0 0 0 0 0 0 0 1 0 0 0 0 0 0 0 0 1 0 0 0 0 0 0 0 0 1" in="GREEN-BEVEL-1_10" result="GREEN-BEVEL-1_20" />
      <feComposite operator="in" in="COL_green-d"  in2="GREEN-BEVEL-1_20" result="GREEN-BEVEL-1_30" />
      <!-- Lower Green Bevel End -->

      <!-- Lower Green Front -->
      <feComposite operator="in" in="COL_green-l" in2="GREEN-BEVEL-1_10" result="GREEN-FRONT-1_0" />
      <feOffset dx="4" dy="4" in="GREEN-FRONT-1_0" result="GREEN-FRONT-1_10"/>
      <feSpecularLighting surfaceScale="0" specularConstant=".75" specularExponent="30" lighting-color="#white" in="GREEN-FRONT-1_10" result="GREEN-FRONT-1_20">
        <fePointLight x="0" y="-30" z="400" />
      </feSpecularLighting>
      <feComposite operator="out" in2="GREEN-FRONT-1_20" in="GREEN-FRONT-1_10" result="GREEN-FRONT-1_30" />
      <!-- Lower Green Front End -->

      <!-- Upper Green Bevel -->
      <feMorphology operator="dilate" radius="7" in="SourceAlpha" result="GREEN-BEVEL-2_0" />
      <feConvolveMatrix order="8,8" divisor="1"
        kernelMatrix = "1 0 0 0 0 0 0 0 0 1 0 0 0 0 0 0 0 0 1 0 0 0 0 0 0 0 0 1 0 0 0 0 0 0 0 0 1 0 0 0 0 0 0 0 0 1 0 0 0 0 0 0 0 0 1 0 0 0 0 0 0 0 0 1"
        in="GREEN-BEVEL-2_0"
        result="GREEN-BEVEL-2_10"
      />
      <feComposite operator="in" in="COL_green-d" in2="GREEN-BEVEL-2_10" result="GREEN-BEVEL-2_20" />
      <feOffset dx="9" dy="9" in="GREEN-BEVEL-2_20" result="GREEN-BEVEL-2_30"/>
      <!-- Upper Green Bevel end -->

      <!-- Upper Green Front -->
      <feOffset dx="18" dy="18" in="GREEN-BEVEL-2_0" result="GREEN-FRONT-2_10"/>
      <feComposite operator="in" in="COL_green-l" in2="GREEN-FRONT-2_10" result="GREEN-FRONT-2_20" />
      <feSpecularLighting surfaceScale="0" specularConstant="0.75" specularExponent="40" lighting-color="#white" in="GREEN-FRONT-2_20" result="GREEN-FRONT-2_30">
        <fePointLight x="120" y="170" z="500" />
      </feSpecularLighting>
       <feComposite operator="in" in2="GREEN-FRONT-2_10" in="GREEN-FRONT-2_30" result="GREEN-FRONT-2_40" />
      <!-- Upper Green Front end -->

      <!-- Bevels and Front shaded -->
      <feMerge  result="SHADED-BEVELS_0">
        <feMergeNode in="GREEN-BEVEL-1_10" />
        <feMergeNode in="GREEN-FRONT-1_30" />
        <feMergeNode in="GREEN-BEVEL-2_30" />
        <feMergeNode in="GREEN-FRONT-2_20" />
        <feMergeNode in="GREEN-FRONT-2_40" />
        <feMergeNode in="TRANSPARENT" />
      </feMerge>

      <feSpecularLighting surfaceScale="0" specularConstant="0.45" specularExponent="30" lighting-color="#white" in="SHADED-BEVELS_0" result="SHADED-BEVELS_10">
          <fePointLight x="320" y="-20" z="400" />
      </feSpecularLighting>
      <feComposite operator="in" in2="SHADED-BEVELS_0" in="SHADED-BEVELS_10" result="SHADED-BEVELS_30" />
      <!-- Bevels and Front shaded end -->

      <!-- Upper Red Bevel -->
      <feConvolveMatrix order="4,4" divisor="1"
        kernelMatrix="1 0 0 0
        0 1 0 0
        0 0 1 0
        0 0 0 1" in="SourceAlpha" result = "RED-BEVEL-0_0"
      />
      <feComposite in="COL_red-d" in2="RED-BEVEL-0_0" operator="in"  result="RED-BEVEL-0_10" />
      <feOffset dx="20" dy="20" in="RED-BEVEL-0_10" result="RED-BEVEL-0_20"/>
      <!-- Upper Red Bevel end -->

      <!-- Upper Red Front -->
      <feComposite operator="in"  in="COL_red-l" in2="SourceAlpha" result="RED-FRONT-0_0" />
      <feOffset dx="24" dy="24" in="RED-FRONT-0_0" result="RED-FRONT-0_10"/>
      <feSpecularLighting
        surfaceScale="0"
        specularConstant=".45"
        specularExponent="30"
        lighting-color="#white"
        in="RED-FRONT-0_10"
        result="RED-FRONT-0_20"
      >
        <fePointLight x="20" y="180" z="300" />
      </feSpecularLighting>
      <feComposite operator="in" in2="RED-FRONT-0_10" in="RED-FRONT-0_20" result="RED-FRONT-0_30" />
      <!-- Upper Red Front end-->

      <!-- Inner Line -->
      <feMorphology radius="4" in="SourceAlpha" result="INNER-LINE_0" />
      <feMorphology radius="5" in="SourceAlpha" result="INNER-LINE_10" />
      <feComposite operator="out" in="INNER-LINE_0" in2="INNER-LINE_10" result="INNER-LINE_20" />
      <feComposite operator="in" in="COL_green-l" in2="INNER-LINE_20" result="INNER-LINE_30" />
      <feOffset dx="24" dy="24" in="INNER-LINE_30" result="INNER-LINE_40" />
      <!-- Inner Line end -->

      <feMerge result="extruded-m">
        <feMergeNode in="SHADED-BEVELS_0" />
        <feMergeNode in="SHADED-BEVELS_30" />
        <feMergeNode in="RED-BEVEL-0_20" />
        <feMergeNode in="RED-FRONT-0_10" />
        <feMergeNode in="RED-FRONT-0_30" />
        <feMergeNode in="INNER-LINE_40" />
        <feMergeNode in="TRANSPARENT" />
      </feMerge>
    </filter>
  </defs>
  <g class="${styles.filtered}">
    <text x="20" y="${100 + skew * 10 + fontSize}"
      transform="skewY(-${skew})"
      style="font-family: ${fontFamily}; font-size: ${fontSize}px;"
    >
      ${text}
    </text>
  </g>
`)
}

const SVGTextFilter = (props: Props) => {
  React.useEffect(() => {
    demo(props)
  }, [props])

  return (
    <div>
      <StoryInfo
        docs={[
          svgDocs.feConvolveMatrix,
          svgDocs.feFlood,
          svgDocs.feMorphology,
          svgDocs.fePointLight,
        ]}
        source="https://cloud.netlifyusercontent.com/assets/344dbf88-fdf9-42bb-adb4-46f01eedd629/091ac72c-a975-481c-9c5a-f3adf7961f83/3dneon-svg.html"
        storyName="SVGTextFilter"
      />
      <div id={ROOT_ID} />
    </div>
  )
}

const Template = ((props: Props) => (
  <SVGTextFilter {...props} />
)) as TemplateType<Props>

const Common = Template.bind({})

const [fontsArgs, fontsControls] = createSelectControl(["sans-serif", "serif"])
const [fontSizeArgs, fontSizeControls] = createRangeControl({
  diffMax: 100,
  diffMin: 150,
  initialValue: 170,
  step: 1,
})
const [skewArgs, skewControls] = createRangeControl({
  diffMin: 12,
  initialValue: 12,
  step: 1,
})

const args: Props = {
  fontFamily: fontsArgs,
  fontSize: fontSizeArgs,
  skew: skewArgs,
  text: "Demos",
}

Common.args = args

export default {
  argTypes: {
    fontFamily: fontsControls,
    fontSize: fontSizeControls,
    skew: skewControls,
  },
  component: SVGTextFilter,
  title: "SVG/Text Filter",
}

export { Common }
