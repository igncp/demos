import React from "react"

const PageTitle = () => (
  <div className="page-header">
    <h1 className="row">
      <span className="col-lg-8">
        <a href={ROOT_PATH}>Demos</a>{" "}
        <small>interactive data visualization examples</small>
      </span>
      <span className="col-lg-4">
        <iframe
          allowtransparency="true"
          frameBorder="0"
          height="20"
          scrolling="0"
          src="https://ghbtns.com/github-btn.html?user=igncp&repo=demos&type=watch"
          width="62"
        />
        <iframe
          allowtransparency="true"
          frameBorder="0"
          height="20"
          scrolling="0"
          src="https://ghbtns.com/github-btn.html?user=igncp&repo=demos&type=follow"
          width="119"
        />
        <iframe
          allowtransparency="true"
          frameBorder="0"
          height="20"
          scrolling="0"
          src="https://ghbtns.com/github-btn.html?user=igncp&repo=demos&type=fork"
          width="62"
        />
      </span>
    </h1>
  </div>
)

export default PageTitle
