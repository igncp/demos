import React from "react"

import { DemoPageProps } from "@/common"

import Demo from "@/components/demo"

import main from "@/demos/spain-map/spain-map"

const SpainMap = ({ pageContext }: DemoPageProps) => (
  <Demo main={main} pageContext={pageContext}>
    <div id="chart" />
  </Demo>
)

export default SpainMap
