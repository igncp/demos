describe 'Bars 3D Chart:', ->
  chCopy = _.cloneDeep(window.Charts.raphael['bars-3dimensional'])

  beforeEach ->
    window.Charts.raphael['bars-3dimensional'] = chCopy
    @ch = window.Charts.raphael['bars-3dimensional']
    @ch.refreshAlias()
    @ch.setCg()

  it 'jasmine works', ->
    expect(1).toEqual(1)