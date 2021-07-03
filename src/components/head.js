import React from "react"

const Head = () => (
  <>
    <script src="/vendors/jquery/dist/jquery.min.js" type="text/javascript" />
    <script
      src="/vendors/bootstrap/dist/js/bootstrap.min.js"
      type="text/javascript"
    />
    <script src="/vendors/angular/angular.min.js" type="text/javascript" />
    <script src="/vendors/lodash/dist/lodash.min.js" type="text/javascript" />
    <script src="/vendors/async/lib/async.js" type="text/javascript" />
    <link
      href="/vendors/bootstrap/dist/css/bootstrap.min.css"
      rel="stylesheet"
      type="text/css"
    />
    <link
      href="/vendors/bootstrap/dist/css/bootstrap-theme.min.css"
      rel="stylesheet"
      type="text/css"
    />
    <link
      href="/vendors/highlightjs/styles/default.css"
      rel="stylesheet"
      type="text/css"
    />
    {/* Iconspedia - Free License */}
    <link href="/images/favicon.png" rel="shortcut icon" type="image/png" />
    <link
      href="http://fonts.googleapis.com/css?family=Lobster"
      rel="stylesheet"
      type="text/css"
    />
    <script
      src="/vendors/highlightjs/highlight.pack.js"
      type="text/javascript"
    />
    {process.env.NODE_ENV === "development" && (
      <>
        <script src="/vendors/d3/d3.min.js" type="text/javascript" />
        <script src="/vendors/nvd3/nv.d3.min.js" type="text/javascript" />
        <link
          href="/vendors/nvd3/nv.d3.min.css"
          rel="stylesheet"
          type="text/css"
        />
        <script
          src="/vendors/d3-plugins/fisheye/fisheye.js "
          type="text/javascript"
        />
        <script src="/vendors/topojson/topojson.js" type="text/javascript" />

        <script
          src="/vendors/jquery-ui/jquery-ui.min.js"
          type="text/javascript"
        />
        <script src="/vendors/jquery-ui/ui/slider.js" type="text/javascript" />
        <link
          href="/vendors/jquery-ui/themes/base/theme.css"
          rel="stylesheet"
          type="text/css"
        />
        <link
          href="/vendors/jquery-ui/themes/base/slider.css"
          rel="stylesheet"
          type="text/css"
        />
        <script src="/js/d3js-utils.js" type="text/javascript" />
        <script src="/vendors/raphael/raphael-min.js" type="text/javascript" />
      </>
    )}

    {/*@TODO: meta title and description*/}
  </>
)

export default Head
