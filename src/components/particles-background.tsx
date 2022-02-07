import React, { useEffect } from "react"
import { tsParticles } from "tsparticles"

import * as styles from "./styles/styles.module.css"

const isTouchDevice = () =>
  "ontouchstart" in window || navigator.maxTouchPoints > 0

const initParticles = async () => {
  if (isTouchDevice() || process.env.CI) {
    return
  }

  await tsParticles.load(styles.particlesContainer, {
    detectRetina: true,
    fpsLimit: 120,
    fullScreen: {
      enable: false,
    },
    particles: {
      color: {
        value: "#ccc", // eslint-disable-line id-denylist
      },
      move: {
        bounce: false,
        direction: "none",
        enable: true,
        outMode: "out",
        random: false,
        speed: 2,
        straight: false,
      },
      number: {
        density: {
          area: 800,
          enable: true,
        },
        limit: 500,
        value: 300, // eslint-disable-line id-denylist
      },
      shape: {
        type: "circle",
      },
      size: {
        random: true,
        value: 2, // eslint-disable-line id-denylist
      },
    },
  })
}

const ParticlesBackground = () => {
  useEffect(() => {
    // eslint-disable-next-line no-console
    initParticles().catch(console.error)
  }, [])

  return <div id={styles.particlesContainer} />
}

export default ParticlesBackground
