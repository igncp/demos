import React from "react"

import { DemoPageProps } from "@/common"

import Demo from "@/components/demo"

import main from "@/demos/moving-line/moving-line"
import "@/demos/moving-line/moving-line.styl"

const CircularArcs = ({ pageContext: { demoInfo } }: DemoPageProps) => (
  <Demo demoInfo={demoInfo} main={main}>
    <div id="chart" />
  </Demo>
)

export default CircularArcs
