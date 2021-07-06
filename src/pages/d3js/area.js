import React from "react"

import Demo from "@/components/demo"

import main from "@/demos/area/area"

import "@/demos/area/area.styl"

const Area = ({ pageContext: { demoInfo } }) => (
  <Demo demoInfo={demoInfo} main={main}>
    <form>
      <button className="btn btn-info" id="toggle-voronoi" type="button">
        Toggle Voronoi
      </button>
    </form>
    <div className="area-chart" id="chart" />
  </Demo>
)

export default Area
