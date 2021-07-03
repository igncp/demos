import React from "react"

import Demo from "@/components/demo"

import main from "@/demos/mareys-schedule/mareys-schedule"

import "@/demos/mareys-schedule/mareys-schedule.styl"

const MareysSchedule = ({ pageContext: { demoInfo } }) => (
  <Demo
    demoInfo={demoInfo}
    links={[
      "/vendors/jquery-ui/themes/base/theme.css",
      "/vendors/jquery-ui/themes/base/slider.css",
    ]}
    main={main}
    scripts={[
      "/vendors/d3/d3.min.js",
      "/vendors/jquery-ui/jquery-ui.min.js",
      "/vendors/jquery-ui/ui/slider.js",
      "/js/d3js-utils.js",
    ]}
  >
    <div>
      <div className="slider" />
    </div>
    <div className="mareys-schedule-chart" id="chart" />
  </Demo>
)

export default MareysSchedule
