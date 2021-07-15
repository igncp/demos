import React from "react"

import { DemoPageProps } from "@/common"

import Demo from "@/components/demo"

import main from "@/demos/world-map/world-map"

const WorldMap = ({ pageContext: { demoInfo } }: DemoPageProps) => (
  <Demo demoInfo={demoInfo} main={main}>
    <div className="world-map-chart" id="chart" />
  </Demo>
)

export default WorldMap
