describe 'Icosahedron Chart:', ->
  ch = ''

  beforeEach ->
    ch = Charts.d3js.icosahedron

  it 'calculates the new position sinusoidal in x and linear in rest', ->
    velocity = [1,1,1]
    time = Math.PI / 2
    position = [1,1,1]
    ch.cg = {rotationFactor1: 1, rotationFactor2: 1}

    result = ch.calcNewPosition(velocity,time,position)
    expect(result).toEqual([2,2,2])