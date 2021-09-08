import React from "react"

import { DemoPageProps, JQUERYUI } from "@/common"

import Demo from "@/components/demo"

import main, {
  CONTAINER_ID,
  RANGE_ID,
} from "@/demos/mareys-schedule/mareys-schedule"

const MareysSchedule = ({ pageContext }: DemoPageProps) => (
  <Demo
    links={[JQUERYUI.STYLE]}
    main={main}
    pageContext={pageContext}
    scripts={[JQUERYUI.SCRIPT]}
  >
    <div>
      <div id={RANGE_ID} />
    </div>
    <div id={CONTAINER_ID} />
  </Demo>
)

export default MareysSchedule
