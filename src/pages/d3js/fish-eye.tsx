import React from "react"

import { DemoPageProps } from "@/common"

import Demo from "@/components/demo"

import main, { CONTAINER_ID, RANDOM_UPDATE_ID } from "@/demos/fish-eye/fish-eye"

const FishEye = ({ pageContext }: DemoPageProps) => (
  <Demo main={main} pageContext={pageContext}>
    <div style={{ marginBottom: 20, textAlign: "center" }}>
      <button className="btn btn-primary" id={RANDOM_UPDATE_ID}>
        Update random values
      </button>
    </div>
    <div id={CONTAINER_ID} />
  </Demo>
)

export default FishEye
