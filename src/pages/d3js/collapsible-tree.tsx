import React from "react"

import { DemoPageProps } from "@/common"

import Demo from "@/components/demo"

import main from "@/demos/collapsible-tree/collapsible-tree"

import "@/demos/collapsible-tree/collapsible-tree.styl"

const CollapsibleTree = ({ pageContext: { demoInfo } }: DemoPageProps) => (
  <Demo demoInfo={demoInfo} main={main}>
    <div id="chart" />
  </Demo>
)

export default CollapsibleTree
