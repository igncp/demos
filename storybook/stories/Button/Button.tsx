import React from "react"

import "./button.css"

type Props = {
  backgroundColor?: string
  label: string
  primary?: boolean
  size: string
}

export const Button = ({ backgroundColor, label, primary, size }: Props) => {
  const mode = primary
    ? "storybook-button--primary"
    : "storybook-button--secondary"

  return (
    <>
      <p>This is the example from Storybook, keeping it until enough stories</p>
      <p>
        <button
          className={[
            "storybook-button",
            `storybook-button--${size}`,
            mode,
          ].join(" ")}
          style={backgroundColor ? { backgroundColor } : undefined}
          type="button"
        >
          {label}
        </button>
      </p>
    </>
  )
}

Button.defaultProps = {
  backgroundColor: null,
  onClick: undefined,
  primary: false,
  size: "medium",
}
