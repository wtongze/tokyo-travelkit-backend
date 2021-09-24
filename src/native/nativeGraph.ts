import path from 'path';
import fs from 'fs';

// eslint-disable-next-line import/no-unresolved
const addon = require('./addon.node');

const START_HOUR = 4;
const getCachePath = (name: string) =>
  path.resolve(__dirname, `../../cache/${name}`);

const getTimeScore = (t: string) => {
  const hour = parseInt(t.slice(0, 2), 10);
  const min = parseInt(t.slice(3, 5), 10);
  return hour * 60 + min + (hour < START_HOUR ? 24 * 60 : 0);
};

class NativeGraph {
  private nativeInstance;

  private timeDict;

  constructor(
    timeDictPath: string,
    graphPath: string,
    timetableStationMapPath: string,
    heuristicMapPath: string
  ) {
    this.timeDict = JSON.parse(
      fs.readFileSync(timeDictPath, { encoding: 'utf8' })
    );
    this.nativeInstance = new addon.NativeGraph(
      graphPath,
      timetableStationMapPath,
      heuristicMapPath
    );
  }

  dijkstra(from: string, to: string): string[] {
    return this.nativeInstance.dijkstra(from, to);
  }

  searchByFromTime(fromTime: string, from: string, to: string): string[] {
    const times: string[] = this.timeDict[from];
    const start = times.find((i) => getTimeScore(i) >= getTimeScore(fromTime));
    return this.dijkstra(`${start}@${from}`, `END@${to}`);
  }

  searchByToTime(toTime: string, from: string, to: string): string[] {
    const times: string[] = this.timeDict[to];
    const end = times.find((i, index) => {
      if (index < times.length - 1) {
        if (getTimeScore(times[index + 1]) > getTimeScore(toTime)) {
          return true;
        }
        return false;
      }
      return true;
    });
    return this.dijkstra(`START@${from}`, `${end}@${to}`);
  }
}

const now = performance.now();
const a = new NativeGraph(
  getCachePath('weekdayTimeDict.json'),
  getCachePath('weekdayGraph.txt'),
  getCachePath('weekdayTimetableStationMap.txt'),
  getCachePath('weekdayHeuristicMap.txt')
);
const finish = performance.now();

const now2 = performance.now();
// const result = a.searchByFromTime(
//   '07:25',
//   'odpt.Station:JR-East.NaritaAirportBranch.NaritaAirportTerminal2and3',
//   'odpt.Station:JR-East.Keiyo.Maihama'
// );
const result = a.searchByToTime(
  '15:00',
  'odpt.Station:JR-East.NaritaAirportBranch.NaritaAirportTerminal2and3',
  'odpt.Station:JR-East.Tokaido.Fujisawa'
);
const finish2 = performance.now();
console.log(result);
console.log('Import:', (finish - now).toFixed(2), 'ms');
console.log('Calc:', (finish2 - now2).toFixed(2), 'ms');

export default NativeGraph;
