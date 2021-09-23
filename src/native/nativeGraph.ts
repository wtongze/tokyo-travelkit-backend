import fs from 'fs';
// eslint-disable-next-line import/no-unresolved
const addon = require('./addon.node');

class NativeGraph {
  private nativeInstance;

  constructor(graphPath: string) {
    const rawGraph = fs.readFileSync(graphPath, {
      encoding: 'utf8',
    });
    this.nativeInstance = new addon.NativeGraph(JSON.parse(rawGraph));
  }

  test(): boolean {
    return this.nativeInstance.test();
  }
}

const now = performance.now();
const a = new NativeGraph('weekdayGraph.json');
const finish = performance.now();
console.log(a.test(), (finish - now).toFixed(2), 'ms');

export default NativeGraph;
