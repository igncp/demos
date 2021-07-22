import React from "react"

import { DemoPageProps } from "@/common"

import Demo from "@/components/demo"

import main from "@/demos/circular-arcs/circular-arcs"

const CircularArcs = ({ pageContext }: DemoPageProps) => (
  <Demo main={main} pageContext={pageContext}>
    <div id="chart" />
  </Demo>
)

export default CircularArcs
