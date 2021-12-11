import React from "react"

import { DemoPageProps } from "@/common"

import Demo from "@/components/demo"

import main, {
  CONTAINER_ID,
  UPDATE_BUTTON_ID,
} from "@/demos/spain-map/spain-map"

const SpainMap = ({ pageContext }: DemoPageProps) => (
  <Demo main={main} pageContext={pageContext}>
    <form style={{ marginBottom: 20 }}>
      <button className="btn btn-info" id={UPDATE_BUTTON_ID} type="button">
        Clear Clicked Regions
      </button>
    </form>
    <div id={CONTAINER_ID} />
  </Demo>
)

export default SpainMap
