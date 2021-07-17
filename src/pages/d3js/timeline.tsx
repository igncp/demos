import React from "react"

import { DemoPageProps } from "@/common"

import Demo from "@/components/demo"

// @ts-ignore
import main from "@/demos/timeline/timeline"

import "@/demos/timeline/timeline.styl"

const Timeline = ({ pageContext: { demoInfo } }: DemoPageProps) => (
  <Demo demoInfo={demoInfo} main={main} scripts={["/vendors/d3/d3.min.js"]}>
    <div id="chart" />
  </Demo>
)

export default Timeline
