import $ from "jquery"
import "jquery-ui/themes/base/all.css"

import { TimeRange } from "./crossing-lines-chart"
import { MareysSchedules } from "./mareys-schedule-data-model"

if (typeof window !== "undefined") {
  require("jquery-ui/ui/widgets/slider")
}

type ScheduleLimits = [number, number]

const RANGE_ID = "schedule-range"

const convertLimitsToTimes = (limits: ScheduleLimits): [string, string] => {
  const times: string[] = []

  limits.forEach((limit) => {
    const wholeMinutes = (limit / 100) * 1200

    let fragment = "AM"
    let hours = Math.floor(wholeMinutes / 60)
    let minutes = Math.floor(wholeMinutes % 60)

    if (minutes > 30) {
      minutes = minutes - 30
      hours = hours + 1
    } else {
      minutes = minutes + 30
    }

    hours = hours + 4

    if (hours > 23) {
      if (hours === 24) {
        hours = hours - 12
      } else {
        hours = hours - 24
      }
    } else if (hours > 11) {
      fragment = "PM"

      if (hours !== 12) {
        hours = hours - 12
      }
    }

    const minutesStr = minutes < 10 ? `0${minutes}` : minutes.toString()

    const finalTime = `${hours}:${minutesStr}${fragment}`

    return times.push(finalTime)
  })

  return times as [string, string]
}

const setupControls = (updateScheduleLimits: (limits: TimeRange) => void) => {
  const slider = $(`#${RANGE_ID}`)

  slider.slider({
    change: () => {
      const limits = slider.slider("values") as ScheduleLimits
      const timeLimits = convertLimitsToTimes(limits).map(
        MareysSchedules.convertStringToDate
      ) as [Date, Date]

      updateScheduleLimits(timeLimits)
    },
    range: true,
  })

  slider.slider("values", [10, 50])
}

export { RANGE_ID, setupControls }
