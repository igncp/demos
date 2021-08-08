import React from "react"

import { DemoPageProps } from "@/common"

import Demo from "@/components/demo"

import main from "@/demos/expenses-chord/expenses-chord"
import * as styles from "@/demos/expenses-chord/expenses-chord.module.css"

const ExpensesChord = ({ pageContext }: DemoPageProps) => (
  <Demo
    links={["/vendors/jquery-ui/themes/base/jquery-ui.min.css"]}
    main={main}
    pageContext={pageContext}
    scripts={["/vendors/jquery-ui/jquery-ui.min.js"]}
  >
    <div>Time Item:</div>
    <div className={styles.sliderTime} id="slider-time" />
    <p>
      <span>Countries:</span>
      <select className={styles.countriesSelect} id="countries-select" />
      <span>Regions:</span>
      <select id="regions-select" />
    </p>
    <div id="chart" />
  </Demo>
)

export default ExpensesChord
