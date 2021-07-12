import React from "react"

import Demo from "@/components/demo"

import main from "@/demos/trend-line/trend-line"

import "@/demos/trend-line/trend-line.styl"

const TrendLine = ({ pageContext: { demoInfo } }) => (
  <Demo demoInfo={demoInfo} main={main} scripts={["/vendors/d3/d3.min.js"]}>
    <form>
      <label>
        <input defaultChecked name="mode" type="radio" value="zoom" /> Zoom
      </label>
      <label>
        <input name="mode" type="radio" value="normal" /> Normal
      </label>
    </form>
    <div className="trend-line-chart" id="chart" />
  </Demo>
)

export default TrendLine
