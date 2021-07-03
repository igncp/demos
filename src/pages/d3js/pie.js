import React from "react"

import Demo from "@/components/demo"

import main from "@/demos/pie/pie"

const Pie = ({ pageContext: { demoInfo } }) => (
  <Demo demoInfo={demoInfo} main={main} scripts={["/vendors/d3/d3.min.js"]}>
    <form>
      <button className="btn btn-success" id="change-data" type="button">
        Change
      </button>
    </form>
    <div className="pie-chart" id="chart" />
  </Demo>
)

export default Pie
