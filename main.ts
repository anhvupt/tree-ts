import express from 'express';
import { toTree } from './tree.util';
const app = express();
const port = 3000;


app.listen(port, () => {
  const flatList = [{ id: 0, text: 'root' }];
  console.log(toTree(flatList));
  return console.log(`Express is listening at http://localhost:${port}`);
});

