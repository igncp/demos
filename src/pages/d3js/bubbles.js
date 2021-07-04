import React from "react"

import Demo from "@/components/demo"

import main from "@/demos/bubbles/bubbles"

import "@/demos/bubbles/bubbles.styl"

const Bubbles = ({ pageContext: { demoInfo } }) => (
  <Demo demoInfo={demoInfo} main={main}>
    <div className="bubbles-chart" id="chart" style={{ height: 600 }} />
  </Demo>
)

export default Bubbles
