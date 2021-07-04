import React from "react"

import Demo from "@/components/demo"

import main from "@/demos/bars/bars"

import "@/demos/bars/bars.styl"

const Bars = ({ pageContext: { demoInfo } }) => (
  <Demo demoInfo={demoInfo} main={main}>
    <form>
      <button className="btn btn-info" id="add-item" type="button">
        Add item
      </button>
    </form>
    <div className="bars-chart" id="chart" />
  </Demo>
)

export default Bars
