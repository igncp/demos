import React from "react"

type Props = {
  isCompleted: boolean
  mainSource: string
  name: string
}

const DemoTitle = ({ name, mainSource, isCompleted }: Props) => (
  <h2 className="row" id="demo-title">
    <span className="col-xs-10">
      {name} Chart{" "}
      <small id="main-source" title="Main Source">
        <a href={mainSource}>···</a>
      </small>
      {!isCompleted && (
        <small id="demo-wip" title="This demo is still work in progress">
          WIP
        </small>
      )}
    </span>
    <span className="col-xs-2 back-home">
      <a className="btn btn-default" href={ROOT_PATH}>
        <span className="glyphicon glyphicon-home" /> Home
      </a>
    </span>
  </h2>
)

export default DemoTitle
