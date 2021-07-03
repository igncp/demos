import React from "react"

import Demo from "@/components/demo"

import main from "@/demos/fish-eye/fish-eye"

import "@/demos/fish-eye/fish-eye.styl"

const FishEye = ({ pageContext: { demoInfo } }) => (
  <Demo
    demoInfo={demoInfo}
    main={main}
    scripts={[
      "/vendors/d3/d3.min.js",
      "/vendors/d3-plugins/fisheye/fisheye.js",
      "/js/d3js-utils.js",
    ]}
  >
    <div className="fish-eye-chart" id="chart" />
  </Demo>
)

export default FishEye
