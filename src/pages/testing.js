import React, { useEffect } from "react"
import { QUnit } from "qunit"

import * as d3 from "d3"

const Testing = () => {
  useEffect(() => {
    if (typeof window === "undefined") {
      return
    }

    QUnit.module("d3", () => {
      QUnit.test("d3.extent returns expected values", (assert) => {
        assert.deepEqual(d3.extent([0, -10, 5, 100, -50, 7]), [-50, 100])
        assert.deepEqual(d3.extent([]), [undefined, undefined])
        assert.deepEqual(d3.extent([1, 1]), [1, 1])
      })

      QUnit.test("d3.range returns expected values", (assert) => {
        assert.deepEqual(d3.range(0, 10, 1), [0, 1, 2, 3, 4, 5, 6, 7, 8, 9])
        assert.deepEqual(d3.range(0, 10, 5), [0, 5])
        assert.deepEqual(d3.range(0, 10, 6), [0, 6])
        assert.deepEqual(d3.range(0, 10, 11), [0])
      })

      QUnit.test("d3.scaleLinear simple", (assert) => {
        const scale = d3.scaleLinear().domain([0, 10]).range([1, 2])

        assert.deepEqual(scale(0), 1)
        assert.deepEqual(scale(10), 2)
        assert.deepEqual(scale(5), 1.5)
      })

      QUnit.test("d3.scaleLinear simple 2", (assert) => {
        const scale = d3.scaleLinear().domain([0, 1]).range([0, 100])

        assert.deepEqual(scale(0), 0)
        assert.deepEqual(scale(0.1), 10)
        assert.deepEqual(scale(0.2), 20)
      })
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
