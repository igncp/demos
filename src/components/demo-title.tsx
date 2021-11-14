import React from "react"

import * as styles from "@/components/styles/styles.module.css"

type Props = {
  isCompleted: boolean
  mainSource: string
  name: string
}

const DemoTitle = ({ isCompleted, mainSource, name }: Props) => (
  <h2 className="row" id={styles.demoTitle}>
    <span className="col-xs-12 col-sm-10">
      <span className={styles.demoName}>{name} Chart </span>
      <small id={styles.mainSource} title="Main Source">
        <a href={mainSource}>···</a>
      </small>
      {!isCompleted && (
        <small id={styles.demoWip} title="This demo is still work in progress">
          WIP
        </small>
      )}
    </span>
    <span className={`col-sm-2 d-xs-none ${styles.backHome}`}>
      <a className="btn btn-default" href={ROOT_PATH}>
        <span className="glyphicon glyphicon-home" /> Home
      </a>
    </span>
  </h2>
)

export default DemoTitle
