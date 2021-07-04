import React from "react"

import Demo from "@/components/demo"

import main from "@/demos/circular-arcs/circular-arcs"
import "@/demos/circular-arcs/circular-arcs.styl"

const CircularArcs = ({ pageContext: { demoInfo } }) => (
  <Demo
    demoInfo={demoInfo}
    main={main}
    scripts={["/vendors/raphael/raphael-min.js"]}
  >
    <div className="circular-arcs-chart" id="chart" />
  </Demo>
)

export default CircularArcs
