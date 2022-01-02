import { useEffect, useState } from "react"

import { getBrowserWidth } from "@/utils/getBrowserWidth"

const useBrowserInitialWidth = () => {
  const [browserWidth, setBrowserWidth] = useState<number | null>(null)

  useEffect(() => {
    const browserWidthInitial = getBrowserWidth()

    if (browserWidthInitial !== null) {
      setBrowserWidth(browserWidthInitial)
    }
  }, [])

  return browserWidth
}

export default useBrowserInitialWidth
