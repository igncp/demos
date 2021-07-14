import React from "react"

import Demo from "@/components/demo"

import main from "@/demos/force/force"
import "@/demos/force/force.styl"

const Force = ({ pageContext: { demoInfo } }) => (
  <Demo demoInfo={demoInfo} main={main}>
    <div className="force-chart" id="chart" />
  </Demo>
)

export default Force
