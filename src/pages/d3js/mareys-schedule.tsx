import React from "react"

import { DemoPageProps } from "@/common"

import Demo from "@/components/demo"

// @ts-ignore
import main from "@/demos/mareys-schedule/mareys-schedule"

const MareysSchedule = ({ pageContext: { demoInfo } }: DemoPageProps) => (
  <Demo
    demoInfo={demoInfo}
    links={["/vendors/jquery-ui/themes/base/jquery-ui.min.css"]}
    main={main}
    scripts={["/vendors/jquery-ui/jquery-ui.min.js"]}
  >
    <div>
      <div className="slider" />
    </div>
    <div id="chart" />
  </Demo>
)

export default MareysSchedule
