export type TemplateType<Props> = React.FC<Props> & { args?: Partial<Props> }
