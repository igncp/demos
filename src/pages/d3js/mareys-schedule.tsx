import React from "react"

import { DemoPageProps } from "@/common"

import Demo from "@/components/demo"

import main, {
  CONTAINER_ID,
  RANGE_ID,
} from "@/demos/mareys-schedule/mareys-schedule"
import * as styles from "@/demos/mareys-schedule/mareys-schedule-page.module.css"

const MareysSchedule = ({ pageContext }: DemoPageProps) => (
  <Demo main={main} pageContext={pageContext}>
    <div className={styles.slider} id={RANGE_ID} />
    <div id={CONTAINER_ID} />
  </Demo>
)

export default MareysSchedule
