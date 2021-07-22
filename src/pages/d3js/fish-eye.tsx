import React from "react"

import { DemoPageProps } from "@/common"

import Demo from "@/components/demo"

import main from "@/demos/fish-eye/fish-eye"

const FishEye = ({ pageContext }: DemoPageProps) => (
  <Demo main={main} pageContext={pageContext}>
    <div id="chart" />
  </Demo>
)

export default FishEye
