export interface IFlatModel<T extends string | number> {
  id: T;
  parentId?: T;
}

export interface INode<T extends string | number> extends IFlatModel<T> {
  children: INode<T>[];
}
export type IList<T extends string | number> = IFlatModel<T>[];

export function toTree<T extends string | number>(flatList: IList<T>): Array<INode<T>> {
  return toTreeRecursive(flatList, flatList.length);
}

export function foreach<T extends string | number>(
  nodes: INode<T>[] | INode<T>,
  callbackFn: (node: INode<T>) => void
): void {
  const foreachNode = (node: INode<T>) => {
    callbackFn(node);
    node.children.forEach(callbackFn);
  };
  Array.isArray(nodes) ? nodes.forEach(foreachNode) : foreachNode(nodes);
}

export function find<T extends string | number>(
  nodes: INode<T>[] | INode<T>,
  predicate: (node: INode<T>) => boolean
): INode<T> | undefined {
  const findRecursive = (node: INode<T>) =>
    predicate(node) ? node : find(node.children, predicate);

  if (!Array.isArray(nodes)) {
    return findRecursive(nodes);
  }
  let result: INode<T> | undefined;
  nodes.some((node) => {
    result = findRecursive(node);
    return !!result;
  });
  return result;
}

function toTreeRecursive<T extends string | number>(
  list: IList<T> | INode<T>[],
  length: number,
  nodes: INode<T>[] = [],
  count: number = 0
): INode<T>[] {
  const remain: INode<T>[] = [];
  count++;
  if (count >= length) {
    remain.length && console.error('cannot find parent for: ', remain);
    return nodes;
  }
  list.forEach((item) => {
    const newNode = { ...item, children: item.children || [] };
    if (item.parentId === undefined) {
      nodes.push(newNode);
      return;
    }
    const isAddSucceed = findAndAddChild(nodes, newNode) || findAndAddChild(remain, newNode);
    if (isAddSucceed) {
      return;
    }
    remain.push(newNode);
  });
  return remain.length ? toTreeRecursive(remain, length, nodes, count) : nodes;
}

function findAndAddChild<T extends string | number>(
  nodes: INode<T>[],
  child: INode<T>
): INode<T> | undefined {
  const parent = find(nodes, (x) => x.id === child.parentId);
  if (parent) {
    parent.children.push({ ...child });
    return parent;
  }
  return undefined;
}
