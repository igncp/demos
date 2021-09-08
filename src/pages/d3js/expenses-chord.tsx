import React from "react"

import { DemoPageProps, JQUERYUI } from "@/common"

import Demo from "@/components/demo"

import main, { CONTAINER_ID } from "@/demos/expenses-chord/expenses-chord"
import * as styles from "@/demos/expenses-chord/expenses-chord.module.css"

const ExpensesChord = ({ pageContext }: DemoPageProps) => (
  <Demo
    links={[JQUERYUI.STYLE]}
    main={main}
    pageContext={pageContext}
    scripts={[JQUERYUI.SCRIPT]}
  >
    <div>Time Item:</div>
    <div className={styles.sliderTime} id="slider-time" />
    <p>
      <span>Countries:</span>
      <select className={styles.countriesSelect} id="countries-select" />
      <span>Regions:</span>
      <select id="regions-select" />
    </p>
    <div id={CONTAINER_ID} />
  </Demo>
)

export default ExpensesChord
