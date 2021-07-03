import React from "react"

import Demo from "@/components/demo"

import main from "@/demos/vectors/vectors"

import "@/demos/vectors/vectors.styl"

const Vectors = ({ pageContext: { demoInfo } }) => (
  <Demo demoInfo={demoInfo} main={main} scripts={["/vendors/d3/d3.min.js"]}>
    <div className="vectors-chart" id="chart" />
  </Demo>
)

export default Vectors
