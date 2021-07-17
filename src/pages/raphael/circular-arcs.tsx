import React from "react"

import { DemoPageProps } from "@/common"

import Demo from "@/components/demo"

import main from "@/demos/circular-arcs/circular-arcs"
import "@/demos/circular-arcs/circular-arcs.styl"

const CircularArcs = ({ pageContext: { demoInfo } }: DemoPageProps) => (
  <Demo demoInfo={demoInfo} main={main}>
    <div id="chart" />
  </Demo>
)

export default CircularArcs