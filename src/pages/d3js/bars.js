import React from "react"

import Demo from "@/components/demo"

import main from "@/demos/bars/bars"

import "@/demos/bars/bars.styl"

const Bars = ({ pageContext: { demoInfo } }) => (
  <Demo demoInfo={demoInfo} main={main} scripts={["/vendors/d3/d3.min.js"]}>
    <form>
      <button className="btn btn-info" id="add-item" type="button">
        Add item
      </button>
    </form>
    <div className="bars-chart" id="chart" />
  </Demo>
)

export default Bars
