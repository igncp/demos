import React from "react"

import { DemoPageProps } from "@/common"

import Demo from "@/components/demo"

import main, { CONTAINER_ID } from "@/demos/bars-3dimensional/bars-3dimensional"

const Bars3Dimensional = ({ pageContext }: DemoPageProps) => (
  <Demo main={main} pageContext={pageContext}>
    <div
      style={{
        marginBottom: 20,
        textAlign: "center",
      }}
    >
      <a className="btn btn-info animate-bars" href="">
        Change Series
      </a>
    </div>
    <div id={CONTAINER_ID} />
  </Demo>
)

export default Bars3Dimensional
