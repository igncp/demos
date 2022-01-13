import { json } from "d3"

type SampleNode = {
  name: string
}

type SampleLink = {
  name: string
  source: number
  strength: number
  target: number
}

const fetchForceData = async () => {
  const [nodes, links] = (await Promise.all([
    json(`${ROOT_PATH}data/d3js/force/nodes.json`),
    json(`${ROOT_PATH}data/d3js/force/links.json`),
  ])) as [SampleNode[], SampleLink[]]

  return {
    links,
    nodes,
  }
}

export { fetchForceData, SampleNode, SampleLink }
