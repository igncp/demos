import React from "react"

import { DemoPageProps } from "@/common"

import Demo from "@/components/demo"

import main from "@/demos/bubbles/bubbles"

import "@/demos/bubbles/bubbles.styl"

const Bubbles = ({ pageContext: { demoInfo } }: DemoPageProps) => (
  <Demo demoInfo={demoInfo} main={main}>
    <div id="chart" style={{ height: 600 }} />
  </Demo>
)

export default Bubbles
