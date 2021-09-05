import { timeFormat, timeParse, tsv } from "d3"

const timeFormatStr = "%I:%M%p"

const getParseTime = () => timeParse(timeFormatStr)

const parseTime = (timeStr: string): Date => {
  const timeDate = getParseTime()(timeStr)

  if (timeDate !== null && timeDate.getHours() < 3) {
    timeDate.setDate(timeDate.getDate() + 1)
  }

  return timeDate!
}

type TrainType = "B" | "L" | "N"

type RawDataItem = {
  [stop: string]: string
  direction: string
  number: string
  type: TrainType
}

type Station = {
  distance: number
  key: string
  name: string
  zone: number
}

type Stop = {
  station: Station
  time: Date | null
  trainId: number
}

type Train = {
  direction: string
  id: number
  number: string
  stops: Stop[]
  type: TrainType
}

type SchedulesData = {
  stations: Station[]
  trains: Train[]
}

class MareysSchedules {
  private readonly schedulesData: SchedulesData
  private constructor(schedulesData: SchedulesData) {
    this.schedulesData = schedulesData
  }

  public static async fetchAndCreateSchedules(): Promise<MareysSchedules> {
    const originalItems = ((await tsv(
      `${ROOT_PATH}data/d3js/mareys-schedule/data.tsv`
    )) as unknown) as RawDataItem[]

    const stations: Station[] = []

    const trains: Train[] = originalItems
      .map((...[train, trainIndex]) => {
        if (trainIndex === 0) {
          for (const key in train) {
            if (/^stop\|/.test(key)) {
              const stopFragments = key.split("|")

              stations.push({
                distance: +stopFragments[2],
                key,
                name: stopFragments[1],
                zone: +stopFragments[3],
              })
            }
          }
        }

        return {
          direction: train.direction,
          id: trainIndex,
          number: train.number,
          stops: stations
            .map((station) => ({
              station,
              time: parseTime(train[station.key]),
              trainId: trainIndex,
            }))
            .filter((station) => (station.time as unknown) !== null),
          type: train.type,
        }
      })
      .filter((train) => /[NLB]/.test(train.type))

    const schedulesData = {
      stations,
      trains,
    }

    return new MareysSchedules(schedulesData)
  }

  public static convertDateToString(date: Date): string {
    return timeFormat(timeFormatStr)(date)
  }

  public static convertStringToDate(dateStr: string): Date {
    return parseTime(dateStr)
  }

  public static getTrainTitle(trainData: Train): string {
    const {
      stops: { 0: firstStop, [trainData.stops.length - 1]: lastStop },
    } = trainData

    if (trainData.direction === "S") {
      return `${firstStop.station.name} -> ${lastStop!.station.name}`
    }

    return `${lastStop.station.name} -> ${firstStop.station.name}`
  }

  public getStations() {
    return this.schedulesData.stations.slice()
  }

  public getTrains() {
    return this.schedulesData.trains.slice()
  }

  public getTrainsMap() {
    return this.schedulesData.trains.reduce((...[acc, train]) => {
      acc[train.id] = train

      return acc
    }, {} as { [id: string]: Train })
  }
}

export { MareysSchedules }
