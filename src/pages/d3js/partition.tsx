import React from "react"

import { DemoPageProps } from "@/common"

import Demo from "@/components/demo"

import main from "@/demos/partition/partition"

const Partition = ({ pageContext: { demoInfo } }: DemoPageProps) => (
  <Demo demoInfo={demoInfo} main={main}>
    <form id="type-form">
      <label>
        <input name="mode" type="radio" value="size" /> Size
      </label>
      <label>
        <input defaultChecked name="mode" type="radio" value="count" /> Count
      </label>
    </form>
    <div id="chart" />
  </Demo>
)

export default Partition
