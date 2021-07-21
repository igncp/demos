import React from "react"

import { DemoPageProps } from "@/common"

import Demo from "@/components/demo"

import main from "@/demos/multiline-voronoi/multiline-voronoi"

const MultilineVoronoi = ({ pageContext: { demoInfo } }: DemoPageProps) => (
  <Demo demoInfo={demoInfo} main={main}>
    <form>
      <input id="show-voronoi" type="checkbox" />{" "}
      <label htmlFor="show-voronoi">Show Voronoi lines</label>
    </form>
    <div id="chart" />
  </Demo>
)

export default MultilineVoronoi
