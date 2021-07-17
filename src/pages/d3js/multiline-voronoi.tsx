import React from "react"

import { DemoPageProps } from "@/common"

import Demo from "@/components/demo"

// @ts-ignore
import main from "@/demos/multiline-voronoi/multiline-voronoi"

import "@/demos/multiline-voronoi/multiline-voronoi.styl"

const MultilineVoronoi = ({ pageContext: { demoInfo } }: DemoPageProps) => (
  <Demo demoInfo={demoInfo} main={main} scripts={["/vendors/d3/d3.min.js"]}>
    <form>
      <input id="show-voronoi" type="checkbox" />{" "}
      <label htmlFor="show-voronoi">Show Voronoi lines</label>
    </form>
    <div id="chart" />
  </Demo>
)

export default MultilineVoronoi
