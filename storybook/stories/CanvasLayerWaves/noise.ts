// From source:
// https://s3-us-west-2.amazonaws.com/s.cdpn.io/131442/make-noise.js
// https://codepen.io/MadeByMike/pen/zBrpBL

const dot = (g: number[], x: number, y: number) => g[0] * x + g[1] * y

const grad3 = [
  [1, 1, 0],
  [-1, 1, 0],
  [1, -1, 0],
  [-1, -1, 0],
  [1, 0, 1],
  [-1, 0, 1],
  [1, 0, -1],
  [-1, 0, -1],
  [0, 1, 1],
  [0, -1, 1],
  [0, 1, -1],
  [0, -1, -1],
]

const p = Array.from({ length: 256 }).map(() => Math.floor(Math.random() * 256))

const perm = Array.from({ length: 512 }).map(
  (_: unknown, index: number) => p[index & 255]
)

export const noiseFactor = 1 / 50

export const noise = (xin: number, yin: number) => {
  let n0 = 0
  let n1 = 0
  let n2 = 0

  const F2 = 0.5 * (Math.sqrt(3.0) - 1.0)
  const s = (xin + yin) * F2
  const i = Math.floor(xin + s)
  const j = Math.floor(yin + s)
  const G2 = (3.0 - Math.sqrt(3.0)) / 6.0
  const t = (i + j) * G2
  const X0 = i - t
  const Y0 = j - t
  const x0 = xin - X0
  const y0 = yin - Y0

  let i1 = 0
  let j1 = 0

  if (x0 > y0) {
    i1 = 1
    j1 = 0
  } else {
    i1 = 0
    j1 = 1
  }

  const x1 = x0 - i1 + G2
  const y1 = y0 - j1 + G2
  const x2 = x0 - 1.0 + 2.0 * G2
  const y2 = y0 - 1.0 + 2.0 * G2

  const ii = i & 255
  const jj = j & 255
  const gi0 = perm[ii + perm[jj]] % 12
  const gi1 = perm[ii + i1 + perm[jj + j1]] % 12
  const gi2 = perm[ii + 1 + perm[jj + 1]] % 12

  let t0 = 0.5 - x0 * x0 - y0 * y0

  if (t0 < 0) n0 = 0.0
  else {
    t0 *= t0
    n0 = t0 * t0 * dot(grad3[gi0], x0, y0)
  }

  let t1 = 0.5 - x1 * x1 - y1 * y1

  if (t1 < 0) n1 = 0.0
  else {
    t1 *= t1
    n1 = t1 * t1 * dot(grad3[gi1], x1, y1)
  }

  let t2 = 0.5 - x2 * x2 - y2 * y2

  if (t2 < 0) n2 = 0.0
  else {
    t2 *= t2
    n2 = t2 * t2 * dot(grad3[gi2], x2, y2)
  }

  return 70.0 * (n0 + n1 + n2)
}
