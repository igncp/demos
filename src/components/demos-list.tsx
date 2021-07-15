import React from "react"

import { DemoSummary } from "@/common"

type Props = {
  demos: DemoSummary[]
  indexOffset: number
}

const DemosList = ({ demos, indexOffset }: Props) => (
  <ul className="list-group">
    {demos.map((demo, index) => (
      <a className="list-group-item" href={demo.route} key={demo.name}>
        <span className="home-demo-number">{index + 1 + indexOffset}.-</span>{" "}
        <span className="home-demo-name-link">{demo.name}</span>
        <div className={`bullet ${demo.category}`}>&#8226;</div>
      </a>
    ))}
  </ul>
)

export default DemosList
