import * as d3 from "d3"
import QUnitType from "qunit"

const d3Tests = (QUnit: QUnitType) => {
  QUnit.test("d3.arc", (assert) => {
    const arc = d3.arc().outerRadius(10).innerRadius(0)

    assert.deepEqual(typeof arc({} as any), "string")
  })

  QUnit.test("d3.arc#centroid", (assert) => {
    const arc = d3
      .arc()
      .outerRadius(50)
      .innerRadius(0)
      .startAngle(0)
      .endAngle(Math.PI)

    // https://github.com/d3/d3-shape/blob/54f0f111a0fc356d8a71205686cd59033a931631/src/arc.js
    assert.deepEqual(arc.centroid({} as any), [25, 0])
  })

  QUnit.test("d3.extent returns expected values", (assert) => {
    assert.deepEqual(d3.extent([0, -10, 5, 100, -50, 7]), [-50, 100])
    assert.deepEqual(d3.extent([]), [undefined, undefined])
    assert.deepEqual(d3.extent([1, 1]), [1, 1])
  })

  QUnit.test("d3.interpolateNumber simple", (assert) => {
    const interpolator = d3.interpolateNumber(10, 30)

    assert.deepEqual(interpolator(0), 10)
    assert.deepEqual(interpolator(0.5), 20)
    assert.deepEqual(interpolator(1), 30)
  })

  QUnit.test("d3.interpolate hex colors", (assert) => {
    const interpolator = d3.interpolate("#ccc", "#fff")

    assert.deepEqual(interpolator(0), "rgb(204, 204, 204)")
    assert.deepEqual(interpolator(0.5), "rgb(230, 230, 230)")
    assert.deepEqual(interpolator(1), "rgb(255, 255, 255)")
  })

  QUnit.test("d3.interpolate nested", (assert) => {
    const interpolator = d3.interpolate(
      {
        bar: "white",
        foo: 1,
      },
      {
        bar: "black",
        foo: 3,
      }
    )

    assert.deepEqual(interpolator(0), {
      bar: "rgb(255, 255, 255)",
      foo: 1,
    })
    assert.deepEqual(interpolator(0.5), {
      bar: "rgb(128, 128, 128)",
      foo: 2,
    })
    assert.deepEqual(interpolator(1), {
      bar: "rgb(0, 0, 0)",
      foo: 3,
    })
  })

  QUnit.test("d3.geoOrthographic", (assert) => {
    const projection100 = d3.geoOrthographic().scale(100)
    const projection1 = d3.geoOrthographic().scale(1)

    assert.deepEqual(projection100([0, 0]), [480, 250])
    assert.deepEqual(projection1([0, 0]), [480, 250])
  })

  QUnit.test("d3.max", (assert) => {
    assert.deepEqual(
      d3.max([{ foo: 1 }, { foo: 2 }, { foo: -1 }], (d) => d.foo),
      2
    )
  })

  QUnit.test("d3.pie generates the expected data", (assert) => {
    type Data = { val: number }

    const pie = d3
      .pie<Data>()
      .sort(null)
      .value((d) => d.val)

    assert.deepEqual(pie([{ val: 1 }, { val: 1 }]), [
      {
        data: {
          val: 1,
        },
        endAngle: Math.PI,
        index: 0,
        padAngle: 0,
        startAngle: 0,
        value: 1,
      },
      {
        data: {
          val: 1,
        },
        endAngle: Math.PI * 2,
        index: 1,
        padAngle: 0,
        startAngle: Math.PI,
        value: 1,
      },
    ])
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

  QUnit.test("d3.scaleOrdinal with color", (assert) => {
    const scale = d3.scaleOrdinal(d3.schemePastel2)

    assert.deepEqual(scale("0"), "#b3e2cd")
  })

  // https://observablehq.com/@d3/quantile-quantize-and-threshold-scales
  QUnit.test("d3.scaleQuantile", (assert) => {
    const colors = ["A", "B", "C", "D", "E"]
    const colorScale = d3.scaleQuantile<string>().domain([0, 100]).range(colors)

    assert.deepEqual(colorScale(0), "A")
    assert.deepEqual(colorScale(19), "A")
    assert.deepEqual(colorScale(20), "B")
    assert.deepEqual(colorScale(100), "E")
  })

  QUnit.test("d3.select", (assert) => {
    const div = document.createElement("div")
    const svg: d3.Selection<SVGSVGElement, unknown, null, unknown> = d3
      .select(div)
      .append("svg")
    // note that here the parent is still null in the types
    const g: d3.Selection<SVGPathElement, number, null, unknown> = svg
      .append("path")
      .data([1])

    svg.attr("id", "foo")

    assert.deepEqual(svg.node() instanceof SVGElement, true)
    assert.deepEqual(svg.node()!.getAttribute("id"), "foo")
    assert.deepEqual(g.node() instanceof SVGPathElement, true)
  })
}

export default d3Tests
