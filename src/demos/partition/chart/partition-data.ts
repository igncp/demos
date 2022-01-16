import {
  HierarchyRectangularNode,
  hierarchy,
  interpolate,
  partition as partitionD3,
} from "d3"

type Node<NodeData> = NodeData & {
  children?: Array<Node<NodeData>>
}

type HierarchyNode<ChartData> = HierarchyRectangularNode<Node<ChartData>>

const extractTweenObj = <ChartData>(node?: HierarchyNode<ChartData>) => ({
  depth: node?.depth ?? 0,
  x0: node?.x0 ?? 0,
  x1: node?.x1 ?? 0,
  y0: node?.y0 ?? 0,
  y1: node?.y1 ?? 0,
})

type PartitionDataConfig<ChartData> = {
  getHierarchySum: (node: Node<ChartData>) => number
  getMaxRadius: () => number
  getNodeId: (node: Node<ChartData>) => number
  rootData: Node<ChartData>
}

const createDescendants = <ChartData>({
  getHierarchySum,
  radius,
  rootNode,
}: {
  getHierarchySum: PartitionDataConfig<ChartData>["getHierarchySum"]
  radius: number
  rootNode: Node<ChartData>
}) => {
  const circularPartition = partitionD3<Node<ChartData>>().size([
    2 * Math.PI,
    radius,
  ])
  const newHierarchy = hierarchy(rootNode).sum(getHierarchySum)
  const hierarchyResult = circularPartition(newHierarchy)

  return hierarchyResult.descendants()
}

const getInterpolatorFn =
  <ChartData>({
    fn,
    getNodeId,
    initialData,
    isText,
  }: {
    fn: (node: HierarchyNode<ChartData>) => string | null
    getNodeId: PartitionDataConfig<ChartData>["getNodeId"]
    initialData: Array<HierarchyNode<ChartData> | undefined>
    isText: boolean
  }) =>
  (finalNode: HierarchyNode<ChartData>) => {
    const initialNode = initialData.find(
      (node) => node && getNodeId(node.data) === getNodeId(finalNode.data)
    )

    const finalTween = extractTweenObj(finalNode)
    const initialTween = extractTweenObj(initialNode)

    const initialTweenUpdated = (() => {
      if (finalTween.x0 === finalTween.x1) {
        return finalTween
      }

      if (isText && finalNode.depth === 0) {
        return finalTween
      }

      return {
        ...initialTween,
        y0: finalTween.y0,
        y1: finalTween.y1,
      }
    })()

    const interpolateFn = interpolate(initialTweenUpdated, finalTween)

    return (t: number) => {
      const transitientState = interpolateFn(t)

      return fn(transitientState as HierarchyNode<ChartData>)!
    }
  }

class PartitionData<ChartData> {
  private readonly config: PartitionDataConfig<ChartData>

  private readonly state: {
    descendants: Array<HierarchyNode<ChartData>>
    focusedPath: number[]
  }

  public constructor(config: PartitionDataConfig<ChartData>) {
    this.config = config

    this.state = {
      descendants: [],
      focusedPath: [],
    }

    this.state.descendants = this.getDataHierarchy()
  }

  public setDescendants() {
    this.state.descendants = this.getDataHierarchy()
  }

  public getDescendants() {
    return this.state.descendants
  }

  public getDataHierarchy() {
    const {
      config: { getHierarchySum, getNodeId, rootData },
      state: { focusedPath },
    } = this
    const maxRadius = this.config.getMaxRadius()

    const getMaxDepthRecursive = (node: Node<ChartData>): number => {
      const { children } = node

      if (!children) {
        return 0
      }

      return (
        Math.max(...children.map((child) => getMaxDepthRecursive(child))) + 1
      )
    }

    const cloneRecursive = ({
      level,
      node,
    }: {
      level: number
      node: Node<ChartData>
    }): Node<ChartData> => {
      const { [level]: pathId } = focusedPath
      const isValidPathId = typeof pathId === "number"

      const childrenObj = {
        ...("children" in node && {
          children: node
            .children!.filter(
              (child) => !isValidPathId || getNodeId(child) === pathId
            )
            .map((child) =>
              cloneRecursive({
                level: level + 1,
                node: child,
              })
            ),
        }),
      }

      return {
        ...node,
        ...childrenObj,
      }
    }

    const newNode = cloneRecursive({
      level: 0,
      node: rootData,
    })

    const maxDepthTotal = getMaxDepthRecursive(rootData)
    const maxDepthFiltered = getMaxDepthRecursive(newNode)
    const radiusOfLevel = maxRadius / maxDepthTotal

    return createDescendants({
      getHierarchySum,
      radius: radiusOfLevel * maxDepthFiltered,
      rootNode: newNode,
    })
  }

  public setFocusedPathFromNode(rootNode: HierarchyNode<ChartData>) {
    const {
      config: { getNodeId },
    } = this

    const getFocusedPath = (node: HierarchyNode<ChartData>): number[] => {
      if (!node.parent) {
        return []
      }

      return getFocusedPath(node.parent).concat([getNodeId(node.data)])
    }

    this.state.focusedPath = getFocusedPath(rootNode)
  }

  public getFocusedPathRef() {
    return this.state.focusedPath
  }

  public setFocusedPath(newFocusedPath: number[]) {
    this.state.focusedPath = newFocusedPath
  }
}

const zTestCreateDescendants =
  process.env.NODE_ENV === "test" ? createDescendants : null

export type { Node }

export {
  HierarchyNode,
  PartitionData,
  PartitionDataConfig,
  extractTweenObj,
  getInterpolatorFn,
  zTestCreateDescendants,
}
