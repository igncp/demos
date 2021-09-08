import React from "react"

import { DemoPageProps, JQUERYUI } from "@/common"

import Demo from "@/components/demo"

import main, { CONTAINER_ID } from "@/demos/area/area"
import { BUTTON_ID } from "@/demos/area/income-chart-controls"

const Area = ({ pageContext }: DemoPageProps) => (
  <Demo
    links={[JQUERYUI.STYLE]}
    main={main}
    pageContext={pageContext}
    scripts={[JQUERYUI.SCRIPT]}
  >
    <form>
      <button className="btn btn-info" id={BUTTON_ID} type="button">
        Toggle Voronoi
      </button>
    </form>
    <div id={CONTAINER_ID} />
  </Demo>
)

export default Area
