import fs from 'fs';
// eslint-disable-next-line import/no-unresolved
const addon = require('./addon.node');

class NativeGraph {
  private nativeInstance;

  constructor(graphPath: string) {
    const rawGraph = JSON.parse(
      fs.readFileSync(graphPath, {
        encoding: 'utf8',
      })
    );
    this.nativeInstance = new addon.NativeGraph(rawGraph);
  }

  test(): boolean {
    return this.nativeInstance.test();
  }

  dijkstra(from: string, to: string): string[] {
    return this.nativeInstance.dijkstra(from, to);
  }
}

const now = performance.now();
const a = new NativeGraph('weekdayGraph.json');
const finish = performance.now();
console.log('Import', (finish - now).toFixed(2), 'ms');

const now2 = performance.now();
const result = a.dijkstra(
  '09:10@odpt.Station:JR-East.Keiyo.Soga',
  'END@odpt.Station:JR-East.NaritaAirportBranch.NaritaAirportTerminal2and3'
);
const finish2 = performance.now();
console.log(result);
console.log('Calc', (finish2 - now2).toFixed(2), 'ms');

export default NativeGraph;
