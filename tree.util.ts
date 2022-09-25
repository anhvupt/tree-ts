export interface IFlatModelOf<T extends string | number> {
  id: T;
  parentId?: T;
}

export interface INodeOf<T extends string | number> extends IFlatModelOf<T> {
  children: INodeOf<T>[];
}

export type INode = INodeOf<string | number>;
export type IList = IFlatModelOf<string | number>[];

export function toTree(flatList: IList): Array<INode> {
  return toTreeAndCount(flatList, flatList.length);
}

export function foreach(nodes: INode[] | INode, callbackFn: (node: INode) => void): void {
  const foreachNode = (node: INode) => {
    callbackFn(node);
    node.children.forEach(callbackFn);
  };
  Array.isArray(nodes) ? nodes.forEach(foreachNode) : foreachNode(nodes);
}

export function find(
  nodes: INode[] | INode,
  predicate: (node: INode) => boolean
): INode | undefined {
  const findRecursive = (node: INode) => (predicate(node) ? node : find(node.children, predicate));

  if (!Array.isArray(nodes)) {
    return findRecursive(nodes);
  }
  let result: INode | undefined;
  nodes.some((node) => {
    result = findRecursive(node);
    return !!result;
  });
  return result;
}

function toTreeAndCount(
  list: IList,
  length: number,
  nodes: INode[] = [],
  count: number = 0
): INode[] {
  const remain: IList = [];
  count++;
  if (count >= length) {
    remain.length && console.error('cannot find parent for: ', remain);
    return nodes;
  }
  list.forEach((item) => {
    if (item.parentId === undefined) {
      nodes.push({ ...item, children: [] });
      return;
    }
    const parent = find(nodes, (x) => x.id === item.parentId);
    if (parent) {
      parent.children.push({ ...item, children: [] });
      return;
    }
    remain.push(item);
  });
  return remain.length ? toTreeAndCount(remain, length, nodes, count) : nodes;
}
