import React from "react"

import { DemoPageProps } from "@/common"

import Demo from "@/components/demo"

import main from "@/demos/icosahedron/icosahedron"

const Icosahedron = ({ pageContext }: DemoPageProps) => (
  <Demo
    main={main}
    pageContext={pageContext}
    scripts={["/vendors/d3/d3.min.js"]}
  >
    <div id="chart" />
  </Demo>
)

export default Icosahedron
