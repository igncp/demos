import React from "react"

import { DemoPageProps } from "@/common"

import Demo from "@/components/demo"

import main, { CONTAINER_ID } from "@/demos/multiline-voronoi/multiline-voronoi"

const MultilineVoronoi = ({ pageContext }: DemoPageProps) => (
  <Demo main={main} pageContext={pageContext}>
    <form id="form">
      <input id="show-voronoi" type="checkbox" />{" "}
      <label htmlFor="show-voronoi">Show Voronoi lines</label>
    </form>
    <div id={CONTAINER_ID} />
  </Demo>
)

export default MultilineVoronoi
