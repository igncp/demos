import React from "react"

const DemosList = ({ demos, indexOffset }) => (
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
