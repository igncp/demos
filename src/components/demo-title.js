import React from "react"

const DemoTitle = ({ name, mainSource }) => (
  <h2 className="row" id="demo-title">
    <span className="col-lg-10">
      {name} Chart{" "}
      <small id="main-source">
        main source: <a href={mainSource}>···</a>
      </small>
    </span>
    <span className="col-lg-2 back-home">
      <a className="btn btn-default" href="/">
        <span className="glyphicon glyphicon-home" /> Home
      </a>
    </span>
  </h2>
)

export default DemoTitle
