import React from "react"

import Demo from "@/components/demo"

import main from "@/demos/collapsible-tree/collapsible-tree"

import "@/demos/collapsible-tree/collapsible-tree.styl"

const CollapsibleTree = ({ pageContext: { demoInfo } }) => (
  <Demo demoInfo={demoInfo} main={main}>
    <div className="collapsible-tree-chart" id="chart" />
  </Demo>
)

export default CollapsibleTree
