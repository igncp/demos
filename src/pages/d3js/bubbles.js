import React from "react"

import Demo from "@/components/demo"

import main from "@/demos/bubbles/bubbles"

import "../../demos/bubbles/bubbles.styl"

const Bubbles = ({ pageContext: { demoInfo } }) => (
  <Demo
    demoInfo={demoInfo}
    links={["/vendors/nvd3/nv.d3.min.css"]}
    main={main}
    scripts={["/vendors/d3/d3.min.js", "/vendors/nvd3/nv.d3.min.js"]}
  >
    <div className="bubbles-chart" id="chart" style={{ height: 600 }} />
  </Demo>
)

export default Bubbles
