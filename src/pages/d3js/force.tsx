import React from "react"

import { DemoPageProps } from "@/common"

import Demo from "@/components/demo"

import main, { CONTAINER_ID, RADIUS_SELECT_ID } from "@/demos/force/force"
import * as style from "@/demos/force/force-page.module.css"

const Force = ({ pageContext }: DemoPageProps) => (
  <Demo main={main} pageContext={pageContext}>
    <form className={style.form}>
      <span>Radius: </span>
      <select className="form-select" id={RADIUS_SELECT_ID} />
    </form>
    <div id={CONTAINER_ID} />
  </Demo>
)

export default Force
