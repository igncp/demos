import React from "react"

import { DemoPageProps } from "@/common"

import Demo from "@/components/demo"

import main from "@/demos/chord/chord"

const Chord = ({ pageContext }: DemoPageProps) => (
  <Demo main={main} pageContext={pageContext}>
    <div id="chart" />
  </Demo>
)

export default Chord
