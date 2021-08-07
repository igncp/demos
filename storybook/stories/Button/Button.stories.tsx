import React from "react"

import { Button } from "./Button"

export default {
  argTypes: {
    backgroundColor: { control: "color" },
  },
  component: Button,
  title: "Example/Button",
}

type ButtonProps = Parameters<typeof Button>[0]
type TemplateType = React.FC<ButtonProps> & { args?: ButtonProps }

const Template = ((args: ButtonProps) => <Button {...args} />) as TemplateType

export const Large = Template.bind({})
Large.args = {
  label: "Button",
  size: "large",
}

export const Small = Template.bind({})
Small.args = {
  label: "Button",
  size: "small",
}
