declare const ROOT_PATH: string

declare module "*.jpg" {
  const imageContent: string
  export default imageContent
}

declare module "*.png" {
  const imageContent: string
  export default imageContent
}
