import React from "react"

import { DemoPageProps, JQUERYUI } from "@/common"

import Demo from "@/components/demo"

import main, {
  CONTAINER_ID,
  ZOOM_SLIDER_ID,
} from "@/demos/concentric-circles/concentric-circles"

const ConcentricCircles = ({ pageContext }: DemoPageProps) => (
  <Demo
    links={[JQUERYUI.STYLE]}
    main={main}
    pageContext={pageContext}
    scripts={[JQUERYUI.SCRIPT]}
  >
    <div style={{ marginBottom: 20 }}>
      <p>Zoom</p>
      <div id={ZOOM_SLIDER_ID} />
    </div>
    <div id={CONTAINER_ID} />
  </Demo>
)

export default ConcentricCircles
