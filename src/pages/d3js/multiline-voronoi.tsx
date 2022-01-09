import React from "react"

import { DemoPageProps } from "@/common"

import Demo from "@/components/demo"

import main, {
  CONTAINER_ID,
  SHOW_VORONOI_ID,
} from "@/demos/multiline-voronoi/multiline-voronoi"
import * as styles from "@/demos/multiline-voronoi/multiline-voronoi.module.css"

const MultilineVoronoi = ({ pageContext }: DemoPageProps) => (
  <Demo main={main} pageContext={pageContext}>
    <form id={styles.formVoronoi}>
      <input
        className="form-check-input"
        id={SHOW_VORONOI_ID}
        type="checkbox"
      />{" "}
      <label htmlFor={SHOW_VORONOI_ID}>Show Voronoi lines</label>
    </form>
    <div id={CONTAINER_ID} />
  </Demo>
)

export default MultilineVoronoi
