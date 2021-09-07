import React from "react"

import { DemoPageProps } from "@/common"

import Demo from "@/components/demo"

import main, { CONTAINER_ID } from "@/demos/weekly-heatmap/weekly-heatmap"

const WeeklyHeatmap = ({ pageContext }: DemoPageProps) => (
  <Demo
    links={["/vendors/jquery-ui/themes/base/jquery-ui.min.css"]}
    main={main}
    pageContext={pageContext}
    scripts={["/vendors/jquery-ui/jquery-ui.min.js"]}
  >
    <div id={CONTAINER_ID} />
  </Demo>
)

export default WeeklyHeatmap
