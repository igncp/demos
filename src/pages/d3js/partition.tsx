import React from "react"

import { DemoPageProps } from "@/common"

import Demo from "@/components/demo"

import main, { CONTAINER_ID, TYPE_FORM } from "@/demos/partition/partition"
import * as styles from "@/demos/partition/partition-page.module.css"

const Partition = ({ pageContext }: DemoPageProps) => (
  <Demo main={main} pageContext={pageContext}>
    <form id={TYPE_FORM} style={{ marginBottom: 20 }}>
      <label className={styles.label}>
        <input
          className="form-check-inpu"
          name="mode"
          type="radio"
          value="size"
        />{" "}
        Size
      </label>
      <label className={styles.label}>
        <input defaultChecked name="mode" type="radio" value="count" /> Count
      </label>
    </form>
    <div id={CONTAINER_ID} />
  </Demo>
)

export default Partition
