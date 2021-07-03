import React from "react"

import Demo from "@/components/demo"

import main from "@/demos/area/area"

import "@/demos/area/area.styl"

const Area = ({ pageContext: { demoInfo } }) => (
  <Demo
    demoInfo={demoInfo}
    main={main}
    scripts={["/vendors/d3/d3.min.js", "/js/d3js-utils.js"]}
  >
    <div className="area-chart" id="chart" />
  </Demo>
)

export default Area
