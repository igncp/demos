import React from "react"

import { DemoPageProps } from "@/common"

import Demo from "@/components/demo"

import main, { CONTAINER_ID } from "@/demos/chord/chord"

const Chord = ({ pageContext }: DemoPageProps) => (
  <Demo
    links={["/vendors/jquery-ui/themes/base/jquery-ui.min.css"]}
    main={main}
    pageContext={pageContext}
    scripts={["/vendors/jquery-ui/jquery-ui.min.js"]}
  >
    <div id={CONTAINER_ID} />
  </Demo>
)

export default Chord
