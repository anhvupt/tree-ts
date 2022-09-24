export interface IFlatModelOf<T extends string | number> {
  id: T;
  parentId?: T;
}

export interface INodeOf<T extends string | number> extends IFlatModelOf<T> {
  children: INodeOf<T>[];
}

export type INode = INodeOf<string | number>;

export function toTree(flatList: Array<IFlatModelOf<string | number>>): Array<INode> {
  return [];
}

export function foreach(node: INode, callbackFn: (node: INode) => void): void {
  callbackFn(node);
  node.children.forEach(callbackFn);
}

export function find<T extends string | number>(
  node: INode,
  predicate: (node: INode) => boolean
): INode | undefined {
  if (predicate(node)) return node;
  let result: INode | undefined = undefined;
  node.children.some((child) => {
    result = find(child, predicate);
    return !!result;
  });
  return result;
}
