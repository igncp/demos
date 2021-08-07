import React from "react"

import { DemoPageProps } from "@/common"

import Demo from "@/components/demo"

import main from "@/demos/area/area"

const Area = ({ pageContext }: DemoPageProps) => (
  <Demo
    links={["/vendors/jquery-ui/themes/base/jquery-ui.min.css"]}
    main={main}
    pageContext={pageContext}
    scripts={["/vendors/jquery-ui/jquery-ui.min.js"]}
  >
    <form>
      <button className="btn btn-info" id="toggle-voronoi" type="button">
        Toggle Voronoi
      </button>
    </form>
    <div id="chart" />
  </Demo>
)

export default Area
