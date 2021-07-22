import React from "react"

import { DemoPageProps } from "@/common"

import Demo from "@/components/demo"

import main from "@/demos/world-map/world-map"

const WorldMap = ({ pageContext }: DemoPageProps) => (
  <Demo main={main} pageContext={pageContext}>
    <div className="world-map-chart" id="chart" />
  </Demo>
)

export default WorldMap
