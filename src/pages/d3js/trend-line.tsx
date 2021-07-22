import React from "react"

import { DemoPageProps } from "@/common"

import Demo from "@/components/demo"

import main from "@/demos/trend-line/trend-line"

const TrendLine = ({ pageContext }: DemoPageProps) => (
  <Demo main={main} pageContext={pageContext}>
    <form>
      <label>
        <input defaultChecked name="mode" type="radio" value="zoom" /> Zoom
      </label>
      <label>
        <input name="mode" type="radio" value="normal" /> Normal
      </label>
    </form>
    <div id="chart" />
  </Demo>
)

export default TrendLine
