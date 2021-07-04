import React from "react"

import Demo from "@/components/demo"

import main from "@/demos/pie/pie"

const Pie = ({ pageContext: { demoInfo } }) => (
  <Demo demoInfo={demoInfo} main={main}>
    <form>
      <button className="btn btn-success" id="change-data" type="button">
        Change
      </button>
    </form>
    <div className="pie-chart" id="chart" />
  </Demo>
)

export default Pie
