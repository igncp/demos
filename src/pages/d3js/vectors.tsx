import React from "react"

import { DemoPageProps } from "@/common"

import Demo from "@/components/demo"

import main from "@/demos/vectors/vectors"

const Vectors = ({ pageContext: { demoInfo } }: DemoPageProps) => (
  <Demo demoInfo={demoInfo} main={main} scripts={["/vendors/d3/d3.min.js"]}>
    <div id="chart" />
  </Demo>
)

export default Vectors
