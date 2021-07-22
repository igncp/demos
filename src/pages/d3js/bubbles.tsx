import React from "react"

import { DemoPageProps } from "@/common"

import Demo from "@/components/demo"

import main from "@/demos/bubbles/bubbles"

const Bubbles = ({ pageContext }: DemoPageProps) => (
  <Demo main={main} pageContext={pageContext}>
    <div id="chart" style={{ height: 600 }} />
  </Demo>
)

export default Bubbles
