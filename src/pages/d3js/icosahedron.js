import React from "react"

import Demo from "@/components/demo"

import main from "@/demos/icosahedron/icosahedron"

import "@/demos/icosahedron/icosahedron.styl"

const Icosahedron = ({ pageContext: { demoInfo } }) => (
  <Demo demoInfo={demoInfo} main={main} scripts={["/vendors/d3/d3.min.js"]}>
    <div className="icosahedron-chart" id="chart" />
  </Demo>
)

export default Icosahedron
