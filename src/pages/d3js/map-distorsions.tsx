import React from "react"

import { DemoPageProps } from "@/common"

import Demo from "@/components/demo"

import main from "@/demos/map-distorsions/map-distorsions"

import "@/demos/map-distorsions/map-distorsions.styl"

const MapDistorsions = ({ pageContext: { demoInfo } }: DemoPageProps) => (
  <Demo demoInfo={demoInfo} main={main}>
    <div id="chart" />
  </Demo>
)

export default MapDistorsions