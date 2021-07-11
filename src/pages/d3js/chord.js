import React from "react"

import Demo from "@/components/demo"

import main from "@/demos/chord/chord"

import "@/demos/chord/chord.styl"

const Chord = ({ pageContext: { demoInfo } }) => (
  <Demo demoInfo={demoInfo} main={main}>
    <div className="chord-chart" id="chart" />
  </Demo>
)

export default Chord
