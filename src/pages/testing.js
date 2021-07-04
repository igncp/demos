import React, { useEffect } from "react"
import { QUnit } from "qunit"

import d3Tests from "@/testing/d3"

const Testing = () => {
  useEffect(() => {
    if (typeof window === "undefined") {
      return
    }

    QUnit.module("d3", () => {
      d3Tests(QUnit)
    })

    QUnit.start()
  }, [])

  return (
    <div>
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
