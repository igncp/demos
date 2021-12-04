import React from "react"

const Head = () => (
  <>
    <script
      src={`${ROOT_PATH}vendors/jquery/dist/jquery.min.js`}
      type="text/javascript"
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
  </>
)

export default Head
