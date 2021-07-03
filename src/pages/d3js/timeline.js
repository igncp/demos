import React from "react"

import Demo from "@/components/demo"

import main from "@/demos/timeline/timeline"

import "@/demos/timeline/timeline.styl"

const Timeline = ({ pageContext: { demoInfo } }) => (
  <Demo
    demoInfo={demoInfo}
    main={main}
    scripts={["/vendors/d3/d3.min.js", "/js/d3js-utils.js"]}
  >
    <div className="timeline-chart" id="chart" />
  </Demo>
)

export default Timeline
