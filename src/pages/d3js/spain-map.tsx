import React from "react"

import { DemoPageProps, JQUERYUI } from "@/common"

import Demo from "@/components/demo"

import main, { CONTAINER_ID } from "@/demos/spain-map/spain-map"

const SpainMap = ({ pageContext }: DemoPageProps) => (
  <Demo
    links={[JQUERYUI.STYLE]}
    main={main}
    pageContext={pageContext}
    scripts={[JQUERYUI.SCRIPT]}
  >
    <div id={CONTAINER_ID} />
  </Demo>
)

export default SpainMap
