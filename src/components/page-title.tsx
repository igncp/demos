import React from "react"

const PageTitle = () => (
  <div className="page-header">
    <h1 className="row">
      <span className="col-sm-8 col-xs-12">
        <a href={ROOT_PATH}>Demos</a>{" "}
        <small>interactive data visualization examples</small>
      </span>
      <span className="col-sm-4 col-xs-12" id="gh-buttons">
        <iframe
          frameBorder="0"
          height="20"
          scrolling="0"
          src="https://ghbtns.com/github-btn.html?user=igncp&repo=demos&type=follow"
          width="119"
        />
        <iframe
          frameBorder="0"
          height="20"
          scrolling="0"
          src="https://ghbtns.com/github-btn.html?user=igncp&repo=demos&type=fork"
          width="62"
        />
        <iframe
          frameBorder="0"
          height="20"
          scrolling="0"
          src="https://ghbtns.com/github-btn.html?user=igncp&repo=demos&type=watch"
          width="52"
        />
      </span>
    </h1>
  </div>
)

export default PageTitle
