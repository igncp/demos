import React from "react"

import Demo from "@/components/demo"

import main from "@/demos/spain-map/spain-map"

const SpainMap = ({ pageContext: { demoInfo } }) => (
  <Demo
    demoInfo={demoInfo}
    main={main}
    scripts={["/vendors/d3/d3.min.js", "/vendors/topojson/topojson.js"]}
  >
    <div className="spain-map-chart" id="chart" />
  </Demo>
)

export default SpainMap
