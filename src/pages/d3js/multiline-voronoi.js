import React from "react"

import Demo from "@/components/demo"

import main from "@/demos/multiline-voronoi/multiline-voronoi"
import "@/demos/multiline-voronoi/multiline-voronoi.styl"

const MultilineVoronoi = ({ pageContext: { demoInfo } }) => (
  <Demo demoInfo={demoInfo} main={main} scripts={["/vendors/d3/d3.min.js"]}>
    <form>
      <input id="show-voronoi" type="checkbox" />{" "}
      <label htmlFor="show-voronoi">Show Voronoi lines</label>
    </form>
    <div className="multiline-voronoi-chart" id="chart" />
  </Demo>
)

export default MultilineVoronoi
