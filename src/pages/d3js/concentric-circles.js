import React from "react"

import Demo from "@/components/demo"

import main from "@/demos/concentric-circles/concentric-circles"

const ConcentricCircles = ({ pageContext: { demoInfo } }) => (
  <Demo demoInfo={demoInfo} main={main}>
    <div className="concentric-circles-chart" id="chart" />
  </Demo>
)

export default ConcentricCircles
