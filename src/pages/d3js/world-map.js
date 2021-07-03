import React from "react"

import Demo from "@/components/demo"

import main from "@/demos/world-map/world-map"

const WorldMap = ({ pageContext: { demoInfo } }) => (
  <Demo
    demoInfo={demoInfo}
    main={main}
    scripts={["/vendors/d3/d3.min.js", "/vendors/topojson/topojson.js"]}
  >
    <div className="world-map-chart" id="chart" />
  </Demo>
)

export default WorldMap
