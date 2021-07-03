import React from "react"

import Demo from "@/components/demo"

import main from "@/demos/collapsible-tree/collapsible-tree"

import "@/demos/collapsible-tree/collapsible-tree.styl"

const CollapsibleTree = ({ pageContext: { demoInfo } }) => (
  <Demo demoInfo={demoInfo} main={main} scripts={["/vendors/d3/d3.min.js"]}>
    <div className="collapsible-tree-chart" id="chart" />
  </Demo>
)

export default CollapsibleTree
