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
          src={`${ROOT_PATH}vendors/jquery-ui/jquery-ui.min.js`}
          type="text/javascript"
        />
        <link
          href={`${ROOT_PATH}vendors/jquery-ui/themes/base/jquery-ui.min.css`}
          rel="stylesheet"
          type="text/css"
        />
      </>
    )}

    {/*@TODO: meta title and description*/}
  </>
)

export default Head
