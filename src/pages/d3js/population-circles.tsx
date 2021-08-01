import React from "react"

import { DemoPageProps } from "@/common"

import Demo from "@/components/demo"

import main from "@/demos/population-circles/population-circles"
import * as styles from "@/demos/population-circles/population-circles.module.css"

const PopulationCircles = ({ pageContext }: DemoPageProps) => (
  <Demo
    links={["/vendors/jquery-ui/themes/base/jquery-ui.min.css"]}
    main={main}
    pageContext={pageContext}
    scripts={["/vendors/jquery-ui/jquery-ui.min.js"]}
  >
    <form>
      {[
        { id: "total", label: "Total" },
        { id: "males", label: "Males" },
        { id: "females", label: "Females" },
      ].map(({ id, label }, radioIndex) => (
        <div className={styles.radio} key={id}>
          <input
            defaultChecked={radioIndex === 0}
            id={id}
            name="type"
            type="radio"
            value={id}
          />
          <label htmlFor={id}>{label}</label>
        </div>
      ))}
    </form>
    <div className={styles.slider}>
      <p>Time</p>
      <div className="time-slider" />
    </div>
    <div className={styles.slider}>
      <p>Population Percentile</p>
      <div className="population-slider" />
    </div>
    <div id="chart" />
  </Demo>
)

export default PopulationCircles
