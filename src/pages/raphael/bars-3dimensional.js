import React from "react"

import Demo from "../../components/demo"

import main from "../../demos/bars-3dimensional/bars-3dimensional"

import "../../demos/bars-3dimensional/bars-3dimensional.styl"

const Bars3Dimensional = ({ pageContext: { demoInfo } }) => (
  <Demo
    demoInfo={demoInfo}
    main={main}
    scripts={["/vendors/raphael/raphael-min.js"]}
  >
    <div
      style={{
        marginBottom: 20,
        textAalign: "center",
      }}
    >
      <a className="btn btn-info animate-bars" href="">
        Change Series
      </a>
    </div>
    <div className="bars-3dimensional-chart" id="chart" />
  </Demo>
)

export default Bars3Dimensional
