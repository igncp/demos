import React from "react"

import Demo from "@/components/demo"

import main from "@/demos/map-distorsions/map-distorsions"

import "@/demos/map-distorsions/map-distorsions.styl"

const MapDistorsions = ({ pageContext: { demoInfo } }) => (
  <Demo
    demoInfo={demoInfo}
    main={main}
    scripts={["/vendors/d3/d3.min.js", "/js/d3js-utils.js"]}
  >
    <div className="map-distorsions-chart" id="chart" />
  </Demo>
)

export default MapDistorsions
