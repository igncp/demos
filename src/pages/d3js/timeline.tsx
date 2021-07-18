import React from "react"

import { DemoPageProps } from "@/common"

import Demo from "@/components/demo"

// @ts-ignore
import main from "@/demos/timeline/timeline"

const Timeline = ({ pageContext: { demoInfo } }: DemoPageProps) => (
  <Demo
    demoInfo={demoInfo}
    links={["/vendors/jquery-ui/themes/base/jquery-ui.min.css"]}
    main={main}
    scripts={["/vendors/jquery-ui/jquery-ui.min.js"]}
  >
    <div id="chart" />
  </Demo>
)

export default Timeline
