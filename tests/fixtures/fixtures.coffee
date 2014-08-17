# Common data shared in test, but not model fixtures.

module.exports = {
    urls: (()->
        obj = {}
        obj.base = 'http://localhost:4000'
        obj.home = obj.base + '/'
        obj.d3js = {base: obj.base + '/d3js'}
        obj.d3js.pieChart = obj.d3js.base + '/pie-chart'
        obj
    )()
}