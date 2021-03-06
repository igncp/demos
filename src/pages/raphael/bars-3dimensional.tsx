import React from "react"

import { DemoPageProps } from "@/common"

import Demo from "@/components/demo"

import main from "@/demos/bars-3dimensional/bars-3dimensional"

const Bars3Dimensional = ({ pageContext: { demoInfo } }: DemoPageProps) => (
  <Demo demoInfo={demoInfo} main={main}>
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
    <div id="chart" />
  </Demo>
)

export default Bars3Dimensional
