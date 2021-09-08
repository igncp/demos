import React from "react"

import { DemoPageProps } from "@/common"

import Demo from "@/components/demo"

import main, { CONTAINER_ID } from "@/demos/vectors/vectors"

const Vectors = ({ pageContext }: DemoPageProps) => (
  <Demo
    main={main}
    pageContext={pageContext}
    scripts={["/vendors/d3/d3.min.js"]}
  >
    <div id={CONTAINER_ID} />
  </Demo>
)

export default Vectors
