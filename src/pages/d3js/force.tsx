import React from "react"

import { DemoPageProps } from "@/common"

import Demo from "@/components/demo"

import main from "@/demos/force/force"
import "@/demos/force/force.styl"

const Force = ({ pageContext: { demoInfo } }: DemoPageProps) => (
  <Demo demoInfo={demoInfo} main={main}>
    <div id="chart" />
  </Demo>
)

export default Force
