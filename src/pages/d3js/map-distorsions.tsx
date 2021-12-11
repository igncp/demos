import React from "react"

import { DemoPageProps } from "@/common"

import Demo from "@/components/demo"

import main, { CONTAINER_ID } from "@/demos/map-distorsions/map-distorsions"

const MapDistorsions = ({ pageContext }: DemoPageProps) => (
  <Demo main={main} pageContext={pageContext}>
    <div id={CONTAINER_ID} />
  </Demo>
)

export default MapDistorsions
