import React from "react"

import { DemoPageProps } from "@/common"

import Demo from "@/components/demo"

import main, { CONTAINER_ID } from "@/demos/partition/partition"

const Partition = ({ pageContext }: DemoPageProps) => (
  <Demo main={main} pageContext={pageContext}>
    <form id="type-form">
      <label>
        <input name="mode" type="radio" value="size" /> Size
      </label>
      <label>
        <input defaultChecked name="mode" type="radio" value="count" /> Count
      </label>
    </form>
    <div id={CONTAINER_ID} />
  </Demo>
)

export default Partition
