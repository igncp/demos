import React from "react"

import { DemoPageProps, JQUERYUI } from "@/common"

import Demo from "@/components/demo"

import main, { BUTTON_ID, CONTAINER_ID } from "@/demos/pie/pie"

const Pie = ({ pageContext }: DemoPageProps) => (
  <Demo
    links={[JQUERYUI.STYLE]}
    main={main}
    pageContext={pageContext}
    scripts={[JQUERYUI.SCRIPT]}
  >
    <form>
      <button className="btn btn-success" id={BUTTON_ID} type="button">
        Change
      </button>
    </form>
    <div id={CONTAINER_ID} />
  </Demo>
)

export default Pie
