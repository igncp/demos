import React from "react"

import { DemoPageProps } from "@/common"

import Demo from "@/components/demo"

import main, {
  CONTAINER_ID,
  RANGE_ID,
} from "@/demos/mareys-schedule/mareys-schedule"

const MareysSchedule = ({ pageContext }: DemoPageProps) => (
  <Demo
    links={["/vendors/jquery-ui/themes/base/jquery-ui.min.css"]}
    main={main}
    pageContext={pageContext}
    scripts={["/vendors/jquery-ui/jquery-ui.min.js"]}
  >
    <div>
      <div id={RANGE_ID} />
    </div>
    <div id={CONTAINER_ID} />
  </Demo>
)

export default MareysSchedule
