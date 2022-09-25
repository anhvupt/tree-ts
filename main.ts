import { toTree } from './tree.util';

const flatList = [
  { id: 0, text: 'root' },
  { id: 1, text: '1', parentId: 0 }
];

console.log(JSON.stringify(toTree(flatList)));
