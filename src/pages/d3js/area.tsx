import React, { useEffect, useRef, useState } from "react"

import { DemoPageProps } from "@/common"

import Demo from "@/components/demo"

import main, {
  CONTAINER_ID,
  DATA_SOURCE_SELECT_ID,
  TOGGLE_BUTTON_ID,
  UPDATE_BUTTON_ID,
} from "@/demos/area/area"
import * as styles from "@/demos/area/area-page.module.css"

const Area = ({ pageContext }: DemoPageProps) => {
  const [loaded, setLoaded] = useState(false)
  const stateSubscription = useRef<{
    unsubscribe: () => void
  }>()

  useEffect(
    () => () => {
      stateSubscription.current?.unsubscribe()
    },
    []
  )

  const mainHandler = () => {
    const { state$ } = main()

    stateSubscription.current?.unsubscribe()
    stateSubscription.current = state$.subscribe((state) => {
      setLoaded(!!state.loaded[state.source])
    })

    return Promise.resolve()
  }

  const visibilityStyle = {
    visibility: (loaded ? "visible" : "hidden") as VisibilityState,
  }

  return (
    <Demo main={mainHandler} pageContext={pageContext}>
      {!loaded && (
        <div className={styles.loaderWrapper}>
          <div className={styles.loader} />
        </div>
      )}
      <form className={styles.form} style={visibilityStyle}>
        <select className="form-select" id={DATA_SOURCE_SELECT_ID} />
        <button className="btn btn-info" id={TOGGLE_BUTTON_ID} type="button">
          Toggle Voronoi
        </button>
        <button className="btn btn-success" id={UPDATE_BUTTON_ID} type="button">
          Update Random Values
        </button>
      </form>
      <div
        id={CONTAINER_ID}
        style={
          loaded
            ? {}
            : {
                left: -1000,
                opacity: 0,
                position: "absolute",
                top: -1000,
              }
        }
      />
    </Demo>
  )
}

export default Area
