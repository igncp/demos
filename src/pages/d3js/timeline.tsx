import React from "react"

import { DemoPageProps } from "@/common"

import Demo from "@/components/demo"

import main from "@/demos/timeline/timeline"

const Timeline = ({ pageContext }: DemoPageProps) => (
  <Demo
    links={["/vendors/jquery-ui/themes/base/jquery-ui.min.css"]}
    main={main}
    pageContext={pageContext}
    scripts={["/vendors/jquery-ui/jquery-ui.min.js"]}
  >
    <div id="chart" />
  </Demo>
)

export default Timeline
