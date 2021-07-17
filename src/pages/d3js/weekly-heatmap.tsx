import React from "react"

import { DemoPageProps } from "@/common"

import Demo from "@/components/demo"

import main from "@/demos/weekly-heatmap/weekly-heatmap"

import "@/demos/weekly-heatmap/weekly-heatmap.styl"

const WeeklyHeatmap = ({ pageContext: { demoInfo } }: DemoPageProps) => (
  <Demo demoInfo={demoInfo} main={main}>
    <div id="chart" />
  </Demo>
)

export default WeeklyHeatmap