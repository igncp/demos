import QUnit from "qunit"
import React, { useEffect } from "react"
import { Helmet } from "react-helmet"

import d3Tests from "@/tests/qunit/d3"
import raphaelTests from "@/tests/qunit/raphael"
import threeJSTests from "@/tests/qunit/threeJS"

const setupTitle = () => {
  const implementationsLink = document.createElement("a")
  const divisor = document.createElement("span")

  implementationsLink.setAttribute(
    "href",
    "https://github.com/igncp/demos/tree/main/src/tests/qunit"
  )
  implementationsLink.setAttribute("target", "_blank")
  implementationsLink.innerText = "Read tests files in Github"
  divisor.innerText = " | "

  const header = document.querySelector("#qunit-header")
  const anchor = header?.querySelector("a")

  if (anchor) {
    anchor.setAttribute("href", ROOT_PATH)
    anchor.innerText = "Demos"
  }

  header?.appendChild(divisor)
  header?.appendChild(implementationsLink)
}

const Testing = () => {
  useEffect(() => {
    if (typeof window === "undefined") {
      return () => {}
    }

    QUnit.module("d3", () => {
      d3Tests(QUnit)
    })

    QUnit.module("raphael", () => {
      raphaelTests(QUnit)
    })

    QUnit.module("threeJS", () => {
      threeJSTests(QUnit)
    })

    QUnit.start()

    let timeoutId: number | null = window.setTimeout(() => {
      timeoutId = null

      setupTitle()
    }, 20)

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
    }
  }, [])

  return (
    <div>
      <Helmet
        meta={[
          {
            content: "Testing page for learning the usage of libraries like D3",
            name: "description",
          },
        ]}
        title={"Demos - QUnit Tests"}
      />
      <link
        href="https://code.jquery.com/qunit/qunit-2.16.0.css"
        rel="stylesheet"
      />
      <div id="qunit" />
      <div id="qunit-fixture" />
    </div>
  )
}

export default Testing
