import React from "react"

import Demo from "@/components/demo"

import main from "@/demos/weekly-heatmap/weekly-heatmap"

import "@/demos/weekly-heatmap/weekly-heatmap.styl"

const WeeklyHeatmap = ({ pageContext: { demoInfo } }) => (
  <Demo
    demoInfo={demoInfo}
    main={main}
    scripts={["/vendors/d3/d3.min.js", "/js/d3js-utils.js"]}
  >
    <div className="weekly-heatmap-chart" id="chart" />
  </Demo>
)

export default WeeklyHeatmap
