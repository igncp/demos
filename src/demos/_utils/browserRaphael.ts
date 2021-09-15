import { RaphaelStatic } from "raphael"

const Raphael: RaphaelStatic =
  typeof window === "undefined" ? null : require("raphael")

export default Raphael
