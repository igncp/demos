import React from "react"

import { DemoPageProps, JQUERYUI } from "@/common"

import Demo from "@/components/demo"

import main, {
  CONTAINER_ID,
  COUNTRIES_SELECT_ID,
  REGIONS_SELECT_ID,
  SLIDER_TIME_ID,
} from "@/demos/expenses-chord/expenses-chord"
import * as styles from "@/demos/expenses-chord/expenses-chord.module.css"

const ExpensesChord = ({ pageContext }: DemoPageProps) => (
  <Demo
    links={[JQUERYUI.STYLE]}
    main={main}
    pageContext={pageContext}
    scripts={[JQUERYUI.SCRIPT]}
  >
    <div>Time Item:</div>
    <div className={styles.sliderTime} id={SLIDER_TIME_ID} />
    <p>
      <span>Countries:</span>
      <select className={styles.countriesSelect} id={COUNTRIES_SELECT_ID} />
      <span>Regions:</span>
      <select id={REGIONS_SELECT_ID} />
    </p>
    <div id={CONTAINER_ID} />
  </Demo>
)

export default ExpensesChord
