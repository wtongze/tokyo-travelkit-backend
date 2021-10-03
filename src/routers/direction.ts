import express from 'express';
import { Station } from '../models/station';

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

directionRouter.get('/all/:from/:to', async (req, res) => {
  const from = await Station.findByPk(req.params.from);
  const to = await Station.findByPk(req.params.to);
  if (from && to) {
    const rawDirection = [
      '14:02@odpt.Station:Toei.Shinjuku.Iwamotocho',
      '14:11@odpt.Station:JR-East.ChuoSobuLocal.Akihabara',
      '14:11@odpt.TrainTimetable:JR-East.ChuoSobuLocal.1322B.Weekday',
      '14:13@odpt.TrainTimetable:JR-East.ChuoSobuLocal.1322B.Weekday',
      '14:15@odpt.TrainTimetable:JR-East.ChuoSobuLocal.1322B.Weekday',
      '14:18@odpt.TrainTimetable:JR-East.ChuoSobuLocal.1322B.Weekday',
      '14:18@odpt.Station:JR-East.ChuoSobuLocal.Kinshicho',
      '14:23@odpt.Station:JR-East.SobuRapid.Kinshicho',
      '14:24@odpt.Station:JR-East.SobuRapid.Kinshicho',
      '14:24@odpt.TrainTimetable:JR-East.SobuRapid.1229F.Weekday',
      '14:29@odpt.TrainTimetable:JR-East.SobuRapid.1229F.Weekday',
      '14:34@odpt.TrainTimetable:JR-East.SobuRapid.1229F.Weekday',
      '14:40@odpt.TrainTimetable:JR-East.SobuRapid.1229F.Weekday',
      '14:44@odpt.TrainTimetable:JR-East.SobuRapid.1229F.Weekday',
      '14:51@odpt.TrainTimetable:JR-East.SobuRapid.1229F.Weekday',
      '14:55@odpt.TrainTimetable:JR-East.SobuRapid.1229F.Weekday',
      '15:01@odpt.TrainTimetable:JR-East.Sobu.4229F.Weekday',
      '15:05@odpt.TrainTimetable:JR-East.Sobu.4229F.Weekday',
      '15:08@odpt.TrainTimetable:JR-East.Sobu.4229F.Weekday',
      '15:09@odpt.TrainTimetable:JR-East.Sobu.4229F.Weekday',
      '15:13@odpt.TrainTimetable:JR-East.Sobu.4229F.Weekday',
      '15:17@odpt.TrainTimetable:JR-East.Sobu.4229F.Weekday',
      '15:17@odpt.TrainTimetable:JR-East.Narita.4229F.Weekday',
      '15:23@odpt.TrainTimetable:JR-East.Narita.4229F.Weekday',
      '15:24@odpt.TrainTimetable:JR-East.Narita.4229F.Weekday',
      '15:30@odpt.TrainTimetable:JR-East.Narita.4229F.Weekday',
      '15:32@odpt.TrainTimetable:JR-East.NaritaAirportBranch.4229F.Weekday',
      '15:41@odpt.TrainTimetable:JR-East.NaritaAirportBranch.4229F.Weekday',
      '15:41@odpt.Station:JR-East.NaritaAirportBranch.NaritaAirportTerminal2and3',
      'END@odpt.Station:JR-East.NaritaAirportBranch.NaritaAirportTerminal2and3',
    ];
    rawDirection.unshift('14:00@odpt.Station:Toei.Shinjuku.Iwamotocho');
    let currType = getType(rawDirection[0]);
    let typeCount = 0;
    const result: string[][] = [];
    for (let i = 0; i < rawDirection.length; i += 1) {
      if (getType(rawDirection[i]) !== currType) {
        currType = getType(rawDirection[i]);
        typeCount += 1;
      }
      if (!Array.isArray(result[typeCount])) {
        result[typeCount] = [];
      }
      result[typeCount].push(rawDirection[i]);
    }
    res.send(result);
  } else {
    res.sendStatus(404);
  }
});

export default directionRouter;
