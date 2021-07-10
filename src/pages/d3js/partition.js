import React from "react"

import Demo from "@/components/demo"

import main from "@/demos/partition/partition"

const Partition = ({ pageContext: { demoInfo } }) => (
  <Demo demoInfo={demoInfo} main={main} scripts={["/vendors/d3/d3.min.js"]}>
    <div className="partition-chart" id="chart" />
  </Demo>
)

export default Partition
