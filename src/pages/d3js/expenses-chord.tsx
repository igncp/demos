import React from "react"

import { DemoPageProps } from "@/common"

import Demo from "@/components/demo"

import main, {
  AUTOMATIC_TIME_ID,
  CONTAINER_ID,
  COUNTRIES_SELECT_ID,
  REGIONS_SELECT_ID,
  SLIDER_TIME_ID,
} from "@/demos/expenses-chord/expenses-chord"
import * as styles from "@/demos/expenses-chord/expenses-page.module.css"

const ExpensesChord = ({ pageContext }: DemoPageProps) => (
  <Demo main={main} pageContext={pageContext}>
    <div className={styles.sliderRow}>
      <div className={styles.label}>Time Item:</div>
      <div className={styles.sliderTime} id={SLIDER_TIME_ID} />
    </div>
    <div className={styles.selectRow}>
      <span>
        <span className={styles.label}>Countries:</span>
        <select className="form-select" id={COUNTRIES_SELECT_ID} />
      </span>
      <span>
        <span className={styles.label}>Regions:</span>
        <select className="form-select" id={REGIONS_SELECT_ID} />
      </span>
      <span>
        <span className={styles.label}>Automatic Time Change:</span>
        <input
          className="form-check-input"
          id={AUTOMATIC_TIME_ID}
          type="checkbox"
        />
      </span>
    </div>
    <div id={CONTAINER_ID} />
  </Demo>
)

export default ExpensesChord
