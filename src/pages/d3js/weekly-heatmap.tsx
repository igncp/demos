import React from "react"

import { DemoPageProps } from "@/common"

import Demo from "@/components/demo"

import main from "@/demos/weekly-heatmap/weekly-heatmap"

const WeeklyHeatmap = ({ pageContext: { demoInfo } }: DemoPageProps) => (
  <Demo
    demoInfo={demoInfo}
    links={["/vendors/jquery-ui/themes/base/jquery-ui.min.css"]}
    main={main}
    scripts={["/vendors/jquery-ui/jquery-ui.min.js"]}
  >
    <div id="chart" />
  </Demo>
)

export default WeeklyHeatmap
