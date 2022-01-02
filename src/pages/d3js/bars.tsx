import React from "react"

import { DemoPageProps } from "@/common"

import Demo from "@/components/demo"

import main, { ADD_BAR_BUTTON_ID, CONTAINER_ID } from "@/demos/bars/bars"
import * as styles from "@/demos/bars/bars.module.css"

const Bars = ({ pageContext }: DemoPageProps) => (
  <Demo main={main} pageContext={pageContext}>
    <form>
      <button
        className={`btn btn-info ${styles.addItemButton}`}
        id={ADD_BAR_BUTTON_ID}
        type="button"
      >
        Add item
      </button>
    </form>
    <div id={CONTAINER_ID} />
  </Demo>
)

export default Bars
