import fs from 'fs';
import { uniq } from 'lodash';
import { operatorList } from './const';
import { Station } from './models/station';
import { TrainTimetable } from './models/trainTimetable';

const START_HOUR = 4;
const TRANSFER_COST = 5;
const getTimeScore = (t: string) => {
  const hour = parseInt(t.slice(0, 2), 10);
  const min = parseInt(t.slice(3, 5), 10);
  return hour * 60 + min + (hour < START_HOUR ? 24 * 60 : 0);
};
const getTimeDiff = (a: string, b: string) =>
  Math.abs(getTimeScore(b) - getTimeScore(a));

interface TimeDict {
  [station: string]: string[];
}

interface AdjcentList {
  [from: string]: {
    [to: string]: number;
  };
}

class Graph {
  private adjcentList: AdjcentList;

  constructor() {
    this.adjcentList = {};
  }

  public addEdge(from: string, to: string, cost: number) {
    if (this.adjcentList[from] === undefined) {
      this.adjcentList[from] = {};
    }
    this.adjcentList[from][to] = cost;
  }

  public toJSON(): string {
    return JSON.stringify(this.adjcentList);
  }
}

(async () => {
  const timetables = await TrainTimetable.findAll({
    where: {
      odptOperator: operatorList,
      odptCalendar: 'odpt.Calendar:Weekday',
    },
  });

  const timeDict: TimeDict = {};
  for (const timetable of timetables) {
    for (const obj of timetable.odptTrainTimetableObject) {
      if (obj.odptArrivalStation && obj.odptArrivalTime) {
        if (timeDict[obj.odptArrivalStation] === undefined) {
          timeDict[obj.odptArrivalStation] = [];
        }
        timeDict[obj.odptArrivalStation].push(obj.odptArrivalTime);
      }
      if (obj.odptDepartureStation && obj.odptDepartureTime) {
        if (timeDict[obj.odptDepartureStation] === undefined) {
          timeDict[obj.odptDepartureStation] = [];
        }
        timeDict[obj.odptDepartureStation].push(obj.odptDepartureTime);
      }
    }
  }

  const graph = new Graph();

  for (const staId of Object.keys(timeDict)) {
    timeDict[staId] = uniq(timeDict[staId]).sort(
      (a, b) => getTimeScore(a) - getTimeScore(b)
    );
  }

  for (const staId of Object.keys(timeDict)) {
    graph.addEdge(`${timeDict[staId][0]}@${staId}`, `END@${staId}`, 0);
    for (let i = 0; i < timeDict[staId].length - 1; i += 1) {
      const currTime = timeDict[staId][i];
      const nextTime = timeDict[staId][i + 1];
      graph.addEdge(
        `${currTime}@${staId}`,
        `${nextTime}@${staId}`,
        getTimeDiff(currTime, nextTime)
      );
      graph.addEdge(`${nextTime}@${staId}`, `END@${staId}`, 0);
    }

    const station = await Station.findByPk(staId);
    if (station) {
      if (station.odptConnectingStation !== null) {
        for (const currTime of timeDict[staId]) {
          for (const transferSta of station.odptConnectingStation) {
            if (transferSta !== null) {
              if (timeDict[transferSta]) {
                const transferTime = timeDict[transferSta].find(
                  (i) =>
                    getTimeScore(i) >= getTimeScore(currTime) + TRANSFER_COST
                );
                // console.log(currTime, staId, transferTime, transferSta);
                graph.addEdge(
                  `${currTime}@${staId}`,
                  `${transferTime}@${transferSta}`,
                  TRANSFER_COST
                );
              }
            }
          }
        }
      }
    } else {
      throw new Error(`Station ${staId} not found.`);
    }
  }

  for (const currTimetable of timetables) {
    if (currTimetable.odptPreviousTrainTimetable) {
      for (const previousTimetableId of currTimetable.odptPreviousTrainTimetable) {
        const previousTimetable = await TrainTimetable.findByPk(
          previousTimetableId
        );
        if (previousTimetable) {
          const lastItem =
            previousTimetable.odptTrainTimetableObject[
              previousTimetable.odptTrainTimetableObject.length - 1
            ];
          const firstItem = currTimetable.odptTrainTimetableObject[0];
          if (lastItem.odptArrivalTime && firstItem.odptDepartureTime) {
            graph.addEdge(
              `${lastItem.odptArrivalTime}@${previousTimetable.owlSameAs}`,
              `${firstItem.odptDepartureTime}@${currTimetable.owlSameAs}`,
              getTimeDiff(lastItem.odptArrivalTime, firstItem.odptDepartureTime)
            );
          }
        } else {
          throw new Error(`Timetable ${previousTimetableId} not found.`);
        }
      }
    }

    let index = 0;
    const maxIndex = currTimetable.odptTrainTimetableObject.length - 1;
    for (const currStopItem of currTimetable.odptTrainTimetableObject) {
      if (
        currStopItem.odptDepartureTime &&
        currStopItem.odptDepartureStation &&
        currStopItem.odptArrivalTime === undefined &&
        currStopItem.odptArrivalStation === undefined
      ) {
        graph.addEdge(
          `${currStopItem.odptDepartureTime}@${currStopItem.odptDepartureStation}`,
          `${currStopItem.odptDepartureTime}@${currTimetable.owlSameAs}`,
          0
        );
        if (index > 0) {
          graph.addEdge(
            `${currStopItem.odptDepartureTime}@${currTimetable.owlSameAs}`,
            `${currStopItem.odptDepartureTime}@${currStopItem.odptDepartureStation}`,
            0
          );
        }
      } else if (
        currStopItem.odptDepartureTime === undefined &&
        currStopItem.odptDepartureStation === undefined &&
        currStopItem.odptArrivalTime &&
        currStopItem.odptArrivalStation
      ) {
        graph.addEdge(
          `${currStopItem.odptArrivalTime}@${currTimetable.owlSameAs}`,
          `${currStopItem.odptArrivalTime}@${currStopItem.odptArrivalStation}`,
          0
        );
        if (index < maxIndex) {
          graph.addEdge(
            `${currStopItem.odptArrivalTime}@${currStopItem.odptArrivalStation}`,
            `${currStopItem.odptArrivalTime}@${currTimetable.owlSameAs}`,
            0
          );
        }
      } else if (
        currStopItem.odptDepartureTime &&
        currStopItem.odptDepartureStation &&
        currStopItem.odptArrivalTime &&
        currStopItem.odptArrivalStation
      ) {
        graph.addEdge(
          `${currStopItem.odptArrivalTime}@${currTimetable.owlSameAs}`,
          `${currStopItem.odptArrivalTime}@${currStopItem.odptArrivalStation}`,
          0
        );
        graph.addEdge(
          `${currStopItem.odptDepartureTime}@${currStopItem.odptDepartureStation}`,
          `${currStopItem.odptDepartureTime}@${currTimetable.owlSameAs}`,
          0
        );
        graph.addEdge(
          `${currStopItem.odptArrivalTime}@${currTimetable.owlSameAs}`,
          `${currStopItem.odptDepartureTime}@${currTimetable.owlSameAs}`,
          0
        );
      }

      if (index < maxIndex) {
        const nextStopItem = currTimetable.odptTrainTimetableObject[index + 1];
        if (
          (currStopItem.odptDepartureTime || currStopItem.odptArrivalTime) &&
          (nextStopItem.odptArrivalTime || nextStopItem.odptDepartureTime)
        ) {
          graph.addEdge(
            `${
              currStopItem.odptDepartureTime || currStopItem.odptArrivalTime
            }@${currTimetable.owlSameAs}`,
            `${
              nextStopItem.odptArrivalTime || nextStopItem.odptDepartureTime
            }@${currTimetable.owlSameAs}`,
            getTimeDiff(
              currStopItem.odptDepartureTime || currStopItem.odptArrivalTime!,
              nextStopItem.odptArrivalTime || nextStopItem.odptDepartureTime!
            )
          );
        }
      }
      index += 1;
    }
  }

  fs.writeFileSync('weekdayGraph.json', graph.toJSON());
})();
