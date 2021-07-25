import React from "react"

import Head from "./components/head"

const HTML = (props) => (
  <html {...props.htmlAttributes}>
    <head>
      <meta charSet="utf-8" />
      <meta content="ie=edge" httpEquiv="x-ua-compatible" />
      <meta
        content="width=device-width, initial-scale=1, shrink-to-fit=no"
        name="viewport"
      />
      <Head />
      {props.headComponents}
    </head>
    <body {...props.bodyAttributes}>
      {props.preBodyComponents}
      <div
        dangerouslySetInnerHTML={{ __html: props.body }}
        id="___gatsby"
        key={`body`}
      />
      {props.postBodyComponents}
    </body>
  </html>
)

export default HTML
