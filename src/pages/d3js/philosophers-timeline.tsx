import React from "react"

import { DemoPageProps, JQUERYUI } from "@/common"

import Demo from "@/components/demo"

import main, {
  CONTAINER_ID,
} from "@/demos/philosophers-timeline/philosophers-timeline"

const PhilosophersTimeline = ({ pageContext }: DemoPageProps) => (
  <Demo
    links={[JQUERYUI.STYLE]}
    main={main}
    pageContext={pageContext}
    scripts={[JQUERYUI.SCRIPT]}
  >
    <div id={CONTAINER_ID} />
  </Demo>
)

export default PhilosophersTimeline
