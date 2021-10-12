import express from 'express';
import { uniq } from 'lodash';
import { Station } from '../models/station';
import { TrainTimetable } from '../models/trainTimetable';
import { NativeGraph, getCachePath, getTimeScore } from '../native/nativeGraph';
import { getTrainTimetable } from './train';

const directionRouter = express.Router();

enum NodeType {
  STATION,
  TRAIN_TIMETABLE,
}

function getType(arg: string) {
  if (arg.indexOf('odpt.Station') >= 0) {
    return NodeType.STATION;
  }
  return NodeType.TRAIN_TIMETABLE;
}

const weekdayGraph = new NativeGraph(
  getCachePath('weekdayTimeDict.json'),
  getCachePath('weekdayGraph.txt'),
  getCachePath('weekdayTimetableStationMap.txt'),
  getCachePath('weekdayHeuristicMap.txt')
);

const saturdayHolidayGraph = new NativeGraph(
  getCachePath('saturdayHolidayTimeDict.json'),
  getCachePath('saturdayHolidayGraph.txt'),
  getCachePath('saturdayHolidayTimetableStationMap.txt'),
  getCachePath('saturdayHolidayHeuristicMap.txt')
);

directionRouter.get('/all/:from/:to', async (req, res) => {
  const from = await Station.findByPk(req.params.from);
  const { fromTime, toTime } = req.query;
  const to = await Station.findByPk(req.params.to);
  const { calendar } = req.query;

  const operatorPref: { [operator: string]: boolean } = {
    Sotetsu: req.query.Sotetsu === 'true',
    YokohamaMunicipal: req.query.YokohamaMunicipal === 'true',
    TamaMonorail: req.query.TamaMonorail === 'true',
    MIR: req.query.MIR === 'true',
    TWR: req.query.TWR === 'true',
    'JR-East': req.query['JR-East'] === 'true',
    TokyoMetro: req.query.TokyoMetro === 'true',
    Toei: req.query.Toei === 'true',
  };

  if (from && to && (fromTime || toTime) && operatorPref && calendar) {
    if (typeof fromTime === 'string' || typeof toTime === 'string') {
      let routing: any;
      const startTime = performance.now();
      if (typeof fromTime === 'string') {
        if (calendar === 'weekday') {
          routing = weekdayGraph.searchByFromTime(
            fromTime,
            from.owlSameAs,
            to.owlSameAs,
            operatorPref
          );
        } else {
          routing = saturdayHolidayGraph.searchByFromTime(
            fromTime,
            from.owlSameAs,
            to.owlSameAs,
            operatorPref
          );
        }

        routing.path.unshift(`${fromTime}@${from.owlSameAs}`);
        routing.ref.unshift(from.owlSameAs);
      } else if (typeof toTime === 'string') {
        if (calendar === 'weekday') {
          routing = weekdayGraph.searchByToTime(
            toTime,
            from.owlSameAs,
            to.owlSameAs,
            operatorPref
          );
        } else {
          routing = saturdayHolidayGraph.searchByToTime(
            toTime,
            from.owlSameAs,
            to.owlSameAs,
            operatorPref
          );
        }

        routing.path.push(`${toTime}@${to.owlSameAs}`);
        routing.ref.push(to.owlSameAs);
      }
      const endTime = performance.now();
      if (routing && routing.cost > 0) {
        const rawPath = [...routing.path];
        const rawRef = [...routing.ref];

        let currType = getType(rawPath[0]);
        let typeCount = 0;
        const result: string[][] = [];
        const refResult: string[][] = [];
        for (let i = 0; i < rawPath.length; i += 1) {
          if (getType(rawPath[i]) !== currType) {
            currType = getType(rawPath[i]);
            typeCount += 1;
          }
          if (!Array.isArray(result[typeCount])) {
            result[typeCount] = [];
            refResult[typeCount] = [];
          }
          result[typeCount].push(rawPath[i]);
          refResult[typeCount].push(rawRef[i]);
        }

        const rawDirections: string[][] = [];
        result.forEach((item) => {
          rawDirections.push(
            uniq([
              item[0].startsWith('START@') ? item[1] : item[0],
              item[item.length - 1].startsWith('END@')
                ? item[item.length - 2]
                : item[item.length - 1],
            ])
          );
        });

        const directions: any[] = [];

        for (const [index, item] of rawDirections.entries()) {
          // console.log(item, refResult[index]);
          if (index === 0 && item.length >= 2) {
            // console.log(item, from.owlSameAs, fromTime);
            const currStart = item.find((i) => !i.startsWith('START@'));
            // console.log(item, currStart);
            if (currStart) {
              const [currFromTime, currFrom] = currStart.split('@');
              directions.push({
                type: 'START_TRANSFER',
                fromTime: typeof toTime === 'string' ? currFromTime : fromTime,
                from: typeof toTime === 'string' ? from.owlSameAs : currFrom,
              });
            }
          } else if (index === rawDirections.length - 1 && item.length >= 2) {
            const currEnd = item.reverse().find((i) => !i.startsWith('END@'));
            if (currEnd) {
              const [currToTime, currTo] = currEnd.split('@');
              directions.push({
                type: 'END_TRANSFER',
                toTime: typeof fromTime === 'string' ? currToTime : toTime,
                to: typeof fromTime === 'string' ? to.owlSameAs : currTo,
              });
            }
          } else if (
            item.every((i) => i.indexOf('odpt.Station') > 0) &&
            index !== rawDirections.length - 1 &&
            index !== 0
          ) {
            directions.push({
              type: 'TRANSFER',
            });
          } else if (item.every((i) => i.indexOf('odpt.TrainTimetable') > 0)) {
            const currFrom = refResult[index][0];
            const currTo = refResult[index][refResult[index].length - 1];
            const trainTimetable = await TrainTimetable.findByPk(
              item[0].slice(6)
            );
            const viaRailways = uniq(
              refResult[index].map(
                (i) =>
                  `odpt.Railway:${i
                    .split(':')[1]
                    .split('.')
                    .slice(0, 2)
                    .join('.')}`
              )
            );
            directions.push({
              type: 'TRAIN',
              fromTime: item[0].slice(0, 5),
              from: currFrom,
              toTime: item[1].slice(0, 5),
              to: currTo,
              trainTimetable: trainTimetable
                ? await getTrainTimetable(trainTimetable)
                : {},

              via: viaRailways.map((r) => {
                const stops = uniq(
                  refResult[index].filter(
                    (i) =>
                      i.indexOf(`${r.split(':')[1]}.`) > 0 &&
                      i !== currFrom &&
                      i !== currTo
                  )
                );
                return {
                  railwayId: r,
                  stops,
                };
              }),
            });
          }
        }
        // console.log(routing);
        const calcFromTime =
          typeof fromTime === 'string'
            ? fromTime
            : routing.path
                .find((i: string) => !i.startsWith('START@'))
                .split('@')[0];
        const calcToTime =
          typeof toTime === 'string'
            ? toTime
            : routing.path
                .reverse()
                .find((i: string) => !i.startsWith('END@'))
                .split('@')[0];
        res.send({
          from: from.owlSameAs,
          fromTime: calcFromTime,
          to: to.owlSameAs,
          toTime: calcToTime,
          time:
            getTimeScore(calcToTime) < getTimeScore(calcFromTime)
              ? getTimeScore(calcToTime) + 24 * 60 - getTimeScore(calcFromTime)
              : getTimeScore(calcToTime) - getTimeScore(calcFromTime),
          searchTime: parseFloat((endTime - startTime).toFixed(2)),
          difficulty: routing.difficulty,
          directions,
        });
      } else {
        res.sendStatus(404);
      }
    }
  } else {
    res.sendStatus(404);
  }
});

export default directionRouter;
