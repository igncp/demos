export const getBrowserWidth = () => {
  if (typeof window === "undefined") {
    return null
  }

  return Math.max(
    document.body.scrollWidth,
    document.documentElement.scrollWidth,
    document.body.offsetWidth,
    document.documentElement.offsetWidth,
    document.documentElement.clientWidth
  )
}
