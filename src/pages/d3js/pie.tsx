import React from "react"

import { DemoPageProps } from "@/common"

import Demo from "@/components/demo"

import main, { BUTTON_ID, CONTAINER_ID } from "@/demos/pie/pie"

const Pie = ({ pageContext }: DemoPageProps) => (
  <Demo
    links={["/vendors/jquery-ui/themes/base/jquery-ui.min.css"]}
    main={main}
    pageContext={pageContext}
    scripts={["/vendors/jquery-ui/jquery-ui.min.js"]}
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
