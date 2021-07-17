import React from "react"

import { DemoPageProps } from "@/common"

import Demo from "@/components/demo"

import main from "@/demos/fish-eye/fish-eye"

import "@/demos/fish-eye/fish-eye.styl"

const FishEye = ({ pageContext: { demoInfo } }: DemoPageProps) => (
  <Demo demoInfo={demoInfo} main={main}>
    <div id="chart" />
  </Demo>
)

export default FishEye
