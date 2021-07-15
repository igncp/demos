import React from "react"

import { DemoPageProps } from "@/common"

import Demo from "@/components/demo"

import main from "@/demos/area/area"

import "@/demos/area/area.styl"

const Area = ({ pageContext: { demoInfo } }: DemoPageProps) => (
  <Demo demoInfo={demoInfo} main={main}>
    <form>
      <button className="btn btn-info" id="toggle-voronoi" type="button">
        Toggle Voronoi
      </button>
    </form>
    <div id="chart" />
  </Demo>
)

export default Area
