import React from "react"

import { DemoPageProps } from "@/common"

import Demo from "@/components/demo"

import main from "@/demos/collapsible-tree/collapsible-tree"

const CollapsibleTree = ({ pageContext }: DemoPageProps) => (
  <Demo main={main} pageContext={pageContext}>
    <div id="chart" />
  </Demo>
)

export default CollapsibleTree
