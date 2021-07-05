import React from "react"

import Demo from "@/components/demo"

import main from "@/demos/moving-line/moving-line"
import "@/demos/moving-line/moving-line.styl"

const CircularArcs = ({ pageContext: { demoInfo } }) => (
  <Demo demoInfo={demoInfo} main={main}>
    <div className="moving-line-chart" id="chart" />
  </Demo>
)

export default CircularArcs
