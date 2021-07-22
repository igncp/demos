import React from "react"

import { DemoPageProps } from "@/common"

import Demo from "@/components/demo"

import main from "@/demos/pie/pie"

const Pie = ({ pageContext }: DemoPageProps) => (
  <Demo main={main} pageContext={pageContext}>
    <form>
      <button className="btn btn-success" id="change-data" type="button">
        Change
      </button>
    </form>
    <div id="chart" />
  </Demo>
)

export default Pie
