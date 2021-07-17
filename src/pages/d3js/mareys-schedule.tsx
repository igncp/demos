import React from "react"

import { DemoPageProps } from "@/common"

import Demo from "@/components/demo"

// @ts-ignore
import main from "@/demos/mareys-schedule/mareys-schedule"

import "@/demos/mareys-schedule/mareys-schedule.styl"

const MareysSchedule = ({ pageContext: { demoInfo } }: DemoPageProps) => (
  <Demo
    demoInfo={demoInfo}
    links={[
      "/vendors/jquery-ui/themes/base/theme.css",
      "/vendors/jquery-ui/themes/base/slider.css",
    ]}
    main={main}
    scripts={[
      "/vendors/jquery-ui/jquery-ui.min.js",
      "/vendors/jquery-ui/ui/slider.js",
    ]}
  >
    <div>
      <div className="slider" />
    </div>
    <div id="chart" />
  </Demo>
)

export default MareysSchedule
