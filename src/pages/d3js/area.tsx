import React from "react"

import { DemoPageProps } from "@/common"

import Demo from "@/components/demo"

import main from "@/demos/area/area"

const Area = ({ pageContext }: DemoPageProps) => (
  <Demo main={main} pageContext={pageContext}>
    <form>
      <button className="btn btn-info" id="toggle-voronoi" type="button">
        Toggle Voronoi
      </button>
    </form>
    <div id="chart" />
  </Demo>
)

export default Area
