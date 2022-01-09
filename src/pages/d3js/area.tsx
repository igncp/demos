import React from "react"

import { DemoPageProps } from "@/common"

import Demo from "@/components/demo"

import main, { CONTAINER_ID } from "@/demos/area/area"
import * as styles from "@/demos/area/area-page.module.css"
import {
  TOGGLE_BUTTON_ID,
  UPDATE_BUTTON_ID,
} from "@/demos/area/income-chart-controls"

const Area = ({ pageContext }: DemoPageProps) => (
  <Demo main={main} pageContext={pageContext}>
    <form className={styles.form}>
      <button className="btn btn-info" id={TOGGLE_BUTTON_ID} type="button">
        Toggle Voronoi
      </button>
      <button className="btn btn-success" id={UPDATE_BUTTON_ID} type="button">
        Update Random Values
      </button>
    </form>
    <div id={CONTAINER_ID} />
  </Demo>
)

export default Area
