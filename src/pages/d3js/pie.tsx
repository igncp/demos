import React from "react"

import { DemoPageProps, JQUERYUI } from "@/common"

import Demo from "@/components/demo"

import main, { BUTTON_ID, CONTAINER_ID } from "@/demos/pie/pie"
import * as styles from "@/demos/pie/pie-chart.module.css"

const Pie = ({ pageContext }: DemoPageProps) => (
  <Demo
    links={[JQUERYUI.STYLE]}
    main={main}
    pageContext={pageContext}
    scripts={[JQUERYUI.SCRIPT]}
  >
    <form className={styles.form}>
      <button className="btn btn-success" id={BUTTON_ID} type="button">
        Update Slice
      </button>
    </form>
    <div id={CONTAINER_ID} />
  </Demo>
)

export default Pie
