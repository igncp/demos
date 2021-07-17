import React from "react"

import { DemoPageProps } from "@/common"

import Demo from "@/components/demo"

import main from "@/demos/concentric-circles/concentric-circles"

const ConcentricCircles = ({ pageContext: { demoInfo } }: DemoPageProps) => (
  <Demo demoInfo={demoInfo} main={main}>
    <div id="chart" />
  </Demo>
)

export default ConcentricCircles
