import React from "react"

import Demo from "@/components/demo"

import main from "@/demos/partition/partition"

const Partition = ({ pageContext: { demoInfo } }) => (
  <Demo demoInfo={demoInfo} main={main} scripts={["/vendors/d3/d3.min.js"]}>
    <form>
      <label>
        <input name="mode" type="radio" value="size" /> Size
      </label>
      <label>
        <input defaultChecked name="mode" type="radio" value="count" /> Count
      </label>
    </form>
    <div className="partition-chart" id="chart" />
  </Demo>
)

export default Partition
