import React from "react"

type Props = {
  name: string
  mainSource: string
}

const DemoTitle = ({ name, mainSource }: Props) => (
  <h2 className="row" id="demo-title">
    <span className="col-xs-10">
      {name} Chart{" "}
      <small id="main-source" title="Main Source">
        <a href={mainSource}>···</a>
      </small>
    </span>
    <span className="col-xs-2 back-home">
      <a className="btn btn-default" href={ROOT_PATH}>
        <span className="glyphicon glyphicon-home" /> Home
      </a>
    </span>
  </h2>
)

export default DemoTitle
