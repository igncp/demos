import React from "react"

const Head = () => (
  <>
    <script
      src={`${ROOT_PATH}vendors/jquery/dist/jquery.min.js`}
      type="text/javascript"
    />
    <script
      src={`${ROOT_PATH}vendors/bootstrap/dist/js/bootstrap.min.js`}
      type="text/javascript"
    />
    <script
      src={`${ROOT_PATH}vendors/angular/angular.min.js`}
      type="text/javascript"
    />
    <script
      src={`${ROOT_PATH}vendors/lodash/dist/lodash.min.js`}
      type="text/javascript"
    />
    <script
      src={`${ROOT_PATH}vendors/async/lib/async.js`}
      type="text/javascript"
    />
    <link
      href={`${ROOT_PATH}vendors/bootstrap/dist/css/bootstrap.min.css`}
      rel="stylesheet"
      type="text/css"
    />
    <link
      href={`${ROOT_PATH}vendors/bootstrap/dist/css/bootstrap-theme.min.css`}
      rel="stylesheet"
      type="text/css"
    />
    <link
      href={`${ROOT_PATH}vendors/highlightjs/styles/default.css`}
      rel="stylesheet"
      type="text/css"
    />
    {/* Iconspedia - Free License */}
    <link
      href={`${ROOT_PATH}favicon.png`}
      rel="shortcut icon"
      type="image/png"
    />
    <link
      href="https://fonts.googleapis.com/css?family=Lobster"
      rel="stylesheet"
      type="text/css"
    />
    <script
      src={`${ROOT_PATH}vendors/highlightjs/highlight.pack.js`}
      type="text/javascript"
    />
    {process.env.NODE_ENV === "development" && (
      <>
        <script
          src={`${ROOT_PATH}vendors/d3/d3.min.js`}
          type="text/javascript"
        />
        <script
          src={`${ROOT_PATH}vendors/nvd3/nv.d3.min.js`}
          type="text/javascript"
        />
        <link
          href={`${ROOT_PATH}vendors/nvd3/nv.d3.min.css`}
          rel="stylesheet"
          type="text/css"
        />
        <script
          src={`${ROOT_PATH}vendors/d3-plugins/fisheye/fisheye.js `}
          type="text/javascript"
        />

        <script
          src={`${ROOT_PATH}vendors/jquery-ui/jquery-ui.min.js`}
          type="text/javascript"
        />
        <script
          src={`${ROOT_PATH}vendors/jquery-ui/ui/slider.js`}
          type="text/javascript"
        />
        <link
          href={`${ROOT_PATH}vendors/jquery-ui/themes/base/theme.css`}
          rel="stylesheet"
          type="text/css"
        />
        <link
          href={`${ROOT_PATH}vendors/jquery-ui/themes/base/slider.css`}
          rel="stylesheet"
          type="text/css"
        />
        <script src={`${ROOT_PATH}js/d3js-utils.js`} type="text/javascript" />
      </>
    )}

    {/*@TODO: meta title and description*/}
  </>
)

export default Head
