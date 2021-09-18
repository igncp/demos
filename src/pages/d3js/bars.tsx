import React from "react"

import { DemoPageProps, JQUERYUI } from "@/common"

import Demo from "@/components/demo"

import main, { CONTAINER_ID } from "@/demos/bars/bars"
import * as styles from "@/demos/bars/bars.module.css"

const Bars = ({ pageContext }: DemoPageProps) => (
  <Demo
    links={[JQUERYUI.STYLE]}
    main={main}
    pageContext={pageContext}
    scripts={[JQUERYUI.SCRIPT]}
  >
    <form>
      <button className="btn btn-info" id={styles.addItemButton} type="button">
        Add item
      </button>
    </form>
    <div id={CONTAINER_ID} />
  </Demo>
)

export default Bars
