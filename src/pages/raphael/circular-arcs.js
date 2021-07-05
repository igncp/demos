import React from "react"

import Demo from "@/components/demo"

import main from "@/demos/circular-arcs/circular-arcs"
import "@/demos/circular-arcs/circular-arcs.styl"

const CircularArcs = ({ pageContext: { demoInfo } }) => (
  <Demo demoInfo={demoInfo} main={main}>
    <div className="circular-arcs-chart" id="chart" />
  </Demo>
)

export default CircularArcs
