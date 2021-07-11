import React from "react"

import Demo from "@/components/demo"

import main from "@/demos/fish-eye/fish-eye"

import "@/demos/fish-eye/fish-eye.styl"

const FishEye = ({ pageContext: { demoInfo } }) => (
  <Demo demoInfo={demoInfo} main={main}>
    <div className="fish-eye-chart" id="chart" />
  </Demo>
)

export default FishEye
