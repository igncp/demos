import { zTestCreateDescendants } from "../partition-data"

const createDescendants = zTestCreateDescendants!

const nodeData = {}

const testRadius = 100

const nodes = createDescendants({
  getHierarchySum: () => 1,
  radius: testRadius,
  rootNode: nodeData,
})

const dummyNode = nodes[0]

export { dummyNode, testRadius }
