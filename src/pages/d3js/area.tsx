import React from "react"

import { DemoPageProps } from "@/common"

import Demo from "@/components/demo"

import main, {
  CONTAINER_ID,
  DATA_SOURCE_SELECT_ID,
  TOGGLE_BUTTON_ID,
  UPDATE_BUTTON_ID,
} from "@/demos/area/area"
import * as styles from "@/demos/area/area-page.module.css"

const Area = ({ pageContext }: DemoPageProps) => (
  <Demo main={main} pageContext={pageContext}>
    <form className={styles.form}>
      <select className="form-select" id={DATA_SOURCE_SELECT_ID} />
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
