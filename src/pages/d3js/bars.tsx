import React from "react"

import { DemoPageProps } from "@/common"

import Demo from "@/components/demo"

import main from "@/demos/bars/bars"

import "@/demos/bars/bars.styl"

const Bars = ({ pageContext: { demoInfo } }: DemoPageProps) => (
  <Demo demoInfo={demoInfo} main={main}>
    <form>
      <button className="btn btn-info" id="add-item" type="button">
        Add item
      </button>
    </form>
    <div id="chart" />
  </Demo>
)

export default Bars
